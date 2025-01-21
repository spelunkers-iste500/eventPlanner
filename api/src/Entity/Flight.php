<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class Flights
{
    #[ORM\Id]
    #[ORM\Column(name: 'flightID', type: 'string', length: 10)]
    private string $flightID;

    #[ORM\Column(length: 20)]
    private string $flightNumber;

    #[ORM\Column(type: 'integer')]
    private int $eventID;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $departureTime;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $arrivalTime;

    #[ORM\Column(length: 55)]
    private string $departureLocation;

    #[ORM\Column(length: 55)]
    private string $arrivalLocation;

    #[ORM\Column(length: 55)]
    private string $airline;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $flightTracker;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $createdDate;

    // Getters and Setters

    public function getFlightID(): string
    {
        return $this->flightID;
    }

    public function setFlightID(string $flightID): self
    {
        $this->flightID = $flightID;
        return $this;
    }

    public function getFlightNumber(): string
    {
        return $this->flightNumber;
    }

    public function setFlightNumber(string $flightNumber): self
    {
        $this->flightNumber = $flightNumber;
        return $this;
    }

    public function getEventID(): int
    {
        return $this->eventID;
    }

    public function setEventID(int $eventID): self
    {
        $this->eventID = $eventID;
        return $this;
    }

    public function getDepartureTime(): \DateTimeInterface
    {
        return $this->departureTime;
    }

    public function setDepartureTime(\DateTimeInterface $departureTime): self
    {
        $this->departureTime = $departureTime;
        return $this;
    }

    public function getArrivalTime(): \DateTimeInterface
    {
        return $this->arrivalTime;
    }

    public function setArrivalTime(\DateTimeInterface $arrivalTime): self
    {
        $this->arrivalTime = $arrivalTime;
        return $this;
    }

    public function getDepartureLocation(): string
    {
        return $this->departureLocation;
    }

    public function setDepartureLocation(string $departureLocation): self
    {
        $this->departureLocation = $departureLocation;
        return $this;
    }

    public function getArrivalLocation(): string
    {
        return $this->arrivalLocation;
    }

    public function setArrivalLocation(string $arrivalLocation): self
    {
        $this->arrivalLocation = $arrivalLocation;
        return $this;
    }

    public function getAirline(): string
    {
        return $this->airline;
    }

    public function setAirline(string $airline): self
    {
        $this->airline = $airline;
        return $this;
    }

    public function getFlightTracker(): ?string
    {
        return $this->flightTracker;
    }

    public function setFlightTracker(?string $flightTracker): self
    {
        $this->flightTracker = $flightTracker;
        return $this;
    }

    public function getLastModified(): \DateTimeInterface
    {
        return $this->lastModified;
    }

    public function setLastModified(\DateTimeInterface $lastModified): self
    {
        $this->lastModified = $lastModified;
        return $this;
    }

    public function getCreatedDate(): \DateTimeInterface
    {
        return $this->createdDate;
    }

    public function setCreatedDate(\DateTimeInterface $createdDate): self
    {
        $this->createdDate = $createdDate;
        return $this;
    }
}
