<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class budgetChangeManagement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'changeID', type: 'integer')]
    public ?int $changeID = null;

    #[ORM\Column(type: 'integer')]
    public int $budgetID;

    #[ORM\Column(length: 55)]
    public string $versionNum;

    #[ORM\Column(type: 'boolean')]
    public bool $active;

    #[ORM\Column(length: 255)]
    public string $description;

    #[ORM\Column(type: 'json')]
    public array $beforeChanges;

    #[ORM\Column(type: 'json')]
    public array $afterChanges;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $createdDate;

    // Relationships
    // #[ORM\ManyToOne(targetEntity: Budget::class, inversedBy: 'budgetChangeManagement')]
    // #[ORM\JoinColumn(name: 'budgetID', referencedColumnName: 'budgetID', nullable: false)]
    // public ?Budget $budget = null;
}
