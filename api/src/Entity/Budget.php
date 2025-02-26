<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;

#[ORM\Entity]
#[ApiResource]
// #[Get(
//     uriTemplate: '/organizations/{orgId}/events/{eventId}/budget/{id}',
//     requirements: ['id' => '\d+'],
//     normalizationContext: ['groups' => ['read:budget']]
// )]
#[Get(
    uriTemplate: '/budgets/{id}',
    normalizationContext: ['groups' => ['read:budget']]
)]
#[Post(
    uriTemplate: '/budgets',
    denormalizationContext: ['groups' => ['write:budget']]
)]
#[Patch(
    uriTemplate: '/budgets/{id}',
    requirements: ['id' => '\d+'],
    denormalizationContext: ['groups' => ['write:budget']]
)]
/** An events budget, a subresource of events */
class Budget
{
    // Table setup
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id', type: 'integer')]
    public int $id;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    public string $total;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    public string $spentBudget;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    public string $vipBudget;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    public string $regBudget;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $createdDate;

    //Relationships

    //Budget -> User
    #[ORM\ManyToOne(targetEntity: User::class)]
    // #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id', nullable: true)]
    public User $financialPlannerID;




    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}
