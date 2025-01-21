<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ApiResource]
class Role
{
    /** The unique identifier of this permission. */
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'roleID', type: 'integer')]
    private ?int $roleID = null;

    /** The name of this permission. */
    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\NotBlank]
    private ?string $name = null;

    /** A description for this permission (optional). */
    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    /** The date this permission was last modified. */
    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $lastModified = null;

    /** The date this permission was last modified. */
    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $creationDate = null;

    //Relationship

    #[ORM\OneToMany(mappedBy: 'role', targetEntity: RolePermission::class, cascade: ['persist', 'remove'])]
    private Collection $rolePermissions;

    public function __construct()
    {
        // Initialize any default values here if needed.
        $this->creationDate = new \DateTime(); // Example: Default to "now".
    }

    // Getter for the ID
    public function getId(): ?int
    {
        return $this->id;
    }

    // Getter and Setter for Name
    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    // Getter and Setter for Description
    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    // Getter and Setter for LastModified
    public function getLastModified(): ?\DateTimeInterface
    {
        return $this->lastModified;
    }

    public function setLastModified(?\DateTimeInterface $lastModified): self
    {
        $this->lastModified = $lastModified;

        return $this;
    }

    public function getCreationDate(): ?\DateTimeInterface
    {
        return $this->creationDate;
    }

    public function setCreationDate(?\DateTimeInterface $creationDate): self
    {
        $this->creationDate = $creationDate;

        return $this;
    }
}
