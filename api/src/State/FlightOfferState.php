<?php

namespace App\State;

use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use ApiPlatform\State\ProviderInterface;
use App\Entity\FlightOffer;
use App\Entity\FlightOfferRequest;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use App\Repository\UserRepository;
use DateTime;
use DateTimeInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Validator\Constraints\Date;

/* 
    Duffel API utilizes an auth token under the bearer notation and also requires a Duffel-version header field.
    query path: https://api.duffel.com/air/offer_requests
    Method: Post
    Response Body: JSON Encapsulated under data object
*/

class FlightOfferState implements ProcessorInterface, ProviderInterface
{
    private string $token;

    public function __construct(private HttpClientInterface $client, private Security $s, private UserRepository $uRepo, private LoggerInterface $logger)
    {
        $this->token = $_ENV['DUFFEL_BEARER'];
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        // Handle the state
        if (!isset($this->token)) {
            throw new \Exception("Duffel token not set");
            return null;
        }
        // get user
        $user = $this->s->getUser();
        if (!$this->uRepo->doesUserHaveCurrentEvents($user->getUserIdentifier())) {
            throw new \Exception("User does not have current events");
            return null;
        }
        if (null == $data->returnDate)
        // decide whether this is one way or round trip
        // then execute the relevant function
        // if only the variables for a one way flight are set, then we know we are looking for one way flights
        {
            $flightOffers = $this->getOneWayFlightOffers(
                origin: $data->origin,
                destination: $data->destination,
                departureDate: $data->departureDate,
                maxConnections: $data->maxConnections,
            );
        } else  // if all variables needed for a round trip are set, then we know we are looking for round trip flights
        {
            // transform date to duffel format yyyy-mm-dd
            // $data['departureDate'] = date('Y-m-d', strtotime($data['departureDate']));
            // $data['returnDate'] = date('Y-m-d', strtotime($data['returnDate']));

            $flightOffers = $this->getRoundTripFlightOffers(
                origin: $data->origin,
                destination: $data->destination,
                departureDate: $data->departureDate,
                maxConnections: $data->maxConnections,
                returnDate: $data->returnDate
            );
        }
        // get the user from the database
        $user = $this->uRepo->findOneBy(['email' => $user->getUserIdentifier()]);
        // reset the offers
        $user->resetOffers();
        // save all offer id's to the user
        foreach ($flightOffers as $offer) {
            $this->logger->info("Adding offer id: " . $offer->id);
            $user->addOfferIds($offer->id);
        }
        $user->setPassengerId($flightOffers[0]->passengerId);
        // persist the user
        $this->uRepo->save($user, true);
        $flightOfferRequest = new FlightOfferRequest(
            origin: $data->origin,
            destination: $data->destination,
            departureDate: $data->departureDate,
            maxConnections: $data->maxConnections,
            returnDate: $data->returnDate,
            flightOffers: $flightOffers,
            id: $flightOffers[0]->offerRequestId
        );
        return $flightOfferRequest;
    }

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
            return $this->getFlightOfferById($uriVariables['id']);
        } // if none of the above conditions are met, then return null (404)
        return null;
    }

    public function getOneWayFlightOffers(string $origin, string $destination, DateTimeInterface $departureDate, int $maxConnections): FlightOffer
    {
        $departureDateString = $departureDate->format('Y-m-d');
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
                                'departure_date' => $departureDateString,
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

        $data = $response->toArray();
        $flightOffer = self::mapFlightOffersFromResponse($data)[0];
        return $flightOffer;
    }

    public function getRoundTripFlightOffers(string $origin, string $destination, DateTimeInterface $departureDate, DateTimeInterface $returnDate, int $maxConnections): array
    {
        $departureDateString = $departureDate->format('Y-m-d');
        $returnDateString = $returnDate->format('Y-m-d');
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
                                'departure_date' => $departureDateString,
                            ],
                            [ // return flight
                                'origin' => $destination,
                                'destination' => $origin,
                                'departure_date' => $returnDateString,
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

        $data = $response->toArray();

        $offers = self::mapFlightOffersFromResponse($data);
        return $offers;
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

        $data = $response->toArray();
        $flightOffer = new FlightOffer(
            origin: $data['data']['slices'][0]['origin']['iata_city_code'],
            destination: $data['data']['slices'][0]['destination']['iata_city_code'],
            departureDate: new DateTime($data['data']['slices'][0]['departure_date']),
            returnDate: (isset($data['data']['slices'][1])) ? new DateTime($data['slices'][1]['departure_date']) : null,
            offerId: $data['data']['id'],
            slices: $data['data']['slices'],
            passengerId: $data['data']['passengers'][0]['id']
        );
        return $flightOffer;
    }

    public static function mapFlightOffersFromResponse($data): array
    {
        $flightOffers = [];
        foreach ($data['data']['offers'] as $offer) {
            array_push(
                $flightOffers,
                new FlightOffer(
                    id: $offer['id'],
                    origin: $offer['slices'][0]['origin']['iata_city_code'],
                    destination: $offer['slices'][0]['destination']['iata_city_code'],
                    departureDate: new DateTime($offer['slices'][0]['segments'][0]['departing_at']),
                    returnDate: (isset($offer['slices'][1]['segments'][0]['departing_at'])) ? new DateTime($offer['slices'][1]['segments'][0]['departing_at']) : null,
                    offerId: $offer['id'],
                    offerRequestId: $data['data']['id'],
                    slices: $offer['slices'], // slices are per offer, so should be multiple flight offer objects
                    passengerId: $data['data']['passengers'][0]['id'],
                    owner: $offer['owner'],
                    totalCost: $offer['total_amount'],
                )
            );
        }
        return $flightOffers;
    }
}
