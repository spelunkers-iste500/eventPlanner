<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use App\State\DuffelApiProvider;
use ApiPlatform\Metadata\Get;
use DateTimeInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource]
#[Get(
    provider: DuffelApiProvider::class,
    uriTemplate: '/flightOrders/{origin}/{destination}/{departureDate}/{passengerCount}',
)]
class FlightOrder
{

    public string $origin;

    public string $destination;

    public string $departureDate;

    public int $passengerCount;

    private array $offerData = [];

    public function getId(): ?array
    {
        return [$this->origin, $this->destination, $this->departureDate, $this->passengerCount];
    }

    public function getOfferData(): array
    {
        return $this->offerData;
    }

    public function setOfferData(array $offerData): self
    {
        $this->offerData = $offerData;
        return $this;
    }
}
