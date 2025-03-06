<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\State\DuffelOfferProvider;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use App\State\FlightOfferState;
use DateTime;
use DateTimeInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource]
#[Get(
    provider: FlightOfferState::class,
    // security: "is_granted('view', object)"
)]
#[Post(
    processor: FlightOfferState::class,
    securityPostDenormalize: "is_granted('book', object)",
    normalizationContext: ['groups' => ['read:flightOffer']],
    denormalizationContext: ['groups' => ['write:flightOffer']]
)]

class FlightOffer
{
    #[ApiResource(identifier: true)]
    #[Groups(['read:flightOffer'])]
    public ?string $id;
    #[Groups(['read:flightOffer', 'write:flightOffer'])]
    public string $origin;
    #[Groups(['read:flightOffer', 'write:flightOffer'])]
    public string $destination;
    #[Groups(['read:flightOffer', 'write:flightOffer'])]
    public DateTimeInterface $departureDate;
    #[Groups(['read:flightOffer', 'write:flightOffer'])]
    public ?DateTimeInterface $returnDate = null;
    #[Groups(['read:flightOffer'])]
    public ?array $offers;
    #[Groups(['read:flightOffer'])]
    public ?array $slices;
    #[Groups(['read:flightOffer'])]
    public ?string $passengerId;
    #[Groups(['read:flightOffer', 'write:flightOffer'])]
    public int $maxConnections;

    public function __construct(string $origin, string $destination, DateTimeInterface $departureDate, ?array $offers = null, ?array $slices = null, ?string $passengerId = null, int $maxConnections = 1, ?DateTimeInterface $returnDate = null, ?string $offerId = null,)
    {
        $this->origin = $origin;
        $this->destination = $destination;
        $this->departureDate = $departureDate;
        $this->returnDate = $returnDate; // if return date is null, then not round trip
        $this->id = $offerId;
        $this->offers = $offers;
        $this->slices = $slices;
        $this->passengerId = $passengerId;
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
