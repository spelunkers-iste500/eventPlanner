<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ApiResource]

//ONLY STORE USER'S FLIGHT ID (BASICALLY STORE FLIGHT ENTITY ID AND ASSOCIATED USER)
class Flight
{
    #[ORM\Id]
    #[ORM\Column(name: 'id', type: 'string', length: 10)]
    public string $id;

    #[ORM\Column(length: 20)]
    public string $flightNumber;

    #[ORM\Column(type: 'integer')]
    public int $eventID;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $departureTime;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $arrivalTime;

    #[ORM\Column(length: 55)]
    public string $departureLocation;

    #[ORM\Column(length: 55)]
    public string $arrivalLocation;

    #[ORM\Column(length: 55)]
    public string $airline;

    #[ORM\Column(length: 255, nullable: true)]
    public ?string $flightTracker;

    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'flights')]
    private Collection $users;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $createdDate;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }

    // SETTERS
    public function setOrigin(string $origin): void { $this->departureLocation = $origin; }
    public function setDestination(string $destination): void { $this->arrivalLocation = $destination; }
    public function setDepartureTime(string $time): void { $this->departureTime = new \DateTime($time); }
    public function setArrivalTime(string $time): void { $this->arrivalTime = new \DateTime($time); }
    public function setPrice(string $price): void { $this->flightTracker = $price; }  // Assuming you meant 'price' as a placeholder for 'flightTracker'

    // GETTERS
    public function getId(): string { return $this->id; }
    public function getFlightNumber(): string { return $this->flightNumber; }
    public function getEventID(): int { return $this->eventID; }
    public function getDepartureTime(): \DateTimeInterface { return $this->departureTime; }
    public function getArrivalTime(): \DateTimeInterface { return $this->arrivalTime; }
    public function getDepartureLocation(): string { return $this->departureLocation; }
    public function getArrivalLocation(): string { return $this->arrivalLocation; }
    public function getAirline(): string { return $this->airline; }
    public function getFlightTracker(): ?string { return $this->flightTracker; }
    public function getLastModified(): \DateTimeInterface { return $this->lastModified; }
    public function getCreatedDate(): \DateTimeInterface { return $this->createdDate; }
}
