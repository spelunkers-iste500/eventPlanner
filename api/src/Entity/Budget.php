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
    public ?int $budgetID; //DON'T USE THIS IT MAKES ME ERROR -Gavin
    //public int $budgetID;

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
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'budget')]
    #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id', nullable: false)]
    public User $financialPlannerID;

    public function __construct()
    {
        $this->events = new ArrayCollection();
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();

    }

}
