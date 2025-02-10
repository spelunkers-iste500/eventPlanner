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
    #[ORM\OneToOne(targetEntity: Account::class, mappedBy: 'user', cascade: ['all'])]
    private Account $account;

    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(name: 'id', type: 'integer')]
    public int $id;

    #[ORM\Column(length: 255, nullable: true)]
    // #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    public string $name;

    #[ORM\Column(length: 255, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Email]
    public string $email;

    #[ORM\Column(name: '"emailVerified"', type: 'datetime', nullable: true)]
    public \DateTimeInterface $emailVerified;

    #[ORM\Column(length: 255, nullable: true)]
    public string $image;

    #[ORM\ManyToMany(targetEntity: Role::class, inversedBy: 'users')]
    #[ORM\JoinTable(name: 'roles_users')]
    private Collection $roles;

    #[ORM\ManyToMany(targetEntity: Flight::class, inversedBy:"users")]
    #[ORM\JoinTable(name:"users_flights")]
    private Collection $flights;
    
    #[ORM\ManyToMany(targetEntity: Organization::class, inversedBy: 'users')]
    #[ORM\JoinTable(name: 'organizations_users')]
    private Collection $organizations;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $createdDate;

    public function __construct()
    {
        $this->roles = new ArrayCollection();
        $this->flights = new ArrayCollection();
        $this->organizations = new ArrayCollection();
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }

    public function getRoles(): array
    {
        return ['ROLE_USER'];
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
}