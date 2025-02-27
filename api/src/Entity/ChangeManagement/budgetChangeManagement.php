<?php

namespace App\Entity\ChangeManagement;

use App\Entity\Budget;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
// #[ApiResource]
class budgetChangeManagement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id', type: 'integer')]
    public ?int $id = null;

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

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $createdDate;

    //Relationships

    //BudgetChangeManagement -> Budget
    #[ORM\ManyToOne(targetEntity: Budget::class)]
    #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id', nullable: true)]
    public Budget $budget;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}
