<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class Budget
{
    // Table setup
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'budgetID', type: 'integer')]
    public ?int $budgetID = null;

    #[ORM\Column(type: 'integer')]
    public int $financialPlannerID;

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

    // Relationships
    // #[ORM\OneToMany(mappedBy: 'budget', targetEntity: Event::class, cascade: ['persist', 'remove'])]
    // public Collection $event;

    // #[ORM\OneToMany(mappedBy: 'budget', targetEntity: BudgetChangeManagement::class, cascade: ['persist', 'remove'])]
    // public Collection $budgetChangeManagement;
    
    // no clue if this is how one to many should be done
    //#[ORM\OneToOne(mappedBy: 'budget', targetEntity: User::class, cascade: ['persist', 'remove'])]
    //public Collection $user;

    public function __construct()
    {
        $this->events = new ArrayCollection();
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();

    }

}
