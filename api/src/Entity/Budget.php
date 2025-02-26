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
    normalizationContext: ['groups' => ['read:budget']]
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
    uriTemplate: '/budgets/{id}',
    requirements: ['id' => '\d+'],
    denormalizationContext: ['groups' => ['write:budget']]
)]
#[GetCollection(
    uriTemplate: '/budgets',
    normalizationContext: ['groups' => ['read:budget']]
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
    normalizationContext: ['groups' => ['read:budget']]
)]
/** An events budget, a subresource of events */
class Budget
{
    // Table setup
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id', type: 'integer')]
    #[Groups(['read:budget', 'write:budget'])]
    public int $id;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    #[Groups(['read:budget', 'write:budget'])]
    public float $total;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    public float $spentBudget = 0.00;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    public float $vipBudget = 0.00;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    #[Groups(['read:budget', 'write:budget'])]
    public float $regBudget;

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

    #[ORM\ManyToOne(targetEntity: Organization::class)]
    #[Groups(['read:budget', 'write:budget'])]
    public Organization $organization;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}
