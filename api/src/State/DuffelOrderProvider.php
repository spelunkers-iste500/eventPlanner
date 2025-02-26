<?php
// api/src/State/DuffelOrderProvider.php

namespace App\State;

use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use ApiPlatform\State\ProviderInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\FlightOrder;
use App\Entity\Budget;
use Symfony\Bundle\SecurityBundle\Security;
#use ApiPlatform\State\ProcessorInterface;

final class DuffelOrderProvider implements ProviderInterface{
    private string $token;

    public function __construct(private HttpClientInterface $client, private EntityManagerInterface $entityManager, private Security $security)
    {
        $this->token = $_ENV['DUFFEL_BEARER'];
    }

    /**
     * Provides order data from the Duffel API.
     */
    public function provide(Operation $operation, array $uriVariables = [],  array $context = []): object|array|null
    {

        $user = $this->security->getUser();

        //subject to change when offerId is stored
        //$offerId = $user ? $user->getOfferId() : null;
        //$name = $user->getName();
        //$email = $user->getEmail();
        
       // $offerId = "off_0000ArSLPNkXuPCCkkJP4o";
       // $name = "Gavin";
       // $email = "gwh8959@g.rit.edu";
       // if (!$offerId){
        //    throw new \Exception("Offer ID not found for user");
        //}

        //$orders = $this->createOrder($offerId, $name, $email);
        //$flightOrder = new FlightOrder();
        //$flightOrder->setOfferData($orders);

        //$this->entityManager->persist($flightOrder);
        //$this->entityManager->flush();

        //return $flightOrder;
        if ($operation instanceof CollectionOperationInterface){
            return $this->createOrder(
                $uriVariables['offer_id'],
                $uriVariables['passenger_id'],
                $uriVariables['first_name'],
                $uriVariables['family_name'],
                $uriVariables['title'],
                $uriVariables['gender'],
                $uriVariables['email'],
                $uriVariables['birthday'],
                $uriVariables['phone_number'],
            );
        }
    }

    /**
     * Fetches orders from the Duffel API.
     * 
     * NEED PASSENGER_ID, OFFER_ID, FIRST NAME (given), LAST NAME (family), TITLE (MR,MRS), Gender, Email, Birthday 
     * 
     * DOCUMENTATION: https://duffel.com/docs/api/v2/orders
     */
    public function createOrder(string $offer_id, string $passenger_id, string $first_name, string $family_name, string $title, string $gender, string $email, string $birthday, string $phone_number): FlightOrder
    {
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
                        'selected_offers' => [$offer_id],
                        'passengers' => [
                            [
                                "id" => $passenger_id, // Use the passenger ID from the offer
                                "title" => $title, // Adjust based on actual user data
                                "given_name" => $first_name,
                                "family_name" => $family_name, // Ensure a valid last name
                                "gender" => $gender, // "m" for male, "f" for female
                                "email" => $email,
                                "born_on" => $birthday, // Must be valid date format YYYY-MM-DD
                                "phone_number" => $phone_number, // Must be in international format
                            ]
                        ],
                    ]
                ]
            ]
        );

        if ($response->getStatusCode() !== 200) {
            throw new \Exception("Error creating order: " . $response->getContent(false));
        }

        $responseData = $response->toArray()['data'];

        $flightOrder = new FlightOrder(
            order_id: $responseData['id'],  // Ensure this field exists in the API response
            offer_id: $offer_id, 
            passenger_id: $passenger_id, 
            first_name: $first_name, 
            family_name: $family_name,
            title: $title,
            gender: $gender, 
            email: $email,
            birthday: $birthday,
            phone_number: $phone_number
        );
    
        $flightOrder->setData(json_encode($responseData));
    
        return $flightOrder;
    }


    /**
     * I HAVE TO GET THE FLIGHT COST FOR THIS PROCESSOR
     * EVERYTHING MUST BE TESTED HERE
     * entity functions not working
     * 
     */
   /** public function process(FlightOrder $flightOrder): void
   * {
  *      $user = $flightOrder->getUser();
 *       $budget = $this->entityManager->getRepository(Budget::class)->findOneBy(['financialPlannerID' => $user]);
*
    *    if ($budget) {
    *        $totalAmount = $budget->getTotal();  // You can adjust based on which budget category needs to be updated
    *        $spentAmount = $budget->getSpentBudget();
    *        $newTotal = $totalAmount - $flightOrder->getTotalPrice(); // Assuming getTotalPrice() returns the price of the flight order
    *        $budget->setTotal($newTotal);  // Update the total budget
    *        
    *        // Update other budget fields as needed
    *        $this->entityManager->flush();
    *    }
    *} 
    */
}