<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class Flight
{
    #[ORM\Id]
    #[ORM\Column(name: 'flightID', type: 'string', length: 10)]
    public string $flightID;

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

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $createdDate;

    public function __construct()
    {
        $this->lastModified = new \DateTimeInterface();
        $this->createdDate = new \DateTimeInterface();
    }
}
