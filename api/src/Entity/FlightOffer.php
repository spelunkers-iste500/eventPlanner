<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\State\DuffelOfferProvider;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;

#[ApiResource]
#[GetCollection(
    provider: DuffelOfferProvider::class,
    uriTemplate: '/flight_offers/search/{destination}/{origin}/{date}/{maxConnections}.{_format}',
    uriVariables: ['origin', 'destination', 'date', 'maxConnections'],
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
    public string $date;

    public array $offers;

    public array $slices;

    public array $passengers;

    public function __construct(string $origin, string $destination, string $date, string $offerId, array $offers, array $slices, array $passengers)
    {
        $this->origin = $origin;
        $this->destination = $destination;
        $this->date = $date;
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
