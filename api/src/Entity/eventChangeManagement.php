<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class EventChangeManagement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'changeID', type: 'integer')]
    private ?int $changeID = null;

    #[ORM\Column(type: 'integer')]
    private int $eventID;

    #[ORM\Column(length: 55)]
    private string $versionNum;

    #[ORM\Column(type: 'boolean')]
    private bool $active;

    #[ORM\Column(length: 255)]
    private string $description;

    #[ORM\Column(type: 'json')]
    private array $beforeChanges;

    #[ORM\Column(type: 'json')]
    private array $afterChanges;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $createdDate;

    // Getters and Setters

    public function getChangeID(): ?int
    {
        return $this->changeID;
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

    public function getVersionNum(): string
    {
        return $this->versionNum;
    }

    public function setVersionNum(string $versionNum): self
    {
        $this->versionNum = $versionNum;
        return $this;
    }

    public function isActive(): bool
    {
        return $this->active;
    }

    public function setActive(bool $active): self
    {
        $this->active = $active;
        return $this;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getBeforeChanges(): array
    {
        return $this->beforeChanges;
    }

    public function setBeforeChanges(array $beforeChanges): self
    {
        $this->beforeChanges = $beforeChanges;
        return $this;
    }

    public function getAfterChanges(): array
    {
        return $this->afterChanges;
    }

    public function setAfterChanges(array $afterChanges): self
    {
        $this->afterChanges = $afterChanges;
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
