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
}
