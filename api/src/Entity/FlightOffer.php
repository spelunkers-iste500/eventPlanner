<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\State\DuffelOfferProvider;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use App\State\FlightOfferState;
use DateTime;
use DateTimeInterface;

#[ApiResource]
#[Get(
    provider: DuffelOfferProvider::class,
    security: "is_granted('view', object)"
)]
#[Post(
    processor: FlightOfferState::class,
    // security: "is_granted('book')"
    // normalizationContext: ['groups' => ['read:flightOffer']],
)]

class FlightOffer
{
    #[ApiResource(identifier: true)]
    public ?string $id;
    public string $origin;
    public string $destination;
    public DateTimeInterface $departureDate;
    public ?DateTimeInterface $returnDate = null;
    public ?array $offers;
    public ?array $slices;
    public ?array $passengers;
    public int $maxConnections;

    public function __construct(string $origin, string $destination, DateTimeInterface $departureDate, ?array $offers = null, ?array $slices = null, ?array $passengers = null, int $maxConnections = 1, ?DateTimeInterface $returnDate = null, ?string $offerId = null,)
    {
        $this->origin = $origin;
        $this->destination = $destination;
        $this->departureDate = $departureDate;
        $this->returnDate = $returnDate; // if return date is null, then not round trip
        $this->id = $offerId;
        $this->offers = $offers;
        $this->slices = $slices;
        $this->passengers = $passengers;
        $this->maxConnections = $maxConnections;
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
