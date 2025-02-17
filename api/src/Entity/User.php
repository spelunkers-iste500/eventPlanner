<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Validator\Constraints as Assert;
use App\Repository\UserRepository;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ApiResource]
#[ORM\Table(name: 'users')]
class User implements PasswordAuthenticatedUserInterface, UserInterface
{

    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(name: 'id', type: 'integer')]
    public int $id;

    #[ORM\Column(length: 255, nullable: true)]
    // #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    public ?string $name = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Email]
    public ?string $email = null;

    #[ORM\Column(name: '"emailVerified"', type: 'datetime', nullable: true)]
    public \DateTimeInterface $emailVerified;

    #[ORM\Column(length: 255, nullable: true)]
    public ?string $image = null;

    #[ORM\OneToOne(targetEntity: Account::class, mappedBy: 'user', cascade: ['all'])]
    private Account $account;

    #[ORM\ManyToMany(targetEntity: Role::class, inversedBy: 'users')]
    #[ORM\JoinTable(name: 'roles_users')]
    private Collection $roles;

    #[ORM\ManyToMany(targetEntity: Flight::class, inversedBy: "users")]
    #[ORM\JoinTable(name: "users_flights")]
    private Collection $flights;

    #[ORM\ManyToMany(targetEntity: Organization::class, inversedBy: 'users')]
    #[ORM\JoinTable(name: 'organizations_users')]
    private Collection $organizations;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public ?\DateTimeInterface $lastModified = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public ?\DateTimeInterface $createdDate = null;

    public function __construct()
    {
        $this->roles = new ArrayCollection();
        $this->flights = new ArrayCollection();
        $this->organizations = new ArrayCollection();
        $this->lastModified = new \DateTime();
        $this->account = new Account($this);
        $this->createdDate = new \DateTime();
        $this->emailVerified = new \DateTime();
    }

    public function getRoles(): array
    {
        return $this->roles->toArray();
    }
    public function eraseCredentials() {}
    public function getUserIdentifier(): string
    {
        return $this->id;
    }
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
        return $this->organizations;
    }

    public function setOrganizations(Collection $organizations): void
    {
        $this->organizations = $organizations;
    }
}
