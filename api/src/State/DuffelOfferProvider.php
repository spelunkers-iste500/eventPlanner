<?php
// api/src/State/DuffelApiProvider.php

/*
references:
    https://api-platform.com/docs/core/state-providers/
    https://duffel.com/docs/api/offer-requests/create-offer-request
    https://symfony.com/doc/current/http_client.html
*/

namespace App\State;

use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use ApiPlatform\State\ProviderInterface;
use App\Entity\FlightOffer;

final class DuffelOfferProvider implements ProviderInterface
{
    private string $token;

    public function __construct(private HttpClientInterface $client)
    {
        $this->token = $_ENV['DUFFEL_BEARER'];
    }
    /* 
        Duffel API utilizes an auth token under the bearer notation and also requires a Duffel-version header field.

        NEED TO GENERATE A BEARER TOKEN PRIOR TO MAKING AN OFFER REQUEST: https://duffel.com/docs/api/overview/making-requests/authentication
            This will be used as the API Key for the constructor and getFlights()

        query path: https://api.duffel.com/air/offer_requests
        Method: Post
        Response Body: JSON Encapsulated under data object
    */

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        if (!isset($uriVariables['origin'], $uriVariables['destination'], $uriVariables['date'], $uriVariables['maxConnections'])) {
            // throw 422 error
            return null; // or throw new \InvalidArgumentException('Missing required URI variables');
        }

        if ($operation instanceof CollectionOperationInterface) {
            $flights = $this->getOneWayFlightOffers($uriVariables['origin'], $uriVariables['destination'], $uriVariables['date'], $uriVariables['maxConnections']); //fix this to not be static (also does not work for testing)
            return $flights;
        }
        return $this->getFlightOfferById($uriVariables['id']);
    }

    public function getOneWayFlightOffers(string $origin, string $destination, string $departureDate, int $maxConnections): FlightOffer
    {
        $response = $this->client->request(
            'POST',
            'https://api.duffel.com/air/offer_requests?limit=10&supplier_timeout=3000',
            [
                'headers' => [
                    'Duffel-Version' => "v2",
                    'Authorization' => 'Bearer ' . $this->token,
                ],
                'json' => [
                    'data' => [
                        'slices' => [
                            [
                                'origin' => $origin,
                                'destination' => $destination,
                                'departure_date' => $departureDate,
                            ]
                        ],
                        'passengers' => [
                            [
                                'type' => 'adult'
                            ]
                        ],
                        'currency' => 'USD',
                        'cabin_class' => 'economy',
                    ],
                ]
            ]
        );

        $data = $response->toArray()['data'];

        return new FlightOffer(
            origin: $origin,
            destination: $destination,
            date: $departureDate,
            offerId: $data['id'],
            offers: $data['offers'],
            slices: $data['slices'],
            passengers: $data['passengers']
        );

        // return new FlightOffer($origin, $destination, $departureDate, $response['id']);
    }

    public function getRoundTripFlightOffers(string $origin, string $destination, string $departureDate, string $returnDate, int $passengerCount): array
    {
        $response = $this->client->request(
            'POST',
            'https://api.duffel.com/air/offer_requests?return_offers=true&supplier_timeout=10000',
            [
                'headers' => [
                    'Duffel-Version' => "v2",
                    'Authorization' => 'Bearer ' . $this->token,
                ],
                'json' => [
                    'data' => [
                        'slices' => [
                            [ // departing flight
                                'origin' => $origin,
                                'destination' => $destination,
                                'departure_date' => $departureDate,
                            ],
                            [ // return flight
                                'origin' => $destination,
                                'destination' => $origin,
                                'departure_date' => $returnDate,
                            ]
                        ],
                        'passengers' => [
                            [
                                'type' => 'adult'
                            ]
                        ],
                        'currency' => 'USD',
                        'cabin_class' => 'economy',
                    ],
                ]
            ]
        );

        $data = $response->toArray()['data']['offers'];

        return $data;
    }

    public function getFlightOfferById(string $id)
    {
        $response = $this->client->request(
            'GET',
            'https://api.duffel.com/air/offer_requests/' . $id,
            [
                'headers' => [
                    'Duffel-Version' => "v2",
                    'Authorization' => 'Bearer ' . $this->token,
                ],
            ]
        );

        $data = $response->toArray()['data'];

        return new FlightOffer(
            origin: $data['origin'],
            destination: $data['destination'],
            date: $data['date'],
            offerId: $data['id'],
            offers: $data['offers'],
            slices: $data['slices'],
            passengers: $data['passengers']
        );
    }
}
//Flight entity made itself after adding this function that maps the API call to the Flight Entities
// private function mapToFlightEntities(array $data): array
//     {
//         $flights = [];
//         foreach ($data['flights'] as $flightData) {
//             $flight = new Flight();
//             $flight->setOrigin($flightData['origin']);
//             $flight->setDestination($flightData['destination']);
//             $flights[] = $flight;
//         }

//         return $flights;
// }
// }