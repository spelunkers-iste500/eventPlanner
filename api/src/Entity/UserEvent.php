<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Lazy\LazyUuidFromString;
use Ramsey\Uuid\Rfc4122\UuidInterface;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ApiResource()]
#[GetCollection(
    uriTemplate: '/my/events.{_format}',
    normalizationContext: ['groups' => ['read:myEvents']],
)]
#[GetCollection(
    uriTemplate: '/my/organizations/events.{_format}',
    normalizationContext: ['groups' => ['read:myEvents']],
)]
#[Post(
    securityPostDenormalize: "is_granted('edit', object)",
    denormalizationContext: ['groups' => ['write:myEvents']],
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
    #[Groups(['write:myEvents'])]
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

    #[ORM\Column]
    #[Groups(['read:myEvents'])]
    private bool $isAccepted;

    public function getIsAccepted(): bool
    {
        return $this->isAccepted;
    }
    public function setIsAccepted(bool $isAccepted): self
    {
        $this->isAccepted = $isAccepted;
        return $this;
    }

    #[ORM\Column]
    #[Groups(['read:myEvents'])]
    private bool $isDeclined;

    public function getIsDeclined(): bool
    {
        return $this->isDeclined;
    }
    public function setIsDeclined(bool $isDeclined): self
    {
        $this->isDeclined = $isDeclined;
        return $this;
    }

    public function __construct()
    {
        $this->id = Uuid::uuid4();
        $this->isAccepted = false;
        $this->isDeclined = false;
    }
}
