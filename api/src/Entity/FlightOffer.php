<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\State\DuffelOfferProvider;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;

#[ApiResource]
#[GetCollection(
    provider: DuffelOfferProvider::class,
    uriTemplate: '/flight_offers/{destination}/{origin}/{date}/{maxConnections}.{_format}',
)]
#[Get(
    provider: DuffelOfferProvider::class,
    uriTemplate: '/flight_offers/{id}.{_format}',
)]
class FlightOffer
{
    #[Apiresource(identifier: true)]
    public string $offerId;
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
        $this->offerId = $offerId;
        $this->offers = $offers;
        $this->slices = $slices;
        $this->passengers = $passengers;
    }

    public function getId(): string
    {
        return $this->offerId;
    }
}
