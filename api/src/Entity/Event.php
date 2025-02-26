<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ApiResource]
class Event
{
    // Table setup and Relationships
    #[ORM\Id]
    #[ORM\GeneratedValue]
    //#[ORM\OneToOne(targetEntity: Flight::class, inversedBy: 'eventID')]
    //#[ORM\OneToMany(targetEntity: eventChangeManagement::class, mappedBy: 'eventID', cascade: ['persist', 'remove'])]
    #[ORM\Column(name: 'eventID', type: 'integer')]
    public ?int $eventID = null;

    #[ORM\Column(length: 55)]
    public string $eventTitle;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $startDateTime;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $endDateTime;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $startFlightBooking;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $endFlightBooking;

    #[ORM\Column(length: 55)]
    public string $location;

    #[ORM\Column(type: 'integer')]
    public int $maxAttendees;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $createdDate;

    #[ORM\ManyToMany(targetEntity: Organization::class, inversedBy: 'events')]
    #[ORM\JoinTable(
        name: 'organizations_events',
        joinColumns: [new ORM\JoinColumn(name: 'event_id', referencedColumnName: 'eventID')],
        inverseJoinColumns: [new ORM\JoinColumn(name: 'organization_id', referencedColumnName: 'id')]
    )]
    private Collection $organizations;

    //Relationships
    //Event -> Budget
    #[ORM\OneToOne(targetEntity: Budget::class)]
    #[ORM\JoinColumn(name: 'budgetID', referencedColumnName: 'budgetID', nullable: true)]
    public Budget $budgetID;



    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}
