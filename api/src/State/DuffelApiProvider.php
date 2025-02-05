<?php
// api/src/State/DuffelApiProvider.php

/*
references:
    https://api-platform.com/docs/core/state-providers/
    https://duffel.com/docs/api/offer-requests/create-offer-request
    https://symfony.com/doc/current/http_client.html
*/

namespace App\State;

use App\Entity\Flight;
use Symfony\Contracts\HttpClient\HttpClientInterface;

final class DuffelApiProvider implements ProviderInterface{
    private HttpClientInterface $client;
    private string $apiKey;

    public function __construct(HttpClientInterface $client, string $apiKey) {
        $this->client = $client;
        $this->apiKey = $apiKey;
    }
    /* 
        Duffel API utilizes an auth token under the bearer notation and also requires a Duffel-version header field.

        NEED TO GENERATE A BEARER TOKEN PRIOR TO MAKING AN OFFER REQUEST: https://duffel.com/docs/api/overview/making-requests/authentication
            This will be used as the API Key for the constructor and getFlights()

        query path: https://api.duffel.com/air/offer_requests
        Method: Post
        Response Body: JSON Encapsulated under data object
    */
    public function getFlights(string $origin, string $destination, string $departureDate, int $passengerCount): array
{
    $response = $this->client->request('POST', 'https://api.duffel.com/air/1.0/offer_requests', [
        'headers' => [
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
        ],
        'json' => [
            'slices' => [
                [
                    'origin' => $origin,
                    'destination' => $destination,
                    'departure_date' => $departureDate,
                ]
            ],
            'passengers' => [
                [
                    'type' => 'adult',
                    'count' => $passengerCount,
                ]
            ],
            'currency' => 'USD',
            'cabin_class' => 'economy',
        ],
    ]);

    $data = $response->toArray();

    // Extract and process flight data from the response
    return $this->mapToFlightEntities($data);
}

//Flight entity made itself after adding this function that maps the API call to the Flight Entities
private function mapToFlightEntities(array $data): array
    {
        $flights = [];
        foreach ($data['flights'] as $flightData) {
            $flight = new Flight();
            $flight->setOrigin($flightData['origin']);
            $flight->setDestination($flightData['destination']);
            $flights[] = $flight;
        }

        return $flights;
}
}