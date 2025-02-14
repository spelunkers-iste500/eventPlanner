<?php
// api/src/State/DuffelOrderProvider.php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use ApiPlatform\State\ProviderInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\FlightOrder;

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
        $orders = $this->getOrders();
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
    public function getOrders(): array
    {
        $response = $this->client->request(
            'GET',
            'https://api.duffel.com/air/orders',
            [
                'headers' => [
                    'Duffel-Version' => "v2",
                    'Authorization' => 'Bearer ' . $this->token,
                ]
            ]
        );

        return $response->toArray();
    }
}