<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use App\State\EventStateProcessor;
use App\State\LoggerStateProcessor;
use PhpCsFixer\Tokenizer\Analyzer\Analysis\CaseAnalysis;
use Symfony\Component\Serializer\Annotation\Groups;
use Ramsey\Uuid\Lazy\LazyUuidFromString;
use Ramsey\Uuid\Rfc4122\UuidInterface;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity]
#[ApiResource]
// Access the budget through the org/event
// this route should be used by the end user, who is 
// viewing the budget they are allocated for the event

//User.Get.Budget
#[Get(
    uriTemplate: '/budgets/{id}',
    normalizationContext: ['groups' => ['user:read:budget']],
    security: "is_granted('view', object)"
)]

//financial.admin.create
#[Post(
    securityPostDenormalize: "is_granted('edit', object)",
    uriTemplate: '/budgets.{_format}',
    denormalizationContext: ['groups' => ['write:budget']],
    processor: LoggerStateProcessor::class
)]

//financial.admin.patch
#[Patch(
    description: 'update a budget for an organization',
    uriTemplate: '/budgets/{id}.{_format}',
    security: "is_granted('edit', object)",
    denormalizationContext: ['groups' => ['replace:budget']],
    processor: LoggerStateProcessor::class
)]
/**#[GetCollection(
    uriTemplate: '/budgets',
    normalizationContext: ['groups' => ['read:budget']],
    security: "is_granted('ROLE_ADMIN')"
)]*/

//Fincial.Admin.View
#[GetCollection(
    description: 'Get all budgets for an organization',
    uriTemplate: '/organizations/{orgId}/budgets.{_format}',
    uriVariables: [
        'orgId' => new Link(
            fromClass: Organization::class,
            fromProperty: 'id',
            toClass: Budget::class,
            toProperty: 'organization',
            description: 'The ID of the organization that owns the budget'
        )
    ],
    normalizationContext: ['groups' => ['read:budget']],
    processor: LoggerStateProcessor::class
)]

#[Delete(
    security: "is_granted('edit', object)",
    uriTemplate: '/budgets/{id}.{_format}',
    processor: LoggerStateProcessor::class
)]

/** 
 * An events budget, a subresource of events
 * Viewable by finance admins, org admins, and the user can only see allocated per person budget.
 */
class Budget
{
    // Table setup
    #[ApiProperty(identifier: true)]
    #[ORM\Id]
    #[ORM\Column(name: 'id', type: 'uuid')]
    #[Groups(['read:budget', 'read:myEvents', 'user:read:budget', 'event:csv:export'])]
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
    #[Groups(['read:budget', 'write:budget', 'read:user:budget', 'read:myEvents', 'user:read:budget', 'replace:budget', 'event:csv:export'])]
    /**
     * The per user budget for an event.
     */
    private int $perUserTotal = 0;

    /**
     * @return float The per user budget for the event, in dollars.cents "0.00"
     */
    public function getPerUserTotal(): float
    {
        return $this->perUserTotal / 100;
    }
    /**
     * @param float $perUserTotal The per user budget for the event, in dollars.cents "0.00"
     * @return self
     * Converts the float to an integer for storage
     */
    public function setPerUserTotal(float $perUserTotal): self
    {
        $this->perUserTotal = (int) $perUserTotal * 100;
        return $this;
    }

    // @todo: relate to Flight entity to allow calculating the budget used

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $createdDate;

    //ADD OVERATE
    #[ORM\Column]
    #[Groups(['read:budget', 'write:budget', 'read:user:budget', 'read:myEvents', 'user:read:budget', 'replace:budget', 'event:csv:export'])]
    private int $overage = 0;

    public function getOverage(): int
    {
        return $this->overage;
    }

    public function setOverage(int $overage): self
    {
        $this->overage = $overage;
        return $this;
    }

    //Relationships

    //Budget -> User
    #[ORM\ManyToOne(targetEntity: User::class)]
    // #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id', nullable: true)]
    public ?User $financialPlannerID;

    #[ORM\OneToOne(targetEntity: Event::class, inversedBy: 'budget', cascade: ["persist"])]
    #[ORM\JoinColumn(name: 'event_id', referencedColumnName: 'id', nullable: false)]
    #[Groups(['read:budget', 'user:read:budget', 'write:budget'])] //should we be able to change events for a budget?
    public Event $event;
    public function getEvent(): Event
    {
        return $this->event;
    }
    public function setEvent(Event $event): self
    {
        $this->event = $event;
        $event->setBudget($this);
        return $this;
    }

    public function getBudgetTotal(): float|int
    {
        $perUserTotal = ($this->perUserTotal / 100);
        $attendeeCount = $this->event->getAttendees()->count();
        return $perUserTotal * $attendeeCount;
    }

    #[Groups(['read:budget'])]
    public function getSpentBudget(): string
    {
        // will sum the total spent on flights for the event
        $spent = 0;
        foreach ($this->event->getFlights() as $flight) {
            $spent += $flight->getFlightCost();
        }
        return $spent;
    }

    #[ORM\ManyToOne(targetEntity: Organization::class, inversedBy: 'budgets')]
    #[Groups(['read:budget', 'write:budget', 'user:read:budget'])]
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

    public function __construct()
    {
        $this->id = Uuid::uuid4();
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
        $this->perUserTotal = 0;
    }

    public function getFinanceAdmins(): Collection
    {
        // should combine finance admins from the budget, the event, and the org,
        // and return unique
        $admins = new ArrayCollection();
        $admins->add($this->financialPlannerID);
        $admins->add($this->organization->getFinanceAdmins());
        return $admins;
    }
}
