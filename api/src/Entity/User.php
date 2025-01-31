<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiProperty;
use Symfony\Component\Validator\Constraints as Assert;
use App\Repository\UserRepository;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

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

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
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

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $createdDate;

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
