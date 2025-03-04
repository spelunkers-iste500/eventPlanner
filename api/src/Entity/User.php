<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use Symfony\Component\Validator\Constraints as Assert;
use App\Repository\UserRepository;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping\JoinTable;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:write']],
)]
#[Get(security: "is_granted('view', object)")]
#[Patch(security: "is_granted('edit', object)")]
#[ORM\Table(name: 'users')]
class User implements PasswordAuthenticatedUserInterface, UserInterface
{

    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(name: 'id', type: 'integer')]
    #[Groups(['user:read', 'user:write'])]
    public int $id;

    #[ORM\Column(length: 255, nullable: true)]
    // #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    #[Groups(['user:read', 'user:write'])]
    public ?string $name = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[Groups(['user:read', 'user:write'])]
    public ?string $email = null;

    #[ORM\Column(name: '"emailVerified"', type: 'datetime', nullable: true)]
    public \DateTimeInterface $emailVerified;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    public ?string $image = null;

    #[ORM\OneToOne(targetEntity: Account::class, mappedBy: 'user', cascade: ['all'])]
    private Account $account;

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $roles = [];

    #[ORM\ManyToMany(targetEntity: Flight::class, inversedBy: "users")]
    #[ORM\JoinTable(name: "users_flights")]
    private Collection $flights;

    #[ORM\ManyToMany(targetEntity: Organization::class, inversedBy: 'users',cascade: ['persist'])]
    #[ORM\JoinTable(name: 'organizations_members')]
    public Collection $OrgMembership;

    #[ORM\ManyToMany(targetEntity: Organization::class, inversedBy: 'admins')]
    #[ORM\JoinTable(name: 'organizations_admins')]
    #[Groups(['user:read', 'user:write'])]
    private Collection $AdminOfOrg;

    #[ORM\ManyToMany(targetEntity: Event::class, inversedBy: 'attendees')]
    #[Groups(['user:read', 'user:write'])]
    private Collection $events;

    #[ORM\ManyToMany(targetEntity: Event::class, inversedBy: 'eventAdmins')]
    #[ORM\JoinTable(name: 'eventAdmins_events')]
    // #[Groups(['user:read', 'user:write'])]
    private Collection $adminOfEvents;

    #[ORM\ManyToMany(targetEntity: Organization::class, inversedBy: 'financeAdmins')]
    #[JoinTable(name: 'organizations_finance_admins')]
    private Collection $financeAdminOfOrg;

    #[ORM\ManyToMany(targetEntity: Event::class, inversedBy: 'financeAdmins')]
    #[JoinTable(name: 'events_finance_admins')]
    private Collection $financeAdminOfEvents;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public ?\DateTimeInterface $lastModified = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public ?\DateTimeInterface $createdDate = null;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $offerId = null;

    public function __construct()
    {
        $this->flights = new ArrayCollection();
        $this->OrgMembership = new ArrayCollection();
        $this->AdminOfOrg = new ArrayCollection();
        $this->events = new ArrayCollection();
        $this->lastModified = new \DateTime();
        $this->account = new Account($this);
        $this->createdDate = new \DateTime();
        $this->emailVerified = new \DateTime();
        $this->roles = [];
    }

    public function getRoles(): array
    {
        // guarantee every user at least has ROLE_USER
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        $roles[] = 'ROLE_ADMIN';
        return array_unique($roles);
        // return $this->roles;
    }
    public function setRoles(array $roles): void
    {
        $this->roles = $roles;
    }
    public function eraseCredentials(): void {}
    public function getUserIdentifier(): string
    {
        return $this->id;
    }
    #[Groups(['user:write'])]
    public function getPassword(): string
    {
        return $this->account->providerAccountId;
    }
    public function getAccount(): Account
    {
        return $this->account;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    public function getEmailVerified(): \DateTimeInterface
    {
        return $this->emailVerified;
    }

    public function setEmailVerified(\DateTimeInterface $emailVerified): void
    {
        $this->emailVerified = $emailVerified;
    }

    public function getImage(): string
    {
        return $this->image;
    }

    public function setImage(string $image): void
    {
        $this->image = $image;
    }

    public function getLastModified(): \DateTimeInterface
    {
        return $this->lastModified;
    }

    public function setLastModified(\DateTimeInterface $lastModified): void
    {
        $this->lastModified = $lastModified;
    }

    public function getCreatedDate(): \DateTimeInterface
    {
        return $this->createdDate;
    }

    public function setCreatedDate(\DateTimeInterface $createdDate): void
    {
        $this->createdDate = $createdDate;
    }

    public function getFlights(): Collection
    {
        return $this->flights;
    }

    public function setFlights(Collection $flights): void
    {
        $this->flights = $flights;
    }

    public function getOrganizations(): Collection
    {
        return $this->OrgMembership;
    }

    public function setOrgMembership(Collection $OrgMembership): void
    {
        $this->OrgMembership = $OrgMembership;
    }

    public function getAdminOfOrg(): Collection
    {
        return $this->AdminOfOrg;
    }

    public function addAdminOfOrg(Organization $organization): void
    {
        if (!$this->AdminOfOrg->contains($organization)) {
            $this->AdminOfOrg[] = $organization;
        }
    }

    public function removeAdminOfOrg(Organization $organization): void
    {
        $this->AdminOfOrg->removeElement($organization);
    }

    public function getOfferId(): ?string
    {
        return $this->offerId;
    }

    public function setOfferId(?string $offerId): void
    {
        $this->offerId = $offerId;
    }

    public function getEvents(): Collection
    {
        return $this->events;
    }

    public function addEvents(Event $event): void
    {
        if (!$this->events->contains($event)) {
            $this->events[] = $event;
        }
    }
    public function removeEvents(Event $event): void
    {
        $this->events->removeElement($event);
    }
}
