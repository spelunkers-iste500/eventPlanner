<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use App\Repository\EventRepository;
use App\State\EventStateProcessor;
use App\State\LoggerStateProcessor;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Ramsey\Uuid\Lazy\LazyUuidFromString;
use Ramsey\Uuid\Rfc4122\UuidInterface;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Serializer\Annotation\MaxDepth;


#[ORM\Entity(repositoryClass: EventRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read:event']],
    denormalizationContext: ['groups' => ['write:event']],
)]
//Event.Admin.Create (WORKS)
#[Post(
    securityPostDenormalize: "is_granted('edit', object)",
    // security: "is_granted('edit', object)",
    uriTemplate: '/events.{_format}',
    denormalizationContext: ['groups' => ['write:event']],
    processor: LoggerStateProcessor::class
)]
//Event.Admin.View (WORKS)
#[GetCollection(
    //FIX WITH EXTENSION filtering see \Doctrine\OrgAdminOfExtension
    uriTemplate: '/my/organizations/events/eventAdmin.{_format}',
    normalizationContext: ['groups' => ['read:event:collection']],
)]

#[GetCollection(
    //FIX WITH EXTENSION filtering see \Doctrine\OrgAdminOfExtension
    uriTemplate: '/my/organizations/events/financeAdmin.{_format}',
    normalizationContext: ['groups' => ['read:event:collection']],
)]

#[GetCollection(
    //FIX WITH EXTENSION filtering see \Doctrine\OrgAdminOfExtension
    uriTemplate: '/my/organizations/events/fullAdmin.{_format}',
    normalizationContext: ['groups' => ['read:event:collection']],
)]

//Event.Admin.Changes (WORKS FOR EVERYTHING EXCEPT BUDGET)
#[Patch(
    security: "is_granted('edit', object)",
    uriTemplate: '/events/{id}.{_format}',
    denormalizationContext: ['groups' => ['write:event:changes']],
    processor: LoggerStateProcessor::class
)]
//Event.Admin.AddAttendees (WORKS)
#[Patch(
    security: "is_granted('edit', object)",
    uriTemplate: '/events/{id}/addAttendees.{_format}',
    denormalizationContext: ['groups' => ['add:event:attendees']],
    processor: EventStateProcessor::class
)]
//Event.Admin.delete (WORKS)
#[Delete(
    security: "is_granted('edit', object)",
    uriTemplate: '/events/{id}.{_format}',
    processor: LoggerStateProcessor::class
)]

#[Get(
    security: "is_granted('view', object)",
    uriTemplate: '/events/{id}.{_format}',
    normalizationContext: ['groups' => ['test:attendees']]
)]

// #[GetCollection(
//     uriTemplate: '/my/events.{_format}',
//     normalizationContext: ['groups' => ['read:event:collection']]
// )]
/**
 * The events that are organized by organizations.
 */
class Event
{
    #[ORM\Id]
    #[ApiProperty(identifier: true)]
    #[ORM\Column(name: 'id', type: 'uuid')]
    #[Groups(['read:event', 'read:event:collection', 'read:myEvents', 'user:read'])]
    private $id;
    public function getId(): UuidInterface | LazyUuidFromString
    {
        return $this->id;
    }
    public function setId(UuidInterface $id): void
    {
        $this->id = $id;
    }

    #[ORM\Column(length: 55)]
    #[Groups(['read:event', 'write:event',  'read:event:collection', 'write:event:changes', 'read:myEvents'])]
    public string $eventTitle;
    public function getEventTitle(): string
    {
        return $this->eventTitle;
    }
    public function setEventTitle(string $eventTitle): self
    {
        $this->eventTitle = $eventTitle;
        return $this;
    }

    #[ORM\Column(type: 'datetime')]
    #[Groups(['read:event', 'write:event',  'read:event:collection', 'write:event:changes', 'read:myEvents'])]
    public \DateTimeInterface $startDateTime;
    public function getStartDateTime(): \DateTimeInterface
    {
        return $this->startDateTime;
    }

