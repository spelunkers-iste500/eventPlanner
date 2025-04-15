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
    processor: LoggerStateProcessor::class,
    description: 'Creates a new event. Only users with edit permissions (event admins, organization admins, or platform admins) can create events. Returns the created Event resource.',
)]
//Event.Admin.View (WORKS)
#[GetCollection(
    //FIX WITH EXTENSION filtering see \Doctrine\OrgAdminOfExtension
    uriTemplate: '/my/organizations/events/eventAdmin.{_format}',
    normalizationContext: ['groups' => ['read:event:collection', 'read:event:eventAdmin']],
    description: 'Retrieves a collection of events where the user is an event admin. Only accessible to event admins. Returns a list of Event resources.',
)]

#[GetCollection(
    //FIX WITH EXTENSION filtering see \Doctrine\OrgAdminOfExtension
    uriTemplate: '/my/organizations/events/financeAdmin.{_format}',
    normalizationContext: ['groups' => ['read:event:collection', 'read:event:financeAdmin']],
    description: 'Retrieves a collection of events where the user has finance admin permissions. Only accessible to finance admins. Returns a list of Event resources.',
)]

#[GetCollection(
    //FIX WITH EXTENSION filtering see \Doctrine\OrgAdminOfExtension
    uriTemplate: '/my/organizations/events/fullAdmin.{_format}',
    normalizationContext: ['groups' => ['read:event:collection']],
    description: 'Retrieves a collection of all events the user has full admin access to. Only accessible to organization admins or platform admins. Returns a list of Event resources.',
)]

//Event.Admin.Changes (WORKS FOR EVERYTHING EXCEPT BUDGET)
#[Patch(
    security: "is_granted('edit', object)",
    uriTemplate: '/events/{id}.{_format}',
    denormalizationContext: ['groups' => ['write:event:changes']],
    processor: LoggerStateProcessor::class,
    description: 'Updates an event\'s details. Only users with edit permissions (event admins, organization admins, or platform admins) can update events. Returns the updated Event resource.',
)]
//Event.Admin.AddAttendees (WORKS)
#[Patch(
    security: "is_granted('edit', object)",
    uriTemplate: '/events/{id}/addAttendees.{_format}',
    denormalizationContext: ['groups' => ['add:event:attendees']],
    processor: EventStateProcessor::class,
    description: 'Adds attendees to an event. Only users with edit permissions (event admins, organization admins, or platform admins) can add attendees. Returns the updated Event resource.',
)]
//Event.Admin.delete (WORKS)
#[Delete(
    security: "is_granted('edit', object)",
    uriTemplate: '/events/{id}.{_format}',
    processor: LoggerStateProcessor::class,
    description: 'Deletes an event. Only users with edit permissions (event admins, organization admins, or platform admins) can delete events. Returns a confirmation of deletion.',
)]

#[Get(
    security: "is_granted('view', object)",
    uriTemplate: '/events/{id}.{_format}',
    normalizationContext: ['groups' => ['test:attendees', 'read:event']],
    description: 'Retrieves the details of a specific event. Only users with view permissions (attendees, event admins, organization admins, or platform admins) can view events. Returns the Event resource.',
)]

//grabs per user total, max attendees, flights (id and cost), overage (once added), budget id, total budget, event title
#[
    Get(
        //security: "is_granted('view', object)",
        uriTemplate: '/csv/events/{id}.{_format}',
        normalizationContext: ['groups' => ['event:csv:export']],
        description: 'Exports event details to a CSV file. Only accessible to users with appropriate permissions. Returns the CSV export of the event.',
    )
]

#[
    Get(
        security: "is_granted('view', object)",
        uriTemplate: '/image/get/events/{id}.{_format}',
        normalizationContext: ['groups' => ['event:image:read']],
        description: 'Retrieves the image associated with a specific event. Only users with view permissions (attendees, event admins, organization admins, or platform admins) can access event images. Returns the image resource.',
    )
]

#[Post(
    securityPostDenormalize: "is_granted('edit', object)",
    // security: "is_granted('edit', object)",
    uriTemplate: '/image/post/events/{id}.{_format}',
    denormalizationContext: ['groups' => ['event:image:write']],
    processor: LoggerStateProcessor::class,
    description: 'Uploads or updates the image for a specific event. Only users with edit permissions (event admins, organization admins, or platform admins) can manage event images. Returns the updated Event resource.',
)]
//ADD IMAGES HERE

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
    #[Groups(['read:event', 'write:event',  'read:event:collection', 'write:event:changes', 'read:myEvents', 'event:csv:export'])]
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
    #[Groups(['read:event', 'write:event', 'read:myEvents', 'read:event:collection'])]
    public string $location;

    #[ORM\Column(type: 'integer')]
    #[Groups(['read:event', 'write:event', 'write:event:changes', 'read:myEvents', 'event:csv:export', 'event:csv:export', 'read:event:collection'])]
    public int $maxAttendees;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $createdDate;

    #[ORM\ManyToOne(targetEntity: Organization::class, inversedBy: 'events')]
    #[ORM\JoinColumn(name: 'organization_id', referencedColumnName: 'id', nullable: true)]
    #[Groups(['read:event', 'read:myEvents', 'write:event', 'read:event:collection'])]
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
    #[Groups(['read:event', 'read:event:booking',  'read:event:collection', 'read:myEvents', 'event:csv:export'])]
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
    #[Groups(['read:event', 'write:event', 'add:event:attendees', 'test:attendees', 'read:event:eventAdmin', 'read:event:financeAdmin'])]
    // #[MaxDepth(1)]
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

    public function __construct()
    {
        $this->id = Uuid::uuid4();
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
        $this->attendees = new ArrayCollection();
    }
}
