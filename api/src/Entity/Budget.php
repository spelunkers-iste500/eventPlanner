<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ApiResource]
// Access the budget through the org/event
// this route should be used by the end user, who is 
// viewing the budget they are allocated for the event.
#[Get(
    uriTemplate: '/organizations/{orgId}/events/{eventId}/budget/{id}',
    uriVariables: [
        'orgId' => new Link(
            fromClass: Organization::class,
            fromProperty: 'id',
            toClass: Budget::class,
            toProperty: 'organization',
            description: 'The ID of the organization that owns the event'
        ),
        'eventId' => new Link(
            fromClass: Event::class,
            fromProperty: 'id',
            toClass: Budget::class,
            toProperty: 'event',
            description: 'The ID of the event that owns the budget'
        ),
        'id' => 'id'
    ],
    requirements: ['id' => '\d+', 'eventId' => '\d+', 'orgId' => '\d+'],
    normalizationContext: ['groups' => ['read:user:budget']],
    security: 'is_granted("ROLE_USER")'
)]
#[Get(
    uriTemplate: '/budgets/{id}',
    normalizationContext: ['groups' => ['read:budget']]
)]
#[Post(
    uriTemplate: '/budgets',
    denormalizationContext: ['groups' => ['write:budget']],

)]
#[Patch(
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
    requirements: ['orgId' => '\d+'],
    normalizationContext: ['groups' => ['write:budget']]
)]
#[GetCollection(
    uriTemplate: '/budgets',
    normalizationContext: ['groups' => ['read:budget']],
    security: 'is_granted("ROLE_ADMIN")'
)]
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
    requirements: ['orgId' => '\d+'],
    normalizationContext: ['groups' => ['read:budget']],
)]
/** 
 * An events budget, a subresource of events
 * Viewable by finance admins, org admins, and the user can only see allocated per person budget.
 */
class Budget
{
    // Table setup
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id', type: 'integer')]
    #[Groups(['read:budget', 'write:budget'])]
    public int $id;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    #[Groups(['read:budget', 'write:budget', 'read:user:budget'])]
    public string $total = "0.00";

    /**
     * The spent budget is only visible to the org and finance admins
     */
    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    #[Groups(['read:budget', 'write:budget'])]
    public string $spentBudget = "0.00";

    /** 
     * The VIP budget should be divided by the number of VIP attendees of the associated event.
     */
    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    #[Groups(['read:budget', 'write:budget'])]
    public string $vipBudget = "0.00";

    /**
     * The regular budget should be divided by the number of attendees of the associated event.
     */
    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    #[Groups(['read:budget', 'write:budget'])]
    public string $regBudget;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $createdDate;

    //Relationships

    //Budget -> User
    #[ORM\ManyToOne(targetEntity: User::class)]
    // #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id', nullable: true)]
    public ?User $financialPlannerID;

    #[ORM\OneToOne(targetEntity: Event::class)]
    #[Groups(['read:budget', 'write:budget'])]
    public Event $event;

    #[ORM\ManyToOne(targetEntity: Organization::class, inversedBy: 'budgets')]
    #[Groups(['read:budget', 'write:budget'])]
    public Organization $organization;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
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
    public function getEvent(): Event
    {
        return $this->event;
    }
    public function setEvent(Event $event): self
    {
        $this->event = $event;
        return $this;
    }
    public function getFinanceAdmins(): Collection
    {
        // should combine finance admins from the budget, the event, and the org,
        // and return unique
        $admins = new ArrayCollection();
        $admins->add($this->financialPlannerID);
        $admins->add($this->event->getFinanceAdmins());
        $admins->add($this->organization->getFinanceAdmins());
        return $admins;
    }
}
