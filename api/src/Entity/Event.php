<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Post;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ApiResource(
    normalizationContext: ['groups' => ['read:event']],
    denormalizationContext: ['groups' => ['write:event']],
)]
#[Get(
    security: "is_granted('view', object)",
    uriTemplate: '/events/{id}.{_format}',
    requirements: ['id' => '\d+'],
    normalizationContext: ['groups' => ['read:event']]
)]
#[Get(
    security: "is_granted('view', object)",
    uriTemplate: '/organizations/{orgId}/events/{id}.{_format}',
    uriVariables: [
        'id' => 'id',
        'orgId' => new Link(
            fromClass: Organization::class,
            fromProperty: 'id',
            toClass: Event::class,
            toProperty: 'organization',
            description: 'The ID of the organization that owns the event'
        )
    ],
    requirements: ['id' => '\d+', 'orgId' => '\d+'],
    normalizationContext: ['groups' => ['read:event']]
)]
#[Post(
    security: "is_granted('edit', object)",
    uriTemplate: '/events.{_format}',
    denormalizationContext: ['groups' => ['write:event']]
)]
#[GetCollection(
    security: "is_granted('edit', object)",
    uriTemplate: '/events.{_format}',
    normalizationContext: ['groups' => ['read:event']]
)]
class Event
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ApiProperty(identifier: true)]
    #[ORM\Column(name: 'id', type: 'integer')]
    #[Groups(['read:event', 'write:event'])]
    public int $id;

    #[ORM\Column(length: 55)]
    #[Groups(['read:event', 'write:event'])]
    public string $eventTitle;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['read:event', 'write:event'])]
    public \DateTimeInterface $startDateTime;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['read:event', 'write:event'])]
    public \DateTimeInterface $endDateTime;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['read:event', 'write:event'])]
    public \DateTimeInterface $startFlightBooking;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['read:event', 'write:event'])]
    public \DateTimeInterface $endFlightBooking;

    #[ORM\Column(length: 55)]
    #[Groups(['read:event', 'write:event'])]
    public string $location;

    #[ORM\Column(type: 'integer')]
    #[Groups(['read:event', 'write:event'])]
    public int $maxAttendees;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $createdDate;

    #[ORM\ManyToOne(targetEntity: Organization::class, inversedBy: 'events')]
    #[ORM\JoinColumn(name: 'organization_id', referencedColumnName: 'id', nullable: true)]
    #[Groups(['read:event', 'write:event'])]
    public Organization $organization;

    //Relationships
    //Event -> Budget
    #[ORM\OneToOne(targetEntity: Budget::class)]
    #[ORM\JoinColumn(name: 'budgetID', referencedColumnName: 'id', nullable: true)]
    public Budget $budget;

    //Event -> User (attendees)
    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'events')]
    #[Groups(['read:event', 'write:event'])]
    public Collection $attendees;

    //Event -> User (finance admins)
    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'financeAdminOfEvents')]
    #[Groups(['read:event', 'write:event'])]
    public Collection $financeAdmins;

    //Event -> User (event admins)
    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'adminOfEvents')]
    #[Groups(['read:event', 'write:event'])]
    public Collection $eventAdmins;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
        $this->attendees = new ArrayCollection();
        $this->financeAdmins = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getEventAdmins(): Collection
    {
        return $this->eventAdmins;
    }
    public function addEventAdmins(User $eventAdmin): self
    {
        if (!$this->eventAdmins->contains($eventAdmin)) {
            $this->eventAdmins[] = $eventAdmin;
        }
        return $this;
    }
    public function removeEventAdmins(User $eventAdmin): self
    {
        $this->eventAdmins->removeElement($eventAdmin);
        return $this;
    }

    public function getOrganization(): Organization
    {
        return $this->organization;
    }
    public function setOrganization(Organization $organization): self
    {
        $this->organization = $organization;
        return $this;
    }
    public function getAttendees(): Collection
    {
        return $this->attendees;
    }
    public function addAttendees(User $attendee): self
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
    public function getFinanceAdmins(): Collection
    {
        return $this->financeAdmins;
    }
    public function addFinanceAdmins(User $financeAdmin): self
    {
        if (!$this->financeAdmins->contains($financeAdmin)) {
            $this->financeAdmins[] = $financeAdmin;
        }
        return $this;
    }
    public function removeFinanceAdmins(User $financeAdmin): self
    {
        $this->financeAdmins->removeElement($financeAdmin);
        return $this;
    }
    public function getBudget(): Budget
    {
        return $this->budget;
    }
    public function setBudget(Budget $budget): self
    {
        $this->budget = $budget;
        return $this;
    }
    public function getEventTitle(): string
    {
        return $this->eventTitle;
    }
    public function setEventTitle(string $eventTitle): self
    {
        $this->eventTitle = $eventTitle;
        return $this;
    }
<<<<<<< Updated upstream
=======

    public function getStartDateTime(): \DateTimeInterface
    {
        return $this->startDateTime;
    }

    // Getter for endDateTime
    public function getEndDateTime(): \DateTimeInterface
    {
        return $this->endDateTime;
    }
    #[Groups(['read:event'])]
    public function getTestField(): string
    {
        return 'test';
    }
>>>>>>> Stashed changes
}
