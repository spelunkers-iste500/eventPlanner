<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class Event
{
    // Table setup
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'eventID', type: 'integer')]
    public ?int $eventID = null;

    #[ORM\Column(length: 55)]
    public string $eventTitle;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $startDateTime;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $endDateTime;

    #[ORM\Column(length: 55)]
    public string $location;

    #[ORM\Column(type: 'integer')]
    public int $maxAttendees;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $createdDate;

    // Relationships
    // #[ORM\ManyToOne(targetEntity: Budget::class, inversedBy: 'event')]
    // #[ORM\JoinColumn(name: 'budgetID', referencedColumnName: 'budgetID', nullable: false)]
    // public ?Budget $budget = null;

    // #[ORM\OneToMany(mappedBy: 'event', targetEntity: EventOrganization::class, cascade: ['persist', 'remove'])]
    // public Collection $eventOrganization;

}
