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
use App\Repository\UserRepository;
use DateTime;
use Symfony\Bundle\SecurityBundle\Security;

final class DuffelOfferProvider implements ProviderInterface
{
    private string $token;

    public function __construct(private HttpClientInterface $client, private Security $s, private UserRepository $uRepo)
    {
        $this->token = $_ENV['DUFFEL_BEARER'];
    }
    /* 
        Duffel API utilizes an auth token under the bearer notation and also requires a Duffel-version header field.
        query path: https://api.duffel.com/air/offer_requests
        Method: Post
        Response Body: JSON Encapsulated under data object
    */

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {

        if ($operation instanceof CollectionOperationInterface) // if the operation is searching for a collection of flight offers
        {
            // check access here, if user is not authenticated, return null
            if (!isset($this->token)) {
                return null;
            }
            // get user
            $user = $this->s->getUser();
            if (!$this->uRepo->doesUserHaveCurrentEvents($user->getUserIdentifier())) {
                return null;
            }

            if ((isset(
                $uriVariables['origin'],
                $uriVariables['destination'],
                $uriVariables['departureDate'],
                $uriVariables['returnDate'],
                $uriVariables['maxConnections']
            ))) // if all variables needed for a round trip are set, then we know we are looking for round trip flights
            {
                return $this->getRoundTripFlightOffers(
                    $uriVariables['origin'],
                    $uriVariables['destination'],
                    $uriVariables['departureDate'],
                    $uriVariables['returnDate'],
                    $uriVariables['maxConnections']
                );
            } else if (isset(
                $uriVariables['origin'],
                $uriVariables['destination'],
                $uriVariables['departureDate'],
                $uriVariables['maxConnections']
            )) // if only the variables for a one way flight are set, then we know we are looking for one way flights
            {
                return $this->getOneWayFlightOffers(
                    $uriVariables['origin'],
                    $uriVariables['destination'],
                    $uriVariables['departureDate'],
                    $uriVariables['maxConnections']
                );
            }
        } else if (isset(
            $uriVariables['id']
        )) // if the id is set, then we know we are looking for a specific flight offer 
        {
            return $this->getFlightOfferById($uriVariables['id']);
        } // if none of the above conditions are met, then return null (404)
        return null;
    }

    public function getOneWayFlightOffers(string $origin, string $destination, string $departureDate, int $maxConnections): FlightOffer
    {
        $response = $this->client->request(
            'POST',
            'https://api.duffel.com/air/offer_requests?supplier_timeout=3000',
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
                        // 'cabin_class' => 'economy',
                        'max_connections' => $maxConnections,
                    ],
                ]
            ]
        );

        $data = $response->toArray()['data'];

        return new FlightOffer(
            origin: $origin,
            destination: $destination,
            departureDate: $departureDate,
            offerId: $data['id'],
            offers: $data['offers'],
            slices: $data['slices'],
            passengers: $data['passengers']
        );
    }

    public function getRoundTripFlightOffers(string $origin, string $destination, string $departureDate, string $returnDate, int $maxConnections): FlightOffer
    {
        $response = $this->client->request(
            'POST',
            'https://api.duffel.com/air/offer_requests?&supplier_timeout=3000',
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
                        // 'cabin_class' => 'economy',
                        'max_connections' => $maxConnections,
                    ],
                ]
            ]
        );

        $data = $response->toArray()['data'];
        // return $data;
        return new FlightOffer(
            origin: $origin,
            destination: $destination,
            departureDate: $departureDate,
            returnDate: $returnDate,
            offerId: $data['id'],
            offers: $data['offers'],
            slices: $data['slices'],
            passengers: $data['passengers']
        );
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
        return $data;
        return new FlightOffer(
            origin: $data['origin'],
            destination: $data['destination'],
            departureDate: $data['date'],
            offerId: $data['id'],
            offers: $data['offers'],
            slices: $data['slices'],
            passengers: $data['passengers']
        );
    }
}
