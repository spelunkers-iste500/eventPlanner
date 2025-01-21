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
    private ?int $budgetID = null;

    #[ORM\Column(type: 'integer')]
    private int $financialPlannerID;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private string $total;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private string $spentBudget;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private string $vipBudget;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private string $regBudget;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $createdDate;

    // Relationships
    #[ORM\OneToMany(mappedBy: 'budget', targetEntity: Event::class, cascade: ['persist', 'remove'])]
    private Collection $event;

    public function __construct()
    {
        $this->events = new ArrayCollection();
    }

    // Getters and Setters
    public function getBudgetID(): ?int
    {
        return $this->budgetID;
    }

    public function getFinancialPlannerID(): int
    {
        return $this->financialPlannerID;
    }

    public function setFinancialPlannerID(int $financialPlannerID): self
    {
        $this->financialPlannerID = $financialPlannerID;
        return $this;
    }

    public function getTotal(): float
    {
        return (float) $this->total;
    }

    public function setTotal(float $total): self
    {
        $this->total = (string) $total;
        return $this;
    }

    public function getSpentBudget(): float
    {
        return (float) $this->spentBudget;
    }

    public function setSpentBudget(float $spentBudget): self
    {
        $this->spentBudget = (string) $spentBudget;
        return $this;
    }

    public function getVipBudget(): float
    {
        return (float) $this->vipBudget;
    }

    public function setVipBudget(float $vipBudget): self
    {
        $this->vipBudget = (string) $vipBudget;
        return $this;
    }

    public function getRegBudget(): float
    {
        return (float) $this->regBudget;
    }

    public function setRegBudget(float $regBudget): self
    {
        $this->regBudget = (string) $regBudget;
        return $this;
    }

    public function getLastModified(): \DateTimeInterface
    {
        return $this->lastModified;
    }

    public function setLastModified(\DateTimeInterface $lastModified): self
    {
        $this->lastModified = $lastModified;
        return $this;
    }

    public function getCreatedDate(): \DateTimeInterface
    {
        return $this->createdDate;
    }

    public function setCreatedDate(\DateTimeInterface $createdDate): self
    {
        $this->createdDate = $createdDate;
        return $this;
    }

    public function getEvents(): Collection
    {
        return $this->events;
    }

    public function addEvent(Event $event): self
    {
        if (!$this->events->contains($event)) {
            $this->events[] = $event;
            $event->setBudget($this);
        }
        return $this;
    }

    public function removeEvent(Event $event): self
    {
        if ($this->events->removeElement($event)) {
            if ($event->getBudget() === $this) {
                $event->setBudget(null);
            }
        }
        return $this;
    }
}
