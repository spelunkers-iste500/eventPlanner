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

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime',nullable: true)]
    public \DateTimeInterface $createdDate;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }

}
