<?php
// api/src/State/DuffelOrderProvider.php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use ApiPlatform\State\ProviderInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\FlightOrder;
use App\Entity\Budget;

final class DuffelOrderProvider implements ProviderInterface
{
    private string $token;

    public function __construct(private HttpClientInterface $client, private EntityManagerInterface $entityManager)
    {
        $this->token = $_ENV['DUFFEL_BEARER'];
    }

    /**
     * Provides order data from the Duffel API.
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {

        /**For testing I am searching for budgets based on lastModified times, but it will probably go by event or financial planner */
        $budget = $this->entityManager->getRepository(Budget::class)->findOneBy([], ['lastModified' => 'DESC']);

        if (!$budget) {
            throw new \RuntimeException("No budget found.");
        }

        /**
         * Adding budget manipulation here
         */
        $availableBudget = $budget->total - $budget->spentBudget;

        $orders = $this->createOrder();
        $flightOrder = new FlightOrder();
        $flightOrder->setOfferData($orders);

        $this->entityManager->persist($flightOrder);
        $this->entityManager->flush();

        return $flightOrder;
    }

    /**
     * Fetches orders from the Duffel API.
     * 
     * DOCUMENTATION: https://duffel.com/docs/api/v2/orders
     */
    public function createOrder(string $offerid): array
    {
        $response = $this->client->request(
            'GET',
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
                        
                        //'users' => '', unsure if this is required as of yet
                        'type' => 'hold',
                        'selected_offers' => [$offerid],
                        'passengers' => [
                            [
                                /**
                                 * list of personal information about a passenger
                                 */
                                'user_id' => "placeholder",
                            ],
                        
                        //taken from example will change to be dynamic
                        "id" => "pas_00009hj8USM7Ncg31cBCLL",
                        "given_name" => "Amelia",
                        "gender" => "f",
                        "family_name" => "Earhart",
                        "email" => "amelia@duffel.com",
                        "born_on" => "1987-07-24",
                        ],
                    ]
                ]
            ]
        );

        return $response->toArray();
    }
}