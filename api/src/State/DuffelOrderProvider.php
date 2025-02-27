<?php
// api/src/State/DuffelOrderProvider.php

namespace App\State;

use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use ApiPlatform\State\ProviderInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\FlightOrder;
use App\Entity\Budget;
use Psr\Log\LoggerInterface as Logger;
use Symfony\Bundle\SecurityBundle\Security;
#use ApiPlatform\State\ProcessorInterface;

final class DuffelOrderProvider implements ProviderInterface
{
    private string $token;

    public function __construct(private HttpClientInterface $client, private EntityManagerInterface $entityManager, private Security $security, private Logger $logger)
    {
        $this->token = $_ENV['DUFFEL_BEARER'];
    }

    /**
     * Provides order data from the Duffel API.
     */
    public function provide(Operation $operation, array $uriVariables = [],  array $context = []): object|array|null
    {

        $user = $this->security->getUser();
        //return $user;

        if ($operation instanceof CollectionOperationInterface){
            if((isset($uriVariables['offer_id'],
            $uriVariables['passenger_id'],
            $uriVariables['first_name'],
            $uriVariables['family_name'],
            $uriVariables['title'],
            $uriVariables['gender'],
            $uriVariables['email'],
            $uriVariables['birthday'],
            $uriVariables['phone_number'],))){
                return $this->createOrder(
                    $uriVariables['offer_id'],
                    $uriVariables['passenger_id'],
                    $uriVariables['first_name'],
                    $uriVariables['family_name'],
                    $uriVariables['title'],
                    $uriVariables['gender'],
                    $uriVariables['email'],
                    $uriVariables['birthday'],
                    $uriVariables['phone_number'], //needs to be in to +(country code)(area code)(phone number) format
                );
            }
        } else{
            return null;
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
}
