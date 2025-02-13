<?php
// api/src/State/DuffelOrderProvider.php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use ApiPlatform\State\ProviderInterface;

final class DuffelOrderProvider implements ProviderInterface
{
    private string $token;

    public function __construct(private HttpClientInterface $client)
    {
        $this->token = $_ENV['DUFFEL_BEARER'];
    }

    /**
     * Provides order data from the Duffel API.
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $orders = $this->getOrders();
        return $orders;
    }

    /**
     * Fetches orders from the Duffel API.
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