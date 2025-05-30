<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
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
#[ORM\Table(
    name: 'user_event',
    uniqueConstraints: [
        new ORM\UniqueConstraint(name: 'user_event_unique', columns: ['userID', 'eventID']),
        new ORM\UniqueConstraint(name: 'email_event_unique', columns: ['email', 'eventID']),
    ],
)]
#[ApiResource(
    description: 'Manages the relationship between users and events, including event invitations and their statuses.'
)]
#[GetCollection(
    uriTemplate: '/my/events.{_format}',
    normalizationContext: ['groups' => ['read:myEvents']],
    description: 'Retrieves a collection of events associated with the authenticated user.'
)]
#[Get(
    normalizationContext: ['groups' => ['read:myEvents']],
    description: 'Retrieves a specific event associated with the authenticated user.'
)]
#[Post(
    securityPostDenormalize: "is_granted('edit', object)",
    denormalizationContext: ['groups' => ['write:myEvents']],
    description: 'Creates a new user-event relationship, such as inviting a user to an event. Requires the "edit" permission, which is granted to users with ROLE_ADMIN or event/organization admins for the event\'s organization.'
)]
#[Patch(
    securityPostDenormalize: "is_granted('userEdit', object)",
    denormalizationContext: ['groups' => ['update:myEvents']],
    description: 'Updates an existing user-event relationship, such as changing the status of an event invitation. Requires the "userEdit" permission, which is granted to the user associated with the UserEvent object.'
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
    #[Groups(['read:myEvents', 'read:event', 'read:event:eventAdmin', 'read:event:financeAdmin'])]
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
    #[Groups(['write:myEvents', 'read:myEvents', 'read:event', 'read:event:eventAdmin'])]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: Event::class, inversedBy: 'attendees', cascade: ['all'])]
    #[ORM\JoinColumn(name: 'eventID', referencedColumnName: 'id', nullable: false)]
    #[Groups(['read:myEvents', 'write:myEvents', 'user:read'])]
    private Event $event;

    // Owning side of the relation.
    #[ORM\OneToOne(targetEntity: Flight::class, inversedBy: 'userEvent', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(name: 'flightID', referencedColumnName: 'id', nullable: true)]
    #[Groups(['read:myEvents', 'read:event', 'read:event:eventAdmin', 'read:event:financeAdmin'])]
    private ?Flight $flight = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['read:myEvents', 'update:myEvents', 'read:event', 'read:event:eventAdmin', 'read:flight'])]
    #[Assert\Email]
    private ?string $email;

    public function getEmail(): ?string
    {
        // return users email if user exists
        if (isset($this->user)) {
            return $this->getUser()->getEmail();
        }
        return $this->email;
    }
    public function setEmail(?string $email): self
    {
        $this->email = $email;
        return $this;
    }


    public function getFlight(): ?Flight
    {
        return $this->flight;
    }
    public function setFlight(?Flight $flight): self
    {
        // unset the owning side of the relation if necessary
        if ($flight === null && $this->flight !== null) {
            $this->flight->setUserEvent(null);
        }

        // set the owning side of the relation if necessary
        if ($flight !== null && $flight->getUserEvent() !== $this) {
            $flight->setUserEvent($this);
        }

        $this->flight = $flight;

        return $this;
    }

    public function getUser(): ?User
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
    #[Groups(['read:myEvents', 'update:myEvents', 'read:event', 'read:event:eventAdmin', 'read:event:financeAdmin'])]
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
