<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class Organization
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'orgID', type: 'integer')]
    private ?int $orgID = null;

    #[ORM\Column(length: 55)]
    private string $name;

    #[ORM\Column(length: 255)]
    private string $description;

    #[ORM\Column(length: 255)]
    private string $address;

    #[ORM\Column(length: 55)]
    private string $primaryEmail;

    #[ORM\Column(length: 55)]
    private string $secondaryEmail;

    #[ORM\Column(length: 55)]
    private string $industry;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $createdDate;

    // Getters and Setters

    public function getOrgID(): ?int
    {
        return $this->orgID;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getAddress(): string
    {
        return $this->address;
    }

    public function setAddress(string $address): self
    {
        $this->address = $address;
        return $this;
    }

    public function getPrimaryEmail(): string
    {
        return $this->primaryEmail;
    }

    public function setPrimaryEmail(string $primaryEmail): self
    {
        $this->primaryEmail = $primaryEmail;
        return $this;
    }

    public function getSecondaryEmail(): string
    {
        return $this->secondaryEmail;
    }

    public function setSecondaryEmail(string $secondaryEmail): self
    {
        $this->secondaryEmail = $secondaryEmail;
        return $this;
    }

    public function getIndustry(): string
    {
        return $this->industry;
    }

    public function setIndustry(string $industry): self
    {
        $this->industry = $industry;
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
}
