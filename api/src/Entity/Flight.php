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
    security: "is_granted('view', object)",
    normalizationContext: ['groups' => ['read:flight']],
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
        'read:event:collection',
        'read:flight'
    ])]
    private $id;


    // One UserEvent per Flight
    // inverse side
    #[ORM\OneToOne(targetEntity: UserEvent::class, mappedBy: 'flight', cascade: ['persist', 'remove'])]
    #[Groups([
        'read:flight'
    ])]
    private ?UserEvent $userEvent = null;


    #[ORM\Column]
    #[Groups([
        'read:myEvents',
        'event:csv:export',
        'read:event:collection',
        'read:flight'
    ])]
    public int $flightCost;


    #[ORM\Column(type: 'datetime', nullable: true)]
    #[Groups([
        'read:myEvents',
        'read:flight'
    ])]
    private ?DateTimeInterface $departureDateTime = null;


    #[ORM\Column(type: 'datetime', nullable: true)]
    #[Groups([
        'read:myEvents',
        'read:flight'
    ])]
    private ?DateTimeInterface $arrivalDateTime = null;


    #[ORM\Column(nullable: true)]
    #[Groups([
        'read:myEvents',
        'read:flight'
    ])]
    private ?string $departureLocation = null;


    #[ORM\Column(nullable: true)]
    #[Groups([
        'read:myEvents',
        'read:flight'
    ])]
    private ?string $arrivalLocation = null;


    #[ORM\Column(nullable: true)]
    #[Groups(['event:csv:export'])]
    private ?string $flightNumber = null;


    #[ORM\Column]
    #[Groups([
        'read:myEvents',
        'read:flight'
    ])]
    private ?string $duffelOrderID = null;


    #[ORM\Column]
    #[Groups([
        'read:myEvents',
        'read:event:collection',
        'read:flight'
    ])]
    private ?string $bookingReference = null;


    #[ORM\Column()]
    #[Groups([
        'read:myEvents',
        'read:event:collection',
        'write:flights',
        'read:flight'
    ])]
    #[Assert\Choice(choices: ['pending', 'approved', 'rejected'])]
    private ?string $approvalStatus = null;


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
    public function getUserEvent(): ?UserEvent
    {
        return $this->userEvent;
    }
    public function setUserEvent(?UserEvent $userEvent): self
    {
        $this->userEvent = $userEvent;
        // set (or unset) the owning side of the relation if necessary
        $newFlight = null === $userEvent ? null : $this;
        if ($userEvent->getFlight() !== $newFlight) {
            $userEvent->setFlight($newFlight);
        }
        return $this;
    }
    public function getApprovalStatus(): ?string
    {
        return $this->approvalStatus;
    }
    public function setApprovalStatus(string $approvalStatus): self
    {
        $this->approvalStatus = $approvalStatus;
        return $this;
    }
    public function getbookingReference(): ?string
    {
        return $this->bookingReference;
    }
    public function setbookingReference(string $bookingReference): self
    {
        $this->bookingReference = $bookingReference;
        return $this;
    }
    public function getDuffelOrderID(): ?string
    {
        return $this->duffelOrderID;
    }

    public function setDuffelOrderID(string $duffelOrderID): self
    {
        $this->duffelOrderID = $duffelOrderID;
        return $this;
    }
    public function getFlightNumber(): ?string
    {
        return $this->flightNumber;
    }
    public function setFlightNumber(string $flightNumber): self
    {
        $this->flightNumber = $flightNumber;
        return $this;
    }
    public function getArrivalLocation(): ?string
    {
        return $this->arrivalLocation;
    }
    public function setArrivalLocation(string $arrivalLocation): self
    {
        $this->arrivalLocation = $arrivalLocation;
        return $this;
    }
    public function getDepartureLocation(): ?string
    {
        return $this->departureLocation;
    }
    public function setDepartureLocation(string $departureLocation): self
    {
        $this->departureLocation = $departureLocation;
        return $this;
    }
    public function getArrivalDateTime(): ?DateTimeInterface
    {
        return $this->arrivalDateTime;
    }
    public function setArrivalDateTime(DateTimeInterface $arrivalDateTime): self
    {
        $this->arrivalDateTime = $arrivalDateTime;
        return $this;
    }
    public function getDepartureDateTime(): ?DateTimeInterface
    {
        return $this->departureDateTime;
    }
    public function setDepartureDateTime(DateTimeInterface $departureDateTime): self
    {
        $this->departureDateTime = $departureDateTime;
        return $this;
    }
    public function getId(): UuidInterface | LazyUuidFromString
    {
        return $this->id;
    }
    public function setId(UuidInterface $id): void
    {
        $this->id = $id;
    }
    public function getFlightCost(): int
    {
        return $this->flightCost / 100;
    }

    public function setFlightCost(int $flightCost): self
    {
        $this->flightCost = (int) $flightCost * 100;
        return $this;
    }
}
