<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

/**
 * Represents a User entity.
 */
#[ORM\Entity]
#[ApiResource]
class User
{
    /**
     * The unique identifier for the user.
     */
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'userID', type: 'integer')]
    private ?int $userID = null;

    /**
     * The first name of the user.
     */
    #[ORM\Column(length: 55)]
    private string $firstName;

    /**
     * The last name of the user.
     */
    #[ORM\Column(length: 55)]
    private string $lastName;

    /**
     * The email address of the user.
     */
    #[ORM\Column(length: 55, unique: true)]
    private string $email;

    /**
     * The hashed password for the user.
     */
    #[ORM\Column(length: 255)]
    private string $password;

    /**
     * Indicates if the user is a VIP.
     */
    #[ORM\Column(type: 'boolean')]
    private bool $vip = false;

    /**
     * Indicates if the user's account is enabled.
     */
    #[ORM\Column(type: 'boolean')]
    private bool $accountEnabled = true;

    /**
     * The MFA token key (optional).
     */
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $mfaTokenKey = null;

    /**
     * The date the user was last modified.
     */
    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $lastModified;

    /**
     * The date the user was created.
     */
    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $createdDate;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }

    // Getters and Setters

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;
        return $this;
    }

    public function getLastName(): string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;
        return $this;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }

    public function isVip(): bool
    {
        return $this->vip;
    }

    public function setVip(bool $vip): self
    {
        $this->vip = $vip;
        return $this;
    }

    public function isAccountEnabled(): bool
    {
        return $this->accountEnabled;
    }

    public function setAccountEnabled(bool $accountEnabled): self
    {
        $this->accountEnabled = $accountEnabled;
        return $this;
    }

    public function getMfaTokenKey(): ?string
    {
        return $this->mfaTokenKey;
    }

    public function setMfaTokenKey(?string $mfaTokenKey): self
    {
        $this->mfaTokenKey = $mfaTokenKey;
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
}
