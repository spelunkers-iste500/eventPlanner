<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use App\State\FlightOfferRequestState;
use DateTimeInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource]
#[Get(
    // provider: FlightOfferRequestState::class,
    normalizationContext: ['groups' => ['read:flightOffer']]
)]
class FlightOfferRequest
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
    #[Groups(['read:flightOffer', 'write:flightOffer'])]
    public int $maxConnections;

    #[Groups(['read:flightOffer'])]
    public ?array $flightOffers;
    public function __construct(
        string $origin,
        string $destination,
        DateTimeInterface $departureDate,
        int $maxConnections = 1,
        ?DateTimeInterface $returnDate = null,
        ?string $id = null,
        ?array $flightOffers = null,
    ) {
        $this->id = $id;
        $this->flightOffers = $flightOffers;
        $this->origin = $origin;
        $this->destination = $destination;
        $this->departureDate = $departureDate;
        $this->returnDate = $returnDate;
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
