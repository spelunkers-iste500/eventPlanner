<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Post;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ApiResource(
    normalizationContext: ['groups' => ['read:event']],
    denormalizationContext: ['groups' => ['write:event']],
)]
#[Get(
    uriTemplate: '/events/{id}.{_format}',
    requirements: ['id' => '\d+'],
    normalizationContext: ['groups' => ['read:event']]
)]
#[Get(
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
    uriTemplate: '/events.{_format}',
    denormalizationContext: ['groups' => ['write:event']]
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

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }

    public function getId(): int
    {
        return $this->id;
    }
}
