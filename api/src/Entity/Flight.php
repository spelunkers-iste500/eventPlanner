<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\Collection;
use Ramsey\Uuid\Lazy\LazyUuidFromString;
use Ramsey\Uuid\UuidInterface;

#[ORM\Entity]
#[ApiResource]
class Flight
{
    #[ORM\Id]
    #[ORM\Column(name: 'id', type: 'uuid')]
    private $id;
    public function getId(): UuidInterface | LazyUuidFromString
    {
        return $this->id;
    }
    public function setId(UuidInterface $id): void
    {
        $this->id = $id;
    }

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    public string $flightCost;

    //Relationships

    //eventOrganization -> Event
    #[ORM\ManyToOne(targetEntity: Event::class, inversedBy: 'flights')]
    private Event $event;

    public function getEvent(): Event
    {
        return $this->event;
    }
    public function setEvent(Event $event): self
    {
        $this->event = $event;
        return $this;
    }

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
