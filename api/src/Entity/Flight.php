<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ApiResource]
class Flight
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id', type: 'string', length: 10)]
    public string $flightID;

    #[ORM\Column(length: 20, nullable: true, unique: true)]
    public string $flightNumber;

    //Relationships

    //eventOrganization -> Event
    #[ORM\ManyToOne(targetEntity: Event::class)]
    #[ORM\JoinColumn(name: 'eventID', referencedColumnName: 'eventID', nullable: true)]
    public Event $eventID;

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
