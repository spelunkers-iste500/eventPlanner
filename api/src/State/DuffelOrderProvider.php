<?php
// api/src/State/DuffelOrderProvider.php

namespace App\State;

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
        
        $offerId = "off_0000ArSLPNkXuPCCkkJP4o";
        $name = "Gavin";
        $email = "gwh8959@g.rit.edu";
        if (!$offerId){
            throw new \Exception("Offer ID not found for user");
        }

        $orders = $this->createOrder($offerId, $name, $email);
        $flightOrder = new FlightOrder();
        $flightOrder->setOfferData($orders);

        $this->entityManager->persist($flightOrder);
        $this->entityManager->flush();

        return $flightOrder;
    }

    /**
     * Fetches orders from the Duffel API.
     * 
     * NEED PASSENGER_ID, OFFER_ID, FIRST NAME (given), LAST NAME (family), TITLE (MR,MRS), Gender, Email, Birthday 
     * 
     * DOCUMENTATION: https://duffel.com/docs/api/v2/orders
     */
    public function createOrder(string $offerid, string $name, string $email): array
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
                        'selected_offers' => [$offerid],
                        'passengers' => [
                            [
                                "id" => "pas_0000ArSLPNOvCntlfgC8Mt", // Use the passenger ID from the offer
                                "title" => "Mr", // Adjust based on actual user data
                                "given_name" => $name,
                                "family_name" => "Hunsinger", // Ensure a valid last name
                                "gender" => "m", // "m" for male, "f" for female
                                "email" => $email,
                                "born_on" => "2003-03-28", // Must be valid date format YYYY-MM-DD
                                "phone_number" => "+15706921420", // Must be in international format
                            ]
                        ],
                    ]
                ]
            ]
        );

        if ($response->getStatusCode() !== 200) {
            throw new \Exception("Error creating order: " . $response->getContent(false));
        }

        return $response->toArray();
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