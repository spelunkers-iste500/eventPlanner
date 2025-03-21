<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\State\LoggerStateProcessor;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping\JoinTable;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Entity\User;
use Ramsey\Uuid\Lazy\LazyUuidFromString;
use Ramsey\Uuid\Rfc4122\UuidInterface;
use Ramsey\Uuid\Uuid;

#[ORM\Entity]
#[ApiResource]
// TODO: implement filters to reduce the amount of data that
// is returned to the user when searching for all organizations
#[GetCollection(
    denormalizationContext: ['groups' => ['org:collectionRead']],
    description: "Gets all organizations, requires admin role",
    normalizationContext: ['groups' => ['org:read:collection']]
)]
// users can only view if they're part of the org
//org.user.view
#[Get(
    security: "is_granted('view', object)",
    description: "Gets a single organization. Users can only view if they're part of the org, or an admin",
    normalizationContext: ['groups' => ['org:read']],
    processor: LoggerStateProcessor::class
)]
// users can only edit if they're an admin of the org
//org.orgadmin.change
#[Patch(
    security: "is_granted('edit', object)",
    description: "Edits an organization. Users can only edit if they're an admin",
    denormalizationContext: ['groups' => ['org:write']],
    processor: LoggerStateProcessor::class
)]
// users can only create or destroy if they're a platform admin
//org.orgadmin.create
#[Post(
    security: "is_granted('ROLE_ADMIN')",
    description: "Creates a new organization. Users can only create if they're a platform admin",
    denormalizationContext: ['groups' => ['org:write']],
    // processor: LoggerStateProcessor::class
)]
//org.orgadmin.delete
#[Delete(
    security: "is_granted('ROLE_ADMIN')",
    description: "Deletes an organization. Users can only delete if they're a platform admin",
    processor: LoggerStateProcessor::class
)]
#[GetCollection(
    uriTemplate: '/my/organizations/.{_format}',
    normalizationContext: ['groups' => ['org:read']]
)]
#[ORM\Table(name: 'organization')]
class Organization
{
    #[ApiProperty(identifier: true)]
    #[ORM\Id]
    #[ORM\Column(name: 'id', type: 'uuid', unique: true)]
    #[Groups(['org:read', 'org:collectionRead'])]
    private $id;

    public function getId(): UuidInterface | LazyUuidFromString
    {
        return $this->id;
    }
    // public function getUuid(): UuidInterface | LazyUuidFromString
    // {
    //     return $this->id;
    // }
    public function setId(UuidInterface $id): void
    {
        $this->id = $id;
    }

    /**
     * @var string $name the name of the organization
     */
    #[ORM\Column(length: 55)]
    #[Groups(['org:read', 'org:write'])]
    private string $name;

    /**
     * @return string the name of the organization
     */
    public function getName(): string
    {
        return $this->name;
    }
    /**
     * @param string $name the name of the organization
     */
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /**
     * @var string $description the description of the organization
     */
    #[ORM\Column(length: 255)]
    #[Groups(['org:read', 'org:write'])]
    private string $description;

    /**
     * @return string the description of the organization
     */
    public function getDescription(): string
    {
        return $this->description;
    }
    /**
     * @param string $description the description of the organization
     */
    public function setDescription(string $description): void
    {
        $this->description = $description;
    }

    /**
     * @var string $address the address of the organization
     */
    #[ORM\Column(length: 255)]
    #[Groups(['org:read', 'org:write'])]
    private string $address;
    /**
     * @return string the address of the organization
     */
    public function getAddress(): string
    {
        return $this->address;
    }
    /**
     * @param string $address the address of the organization
     */
    public function setAddress(string $address): void
    {
        $this->address = $address;
    }

