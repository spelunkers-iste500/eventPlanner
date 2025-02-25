<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\State\DuffelOfferProvider;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;

#[ApiResource]
#[GetCollection(
    provider: DuffelOfferProvider::class,
    uriTemplate: '/flight_offers/search/{destination}/{origin}/{departureDate}/{maxConnections}.{_format}',
    uriVariables: ['origin', 'destination', 'departureDate', 'maxConnections'],
)]
#[GetCollection(
    provider: DuffelOfferProvider::class,
    uriTemplate: '/flight_offers/search/{destination}/{origin}/{departureDate}/{returnDate}/{maxConnections}.{_format}',
    uriVariables: ['origin', 'destination', 'departureDate', 'returnDate', 'maxConnections'],
)]
#[Get(
    provider: DuffelOfferProvider::class,
)]
class FlightOffer
{
    #[ApiResource(identifier: true)]
    public string $id;
    public string $origin;
    public string $destination;
    public string $departureDate;
    public ?string $returnDate;
    public array $offers;
    public array $slices;
    public array $passengers;

    public function __construct(string $origin, string $destination, string $departureDate, string $offerId, array $offers, array $slices, array $passengers, ?string $returnDate = null)
    {
        $this->origin = $origin;
        $this->destination = $destination;
        $this->departureDate = $departureDate;
        $this->returnDate = $returnDate; // if return date is null, then not round trip
        $this->id = $offerId;
        $this->offers = $offers;
        $this->slices = $slices;
        $this->passengers = $passengers;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function setId(string $id)
    {
        $this->id = $id;
    }
}
