<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ApiResource(
    normalizationContext: ['groups' => ['org:read']],
    denormalizationContext: ['groups' => ['org:write']],
)]
// TODO: implement filters to reduce the amount of data that
// is returned to the user when searching for all organizations
#[GetCollection(
    security: "is_granted('ROLE_ADMIN')",
    denormalizationContext: ['groups' => ['org:collectionRead']],
    description: "Gets all organizations, requires admin role",
)]
// users can only view if they're part of the org
#[Get(
    security: "is_granted('view', object)",
    description: "Gets a single organization. Users can only view if they're part of the org, or an admin",
)]
// users can only edit if they're an admin of the org
#[Patch(
    security: "is_granted('edit', object)",
    description: "Edits an organization. Users can only edit if they're an admin",
)]
// users can only create or destroy if they're a platform admin
#[Post(
    security: "is_granted('ROLE_ADMIN')",
    description: "Creates a new organization. Users can only create if they're a platform admin",
)]
#[Delete(
    security: "is_granted('ROLE_ADMIN')",
    description: "Deletes an organization. Users can only delete if they're a platform admin",
)]
class Organization
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id', type: 'integer')]
    #[Groups(['org:read', 'org:write', 'org:collectionRead'])]
    public int $id;

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

    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'OrgMembership')]
    private Collection $users;

    // All users that are org admins
    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'AdminOfOrg')]
    #[Groups(['org:read', 'org:write'])]
    private Collection $admins;

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

    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'financeAdminOfOrg')]
    #[Groups(['org:read', 'org:write'])]
    private collection $financeAdmins;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
    public function getId(): int
    {
        return $this->id;
    }
    public function getAdmins(): Collection
    {
        return $this->admins;
    }
    public function getUsers(): Collection
    {
        return $this->users;
    }
    public function getEvents(): Collection
    {
        return $this->events;
    }
    public function getBudgets(): Collection
    {
        return $this->budgets;
    }
    public function getFinanceAdmins(): Collection
    {
        $admins = new ArrayCollection();
        $admins->add($this->admins);
        $admins->add($this->financeAdmins);
        return $admins;
    }
    public function addFinanceAdmins(User $user): self
    {
        if (!$this->financeAdmins->contains($user)) {
            $this->financeAdmins[] = $user;
        }
        return $this;
    }
    public function removeFinanceAdmins(User $user): self
    {
        $this->financeAdmins->removeElement($user);
        return $this;
    }
}
