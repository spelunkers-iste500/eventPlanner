<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use DateTimeInterface;
use Ramsey\Uuid\Lazy\LazyUuidFromString;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ApiResource]
#[GetCollection(
    uriTemplate: '/my/flights.{_format}',
)]
#[Get(
    uriTemplate: '/flights/{id}.{_format}',
    security: "is_granted('view', object)"
)]
#[Patch(
    uriTemplate: '/flights/{id}.{_format}',
    security: "is_granted('edit', object)",
    denormalizationContext: ['groups' => ['write:flights']],
)]
class Flight
{
    #[ORM\Id]
    #[ORM\Column(name: 'id', type: 'uuid')]
    #[Groups([
        'read:myEvents',
        'read:event:collection'
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
    #[Groups([
        'read:myEvents',
        'event:csv:export',
        'read:event:collection'
    ])]
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

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;
        return $this;
    }

    #[ORM\Column(type: 'datetime', nullable: true)]
    #[Groups([
        'read:myEvents'
    ])]
    private ?DateTimeInterface $departureDateTime = null;

    public function getDepartureDateTime(): ?DateTimeInterface
    {
        return $this->departureDateTime;
    }
    public function setDepartureDateTime(DateTimeInterface $departureDateTime): self
    {
        $this->departureDateTime = $departureDateTime;
        return $this;
    }
    #[ORM\Column(type: 'datetime', nullable: true)]
    #[Groups([
        'read:myEvents'
    ])]
    private ?DateTimeInterface $arrivalDateTime = null;

    public function getArrivalDateTime(): ?DateTimeInterface
    {
        return $this->arrivalDateTime;
    }
    public function setArrivalDateTime(DateTimeInterface $arrivalDateTime): self
    {
        $this->arrivalDateTime = $arrivalDateTime;
        return $this;
    }

    #[ORM\Column(nullable: true)]
    #[Groups([
        'read:myEvents'
    ])]
    private ?string $departureLocation = null;

    public function getDepartureLocation(): ?string
    {
        return $this->departureLocation;
    }
    public function setDepartureLocation(string $departureLocation): self
    {
        $this->departureLocation = $departureLocation;
        return $this;
    }

    #[ORM\Column(nullable: true)]
    #[Groups([
        'read:myEvents'
    ])]
    private ?string $arrivalLocation = null;

    public function getArrivalLocation(): ?string
    {
        return $this->arrivalLocation;
    }
    public function setArrivalLocation(string $arrivalLocation): self
    {
        $this->arrivalLocation = $arrivalLocation;
        return $this;
    }

    #[ORM\Column(nullable: true)]
    #[Groups(['event:csv:export'])]
    private ?string $flightNumber = null;

    public function getFlightNumber(): ?string
    {
        return $this->flightNumber;
    }
    public function setFlightNumber(string $flightNumber): self
    {
        $this->flightNumber = $flightNumber;
        return $this;
    }

    #[ORM\Column]
    #[Groups([
        'read:myEvents'
    ])]
    private ?string $duffelOrderID = null;
    public function getDuffelOrderID(): ?string
    {
        return $this->duffelOrderID;
    }

    public function setDuffelOrderID(string $duffelOrderID): self
    {
        $this->duffelOrderID = $duffelOrderID;
        return $this;
    }

    #[ORM\Column]
    #[Groups([
        'read:myEvents',
        'read:event:collection'
    ])]
    private ?string $bookingRefernce = null;
    public function getBookingRefernce(): ?string
    {
        return $this->bookingRefernce;
    }
    public function setBookingRefernce(string $bookingRefernce): self
    {
        $this->bookingRefernce = $bookingRefernce;
        return $this;
    }

    #[ORM\Column()]
    #[Groups([
        'read:myEvents',
        'read:event:collection',
        'write:flights'
    ])]
    #[Assert\Choice(choices: ['pending', 'approved', 'rejected'])]
    private ?string $approvalStatus = null;

    public function getApprovalStatus(): ?string
    {
        return $this->approvalStatus;
    }
    public function setApprovalStatus(string $approvalStatus): self
    {
        $this->approvalStatus = $approvalStatus;
        return $this;
    }

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $createdDate;

    public function __construct()
    {
        $this->id = Uuid::uuid4();
        $this->approvalStatus = 'pending';
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}