    /**
     * @var User $primaryContact the primary contact of the organization
     */
    // #[ORM\Column(length: 55)]
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'primaryContactOfOrg')]
    #[JoinTable(name: 'org_user_primary_contact')]
    #[Groups(['org:read', 'org:write'])]
    private User $primaryContact;
    /**
     * @return User the primary contact of the organization
     */
    public function getPrimaryContact(): User
    {
        return $this->primaryContact;
    }
    /**
     * @param User $primaryContact the primary contact of the organization
     */
    public function setPrimaryContact(User $primaryContact): void
    {
        $this->primaryContact = $primaryContact;
    }

    #[ORM\Column(length: 55)]
    #[Groups(['org:read', 'org:write'])]
    private string $industry;
    public function getIndustry(): string
    {
        return $this->industry;
    }
    public function setIndustry(string $industry): void
    {
        $this->industry = $industry;
    }

    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'OrgMembership')]
    #[Groups(['org:read'])]
    private Collection $users;
    public function getUsers(): Collection
    {
        return $this->users;
    }

    // All users that are org admins
    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'AdminOfOrg', cascade: ['all'])]
    #[Groups(['org:read', 'org:write'])]
    private Collection $admins;

    public function getAdmins(): Collection
    {
        return $this->admins;
    }

    public function addAdmin(User $user): self
    {
        if (!$this->admins->contains($user)) {
            $this->admins[] = $user;
            $user->addAdminOfOrg($this);
        }
        return $this;
    }
    public function removeAdmin(User $user): self
    {
        $this->admins->removeElement($user);
        return $this;
    }
    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'eventAdminOfOrg', cascade: ['all'])]
    #[Groups(['org:read', 'org:write'])]
    private Collection $eventadmins;
    public function getEventAdmins(): Collection
    {
        return $this->eventadmins;
    }
    public function addEventAdmin(User $user): self
    {
        if (!$this->eventadmins->contains($user)) {
            $this->eventadmins[] = $user;
        }
        return $this;
    }
    public function removeEventAdmin(User $user): self
    {
        $this->eventadmins->removeElement($user);
        return $this;
    }


    #[ORM\OneToMany(targetEntity: Event::class, mappedBy: 'organization')]
    // #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id')]
    #[Groups(['org:read', 'org:write'])]
    private ?Collection $events;
    public function getEvents(): Collection
    {
        return $this->events;
    }

    #[ORM\OneToMany(targetEntity: Budget::class, mappedBy: 'organization', cascade: ['all'])]
    #[Groups(['org:read', 'org:write'])]
    private ?Collection $budgets;
    public function getBudgets(): Collection
    {
        return $this->budgets;
    }

    #[ORM\Column(type: 'datetime', nullable: true)]
    private \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private \DateTimeInterface $createdDate;

    #[ORM\Column(type: 'string', length: 255, unique: true, nullable: true)]
    #[Groups(['org:read', 'org:write'])]
    private ?string $inviteCode;

    public function getInviteCode(): string
    {
        return $this->inviteCode;
    }
    public function setInviteCode(string $inviteCode): void
    {
        $this->inviteCode = $inviteCode;
    }

    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'financeAdminOfOrg', cascade: ['all'])]
    #[Groups(['org:read', 'org:write'])]
    private collection $financeAdmins;

    public function getFinanceAdmins(): Collection
    {
        return new ArrayCollection(
            array_unique(
                array_merge(
                    $this->financeAdmins->toArray(),
                    $this->admins->toArray()
                )
            )
        );
    }

    //change to where you can specify other users as financial admins (it is current attached to only this user)
    public function addFinanceAdmins(User $user): self
    {
        if (!$this->financeAdmins->contains($user)) {
            $this->financeAdmins[] = $user;
            $user->addFinanceAdminOfOrg($this);
        }
        return $this;
    }
    public function removeFinanceAdmins(User $user): self
    {
        $this->financeAdmins->removeElement($user);
        return $this;
    }

    public function __construct()
    {
        $this->id = Uuid::uuid4();
        $this->users = new ArrayCollection();
        $this->admins = new ArrayCollection();
        $this->eventadmins = new ArrayCollection();
        $this->financeAdmins = new ArrayCollection();
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}
