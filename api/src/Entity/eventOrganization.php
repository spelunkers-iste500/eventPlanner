<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class EventOrganization
{
    #[ORM\Id]
    #[ORM\Column(name: 'eventID', type: 'integer')]
    private int $eventID;

    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    private int $orgID;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $field1;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $field2;

    // Getters and Setters

    public function getEventID(): int
    {
        return $this->eventID;
    }

    public function setEventID(int $eventID): self
    {
        $this->eventID = $eventID;
        return $this;
    }

    public function getOrgID(): int
    {
        return $this->orgID;
    }

    public function setOrgID(int $orgID): self
    {
        $this->orgID = $orgID;
        return $this;
    }

    public function getField1(): \DateTimeInterface
    {
        return $this->field1;
    }

    public function setField1(\DateTimeInterface $field1): self
    {
        $this->field1 = $field1;
        return $this;
    }

    public function getField2(): \DateTimeInterface
    {
        return $this->field2;
    }

    public function setField2(\DateTimeInterface $field2): self
    {
        $this->field2 = $field2;
        return $this;
    }
}
