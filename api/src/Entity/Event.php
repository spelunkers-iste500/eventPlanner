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
    private ?int $eventID = null;

    #[ORM\Column(length: 55)]
    private string $eventTitle;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $startDateTime;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $endDateTime;

    #[ORM\Column(length: 55)]
    private string $location;

    #[ORM\Column(type: 'integer')]
    private int $maxAttendees;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $createdDate;

    // Relationships
    #[ORM\ManyToOne(targetEntity: Budget::class, inversedBy: 'event')]
    #[ORM\JoinColumn(name: 'budgetID', referencedColumnName: 'budgetID', nullable: false)]
    private ?Budget $budget = null;

    // Getters and Setters
    public function getEventID(): ?int
    {
        return $this->eventID;
    }

    public function getEventTitle(): string
    {
        return $this->eventTitle;
    }

    public function setEventTitle(string $eventTitle): self
    {
        $this->eventTitle = $eventTitle;
        return $this;
    }

    public function getStartDateTime(): \DateTimeInterface
    {
        return $this->startDateTime;
    }

    public function setStartDateTime(\DateTimeInterface $startDateTime): self
    {
        $this->startDateTime = $startDateTime;
        return $this;
    }

    public function getEndDateTime(): \DateTimeInterface
    {
        return $this->endDateTime;
    }

    public function setEndDateTime(\DateTimeInterface $endDateTime): self
    {
        $this->endDateTime = $endDateTime;
        return $this;
    }

    public function getLocation(): string
    {
        return $this->location;
    }

    public function setLocation(string $location): self
    {
        $this->location = $location;
        return $this;
    }

    public function getMaxAttendees(): int
    {
        return $this->maxAttendees;
    }

    public function setMaxAttendees(int $maxAttendees): self
    {
        $this->maxAttendees = $maxAttendees;
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

    public function getBudget(): ?Budget
    {
        return $this->budget;
    }

    public function setBudget(?Budget $budget): self
    {
        $this->budget = $budget;
        return $this;
    }
}
