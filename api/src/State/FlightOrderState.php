<?php
// api/src/State/DuffelOrderProvider.php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\FlightOrder;
use ApiPlatform\State\ProcessorInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Psr\Log\LoggerInterface as Logger;
use Symfony\Bundle\SecurityBundle\Security;
use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\State\ProviderInterface;
use App\Repository\UserRepository;

/**
 * Processes and provides the order info, updates related entities on persist.
 */
final class FlightOrderState implements ProcessorInterface, ProviderInterface
{
    private string $token;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private HttpClientInterface $client,
        private Security $security,
        private Logger $logger,
        private UserRepository $uRepo
    ) {
        $this->token = $_ENV['DUFFEL_BEARER'];
    }

    /**
     * Provides order data from the Duffel API.
     * @param Operation $operation the operation being performed
     * @param array $uriVariables uri variables if any
     * @param array $context context if any
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        if (!isset($this->token)) {
            throw new \Exception("Duffel token not set");
            return null;
        }
        if (isset(
            $uriVariables['id']
        ) && (str_contains($uriVariables['id'], 'orq'))) // if the id is set, then we know we are looking for a specific flight offer 
        {
            return $this->getFlightOrderById($uriVariables['id']);
        } // if none of the above conditions are met, then return null (404)
        return null;
    }

    /**
     * Provides order data from the Duffel API.
     * @param mixed $data this should be a serialized FlightOrder from the post request
     * @param Operation $operation the operation being performed
     * @param array $uriVariables uri variables if any
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): FlightOrder|null
    {
        // data object will be a flight order
        if (!isset($this->token)) {
            throw new \Exception("Duffel token not set");
            return null;
        }
        // check if offer id is in the users offer id array
        $userId = $this->security->getUser()->getUserIdentifier();
        $user = $this->uRepo->getUserById($userId);
        if (!in_array($data->offerId, $user->getOfferIds())) {
            throw new \Exception("Offer ID not found in user's offer IDs.");
        }
        return $this->createOrder($data);
    }

    /**
     * Fetches a flight order by ID from the Duffel API.
     * DOCUMENTATION: https://duffel.com/docs/api/v2/orders
     * @param string $id the order ID, starts with 'ord_'
     * @return FlightOrder the flight order
     */

    public function getFlightOrderById(string $id): FlightOrder
    {
        $method = 'GET';
        $url = 'https://api.duffel.com/air/orders/' . $id;
        $headers = [
            'Duffel-Version' => "v2",
            'Authorization' => 'Bearer ' . $this->token,
        ];
        $response = $this->client->request($method, $url, ['headers' => $headers]);
        $responseData = $response->toArray()['data'];
        $flightOrder = new FlightOrder(
            order_id: $id,  // Ensure this field exists in the API response
            offerId: $responseData['selected_offers'][0], // Ensure this field exists in the API response
            passenger_id: $responseData['passengers'][0]['id'], // Ensure this field exists in the API response
            first_name: $responseData['passengers'][0]['given_name'], // Ensure this field exists in the API response
            family_name: $responseData['passengers'][0]['family_name'], // Ensure this field exists in the API response
            title: $responseData['passengers'][0]['title'], // Ensure this field exists in the API response
            gender: $responseData['passengers'][0]['gender'],
            email: $responseData['passengers'][0]['email'],
            birthday: $responseData['passengers'][0]['born_on'],
            phone_number: $responseData['passengers'][0]['phone_number']
        );
        return $flightOrder;
    }

    /**
     * Fetches orders from the Duffel API.
     * 
     * NEED PASSENGER_ID, OFFER_ID, FIRST NAME (given), LAST NAME (family), TITLE (MR,MRS), Gender, Email, Birthday 
     * 
     * DOCUMENTATION: https://duffel.com/docs/api/v2/orders
     */
    public function createOrder(FlightOrder $data): FlightOrder
    {
        $userId = $this->security->getUser()->getUserIdentifier();
        $user = $this->uRepo->getUserById($userId);
        // parse first and last name from users whole name
        $firstName = $user->getFirstName();
        $lastName = $user->getLastName();
        $gender = $user->getGender();
        $email = $user->getEmail();
        $passenger_id = $user->getPassengerId();
        $title = $user->getTitle();
        $phoneNum = $user->getPhoneNumber();
        $birthday = $user->getBirthday()->format('Y-m-d');

        $response = $this->client->request(
            'POST',
            'https://api.duffel.com/air/orders',
            [
                'headers' => [
                    'Duffel-Version' => "v2",
                    'Authorization' => 'Bearer ' . $this->token,
                ],
                'json' => [
                    'data' => [
                        /**
                         * Required fields, look into adding additional ones per documentation
                         * payments is omitted because all flights are put on hold
                         */

                        'type' => 'hold',
                        'selected_offers' => [$data->offerId],
                        'passengers' => [
                            [
                                "id" => $passenger_id, // Use the passenger ID from the offer
                                "title" => $title, // Adjust based on actual user data
                                "given_name" => $firstName,
                                "family_name" => $lastName, // Ensure a valid last name
                                "gender" => $gender, // "m" for male, "f" for female
                                "email" => $email,
                                "born_on" => $birthday, // Must be valid date format YYYY-MM-DD
                                "phone_number" => $phoneNum, // Must be in international format
                            ]
                        ],
                    ]
                ]
            ]
        );


        if ($response->getStatusCode() > 204) {
            throw new \Exception("Error creating order: " . $response->getStatusCode());
        }

        $responseData = $response->toArray();
        if (!isset($responseData['data'])) {
            throw new \Exception("Error: 'data' not found in API response.");
        }
        $responseData = $responseData['data'];

        $flightOrder = new FlightOrder(
            order_id: $responseData['id'],  // Ensure this field exists in the API response
            offerId: $data->offerId,
            passenger_id: $passenger_id,
            first_name: $firstName,
            family_name: $lastName,
            title: $title,
            gender: $gender,
            email: $email,
            birthday: $birthday,
            phone_number: $phoneNum
        );

        $flightOrder->setData(json_decode($responseData));

        // Example: Budget validation and updating
        // Fetch the budget (assuming only one budget exists)
        // $budget = $this->entityManager->getRepository(Budget::class)->findOneBy([]);

        // if (!$budget) {
        //     throw new \RuntimeException('No budget found.');
        // }

        // // Convert budget fields to float
        // $currentTotal = (float) $budget->total;
        // $currentSpent = (float) $budget->spentBudget;

        // // Assuming $orderTotal exists as the total cost of the order (not defined in your code yet)
        // $orderTotal = 100.00; // Example order total; replace with actual logic

        // // Ensure there's enough budget
        // if ($currentTotal < $orderTotal) {
        //     throw new \RuntimeException('Insufficient budget for this flight.');
        // }

        // // Deduct from total and add to spent
        // $budget->total = (string) ($currentTotal - $orderTotal);
        // $budget->spentBudget = (string) ($currentSpent + $orderTotal);
        // $budget->lastModified = new \DateTime(); // Update timestamp

        // $this->entityManager->persist($budget);
        // $this->entityManager->flush();

        return $flightOrder;
    }
}
