<?php

namespace App\State;

use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Place;

final class DuffelPlaceProvider implements ProviderInterface
{
    private string $token;

    public function __construct(private HttpClientInterface $client)
    {
        $this->token = $_ENV['DUFFEL_BEARER'];
    }
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        if ($operation instanceof CollectionOperationInterface) {
            if (!isset($uriVariables['query'])) {
                return null;
            }
            $places = $this->getPlaces($uriVariables['query']);
            return $places;
        } else {
            return $this->getPlaceById($uriVariables['id']);
        }
        // return $this->getPlaceById($uriVariables['id']);
    }
    public function getPlaces(string $query): array
    {
        $response = $this->client->request(
            'GET',
            'https://api.duffel.com/places/suggestions?query=' . urlencode($query),
            [
                'headers' => [
                    'Duffel-Version' => "v2",
                    'Authorization' => 'Bearer ' . $this->token,
                ],
            ],
        );
        $placesFromDuffel = $response->toArray()['data'];
        $places = [];
        foreach ($placesFromDuffel as $place) {
            if ($place['iata_country_code'] == "US") {
                array_push($places, new Place(
                    id: $place['id'],
                    name: $place['name'],
                    type: $place['type'],
                    iataCode: $place['iata_code'],
                    cityName: $place['iata_city_code'],
                ));
            } else {
                continue;
            }
        }
        return $places;
    }
    public function getPlaceById(string $id): Place
    {
        // city id starts with cit, airport id starts with arp
        if (!isset($id)) {
            return null;
        }
        if (str_starts_with($id, 'arp')) {
            $url = 'https://api.duffel.com/air/airports/' . urlencode($id);
            $type = 'airport';
        } elseif (str_starts_with($id, 'cit')) {
            $url = 'https://api.duffel.com/air/cities/' . urlencode($id);
            $type = 'city';
        } else {
            return null;
        }
        $response = $this->client->request(
            'GET',
            $url,
            [
                'headers' => [
                    'Duffel-Version' => "v2",
                    'Authorization' => 'Bearer ' . $this->token,
                ],
            ],
        );
        $placeFromDuffel = $response->toArray()['data'];
        return new Place(
            id: $placeFromDuffel['id'],
            name: $placeFromDuffel['name'],
            type: $type,
            iataCode: $placeFromDuffel['iata_code'],
            cityName: ($type == 'city') ? $placeFromDuffel['iata_code'] : $placeFromDuffel['iata_city_code'],
        );
    }
}