    #[ORM\Column(type: 'datetime')]
    #[Groups(['read:event', 'write:event',  'read:event:collection', 'write:event:changes', 'read:myEvents'])]
    public \DateTimeInterface $endDateTime;
    // Getter for endDateTime
    public function getEndDateTime(): \DateTimeInterface
    {
        return $this->endDateTime;
    }

    #[ORM\Column(type: 'datetime')]
    #[Groups(['read:event', 'write:event', 'read:event:collection', 'write:event:changes', 'read:myEvents'])]
    public \DateTimeInterface $startFlightBooking;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['read:event', 'write:event', 'read:event:collection', 'write:event:changes', 'read:myEvents'])]
    public \DateTimeInterface $endFlightBooking;

    #[ORM\Column(length: 55)]
    #[Groups(['read:event', 'write:event', 'read:myEvents'])]
    public string $location;

    #[ORM\Column(type: 'integer')]
    #[Groups(['read:event', 'write:event', 'write:event:changes', 'read:myEvents'])]
    public int $maxAttendees;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $createdDate;

    #[ORM\ManyToOne(targetEntity: Organization::class, inversedBy: 'events')]
    #[ORM\JoinColumn(name: 'organization_id', referencedColumnName: 'id', nullable: true)]
    #[Groups(['read:event', 'read:myEvents', 'write:event'])]
    public Organization $organization;
    public function getOrganization(): Organization
    {
        return $this->organization;
    }
    public function setOrganization(Organization $organization): self
    {
        $this->organization = $organization;
        return $this;
    }

    //Relationships
    //Event -> Budget
    #[ORM\OneToOne(targetEntity: Budget::class, mappedBy: 'event', cascade: ['persist', 'merge'])]
    #[ORM\JoinColumn(name: 'budgetID', referencedColumnName: 'id', nullable: true, onDelete: 'SET NULL')]
    #[Groups(['read:event', 'read:event:booking',  'read:event:collection', 'read:myEvents'])]
    public Budget $budget;
    public function getBudget(): Budget
    {
        return $this->budget;
    }
    public function setBudget(Budget $budget): self
    {
        $this->budget = $budget;
        return $this;
    }

    //Event -> User (attendees)
    #[ORM\OneToMany(targetEntity: UserEvent::class, mappedBy: 'event', cascade: ['all'])]
    #[Groups(['read:event', 'write:event', 'add:event:attendees', 'test:attendees'])]
    #[MaxDepth(1)]
    private Collection $attendees;

    public function getAttendees(): Collection
    {
        return $this->attendees;
    }
    public function addAttendee(User $attendee): self
    {
        if (!$this->attendees->contains($attendee)) {
            $this->attendees[] = $attendee;
        }
        return $this;
    }
    public function removeAttendees(User $attendee): self
    {
        $this->attendees->removeElement($attendee);
        return $this;
    }
    public function setAttendees(array $attendees): self
    {
        $this->attendees = new ArrayCollection($attendees);
        return $this;
    }

    public function addAttendeeCollection(array $attendees): self
    {
        $existingAttendees = $this->attendees->toArray();

        //Ensure only unique User objects are added
        foreach ($attendees as $attendee) {
            if (!in_array($attendee, $existingAttendees, true)) { // Strict check
                $this->attendees->add($attendee);
            }
        }

        return $this;
    }

    #[ORM\Column(type: 'string', length: 255, unique: true, nullable: true)]
    #[Groups(['event:read', 'write:event', 'write:event:changes'])]
    private ?string $inviteCode;

    public function getInviteCode(): ?string
    {
        return $this->inviteCode;
    }
    public function setInviteCode(string $inviteCode): void
    {
        $this->inviteCode = $inviteCode;
    }

    //Event -> Flight
    #[ORM\OneToMany(targetEntity: Flight::class, mappedBy: 'event', cascade: ['all'])]
    #[Groups(['read:event', 'write:event', 'read:event:collection'])]
    private Collection $flights;

    public function getFlights(): Collection
    {
        return $this->flights;
    }

    public function addFlight(Flight $flight): self
    {
        if (!$this->flights->contains($flight)) {
            $this->flights[] = $flight;
            $flight->setEvent($this);
        }
        return $this;
    }


    public function __construct()
    {
        $this->id = Uuid::uuid4();
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
        $this->attendees = new ArrayCollection();
    }
}
