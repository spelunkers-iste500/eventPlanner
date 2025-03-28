<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Lazy\LazyUuidFromString;
use Ramsey\Uuid\Rfc4122\UuidInterface;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ApiResource()]
#[GetCollection(
    uriTemplate: '/my/events.{_format}',
    normalizationContext: ['groups' => ['read:myEvents']],
)]
#[Post(
    securityPostDenormalize: "is_granted('edit', object)",
    denormalizationContext: ['groups' => ['write:myEvents']],
)]
#[Patch(
    security: "is_granted('userEdit', object)",
    denormalizationContext: ['groups' => ['update:myEvents']],
)]
/**
 * User <-> Event relationship, also functions as an event invite, with a status of accepted or declined
 * When a user doesn't exist in the database, the user id is null until they register. The ID of the UserEvent
 * is used to identify the event invite, and associate the user to the event post registration.
 */
class UserEvent
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid')]
    #[Groups(['read:myEvents'])]
    private $id;
    /**
     * @return UuidInterface The mapping ID
     */
    public function getId(): UuidInterface | LazyUuidFromString
    {
        return $this->id;
    }
    /**
     * @param UuidInterface $id The mapping ID
     */
    public function setId(UuidInterface $id): void
    {
        $this->id = $id;
    }

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'eventsAttending', cascade: ['all'])]
    #[ORM\JoinColumn(name: 'userID', referencedColumnName: 'id')]
    #[Groups(['write:myEvents', 'read:myEvents'])]
    private User $user;

    #[ORM\ManyToOne(targetEntity: Event::class, inversedBy: 'attendees', cascade: ['all'])]
    #[ORM\JoinColumn(name: 'eventID', referencedColumnName: 'id', nullable: false)]
    #[Groups(['read:myEvents', 'write:myEvents', 'user:read'])]
    private Event $event;

    public function getUser(): User
    {
        return $this->user;
    }
    public function setUser(User $user): self
    {
        $this->user = $user;
        return $this;
    }

    public function getEvent(): Event
    {
        return $this->event;
    }
    public function setEvent(Event $event): self
    {
        $this->event = $event;
        return $this;
    }

    #[Groups(['read:myEvents'])]
    public function getFlights(): ?Collection
    {
        return $this->user->getFlights();
    }

    #[ORM\Column]
    #[Groups(['read:myEvents', 'update:myEvents'])]
    #[Assert\Choice(choices: ['pending', 'accepted', 'declined', 'cancelled'])]
    private string $status = 'pending';

    public function getStatus(): string
    {
        return $this->status;
    }
    public function setStatus(string $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function __construct()
    {
        $this->id = Uuid::uuid4();
    }
}
