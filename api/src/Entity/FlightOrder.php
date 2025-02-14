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
    uriTemplate: '/flightOrders/{origin}/{destination}/{departureDate}/{passengerCount}/{roundtrip}.{_format}',
    requirements: [
        'origin' => '\w{3}',
        'destination' => '\w{3}',
        'departureDate' => '\d{4}-\d{2}-\d{2}',
        'passengerCount' => '\d+',
        'roundtrip' => 'roundtrip|oneway',
    ]
)]
class FlightOrder
{

    // TODO: setup overloaded functions in the provider to handle roundtrip vs oneway

    // TODO: setup automatic handling of return date from event flight will be spawned from

    // TODO: validate date is in the future, and between the departure and the specified 
    // return date as set by the event planner to allow for early returns if required

    public string $origin;

    public string $destination;

    public string $departureDate;

    public string $returnDate;

    public int $passengerCount;

    public string $roundtrip;

    private array $offerData = [];

    public function getId(): array
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
