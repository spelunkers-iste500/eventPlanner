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
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\State\EventStateProcessor;
use app\State\LoggerStateProcessor;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping\InverseJoinColumn;
use Doctrine\ORM\Mapping\JoinColumn;
use Symfony\Component\Serializer\Annotation\Groups;
use Ramsey\Uuid\Lazy\LazyUuidFromString;
use Ramsey\Uuid\Rfc4122\UuidInterface;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity]
#[ApiResource(
    normalizationContext: ['groups' => ['read:event']],
    denormalizationContext: ['groups' => ['write:event']],
)]

//Event.Admin.Create (WORKS)
#[Post(
    securityPostDenormalize: "is_granted('edit', object)",
    // security: "is_granted('edit', object)",
    uriTemplate: '/organizations/{orgId}/events/.{_format}',
    uriVariables: [
        'orgId' => new Link(
            fromClass: Organization::class,
            fromProperty: 'id',
            toClass: Event::class,
            toProperty: 'organization',
            description: 'The ID of the organization that owns the event'
        )
    ],
    denormalizationContext: ['groups' => ['write:event']],
    processor: LoggerStateProcessor::class
)]
//Event.Admin.View (WORKS)
#[GetCollection(
    //FIX WITH EXTENSION filtering see \Doctrine\OrgAdminOfExtension
    uriTemplate: '/organizations/{orgId}/events/.{_format}',
    uriVariables: [
        'orgId' => new Link(
            fromClass: Organization::class,
            fromProperty: 'id',
            toClass: Event::class,
            toProperty: 'organization',
            description: 'The ID of the organization that owns the event'
        )
    ],
    requirements: ['orgId' => '\d+'],
    normalizationContext: ['groups' => ['read:event:collection']]
)]
//Event.Admin.Changes (WORKS FOR EVERYTHING EXCEPT BUDGET)
#[Patch(
    security: "is_granted('edit', object)",
    uriTemplate: '/events/{id}.{_format}',
    denormalizationContext: ['groups' => ['write:event:changes'], "enable_max_depth" => true],
    processor: LoggerStateProcessor::class
)]
//Event.Admin.AddAttendees (DOES NOT WORK)
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
    processor: LoggerStateProcessor::class,
    normalizationContext: ['groups' => ['test:attendees']]
)]

/**
 * The events that are organized by organizations.
 */
class Event
{
    #[ORM\Id]
    #[ApiProperty(identifier: true)]
    #[ORM\Column(name: 'id', type: 'uuid')]
    #[Groups(['read:event', 'read:event:collection'])]
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
    #[Groups(['read:event', 'write:event',  'read:event:collection', 'write:event:changes'])]
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
    #[Groups(['read:event', 'write:event',  'read:event:collection', 'write:event:changes'])]
    public \DateTimeInterface $startDateTime;
    public function getStartDateTime(): \DateTimeInterface
    {
        return $this->startDateTime;
    }

    #[ORM\Column(type: 'datetime')]
    #[Groups(['read:event', 'write:event',  'read:event:collection', 'write:event:changes'])]
    public \DateTimeInterface $endDateTime;
    // Getter for endDateTime
    public function getEndDateTime(): \DateTimeInterface
    {
        return $this->endDateTime;
    }

    #[ORM\Column(type: 'datetime')]
    #[Groups(['read:event', 'write:event', 'read:event:collection', 'write:event:changes'])]
    public \DateTimeInterface $startFlightBooking;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['read:event', 'write:event', 'read:event:collection', 'write:event:changes'])]
    public \DateTimeInterface $endFlightBooking;

    #[ORM\Column(length: 55)]
    #[Groups(['read:event', 'write:event'])]
    public string $location;

    #[ORM\Column(type: 'integer')]
    #[Groups(['read:event', 'write:event', 'write:event:changes'])]
    public int $maxAttendees;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $createdDate;

    #[ORM\ManyToOne(targetEntity: Organization::class, inversedBy: 'events')]
    #[ORM\JoinColumn(name: 'organization_id', referencedColumnName: 'id', nullable: true)]
    #[Groups(['read:event', 'write:event'])]
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
    #[ORM\OneToOne(targetEntity: Budget::class)]
    #[ORM\JoinColumn(name: 'budgetID', referencedColumnName: 'id', nullable: true)]
    #[Groups(['read:event:booking',  'read:event:collection'])]
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
    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'eventsAttending', cascade: ['all'])]
    #[ORM\JoinTable(name: 'events_attendees')]
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
        $this->attendees = new ArrayCollection(
            array_unique(
                array_merge(
                    $this->attendees->toArray(),
                    $attendees
                )
            )
        );
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
