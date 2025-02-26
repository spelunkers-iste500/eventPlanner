<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ApiResource(
    normalizationContext: ['groups' => ['org:read']],
    denormalizationContext: ['groups' => ['org:write']],
)]
class Organization
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id', type: 'integer')]
    #[Groups(['org:read', 'org:write'])]
    public ?int $id = null;

    #[ORM\Column(length: 55)]
    #[Groups(['org:read', 'org:write'])]
    public string $name;

    #[ORM\Column(length: 255)]
    #[Groups(['org:read', 'org:write'])]
    public string $description;

    #[ORM\Column(length: 255)]
    #[Groups(['org:read', 'org:write'])]
    public string $address;

    #[ORM\Column(length: 55)]
    #[Groups(['org:read', 'org:write'])]
    public string $primaryEmail;

    #[ORM\Column(length: 55)]
    #[Groups(['org:read', 'org:write'])]
    public string $secondaryEmail;

    #[ORM\Column(length: 55)]
    #[Groups(['org:read', 'org:write'])]
    public string $industry;

    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'organizations')]
    private Collection $users;

    #[ORM\OneToMany(targetEntity: Event::class, mappedBy: 'organization')]
    // #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id')]
    #[Groups(['org:read', 'org:write'])]
    public ?Collection $events;

    #[ORM\OneToMany(targetEntity: Budget::class, mappedBy: 'organization')]
    #[Groups(['org:read', 'org:write'])]
    public ?Collection $budgets;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $createdDate;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}
