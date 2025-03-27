<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\CurrentUserProvider;
use Doctrine\Common\Collections\Collection;
use Ramsey\Uuid\Lazy\LazyUuidFromString;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ApiResource]
#[Get(
    provider: CurrentUserProvider::class,
    uriTemplate: '/my/flights.{_format}',
)]
class Flight
{
    #[ORM\Id]
    #[ORM\Column(name: 'id', type: 'uuid')]
    #[Groups([
        'read:myEvents'
    ])]
    private $id;
    public function getId(): UuidInterface | LazyUuidFromString
    {
        return $this->id;
    }
    public function setId(UuidInterface $id): void
    {
        $this->id = $id;
    }

    #[ORM\Column]
    public int $flightCost;

    public function getFlightCost(): int
    {
        return $this->flightCost;
    }

    public function setFlightCost(int $flightCost): self
    {
        $this->flightCost = (int) $flightCost * 100;
        return $this;
    }

    //Relationships

    //Flight <-> Event
    #[ORM\ManyToOne(targetEntity: Event::class, inversedBy: 'flights')]
    #[Groups([
        'read:myEvents'
    ])]
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

    // One flight per user, per event
    // Flight <-> User
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'flights')]
    private User $user; // this should be updated to be a single user

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
