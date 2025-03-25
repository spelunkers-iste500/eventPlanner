<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\OrganizationInviteRepository;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;

#[ORM\Entity(repositoryClass: OrganizationInviteRepository::class)]
#[ApiResource]
class OrganizationInvite
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid')]
    private ?UuidInterface $id = null;

    #[ORM\ManyToOne(inversedBy: 'organizationInvites')]
    private ?User $invitedUser = null;

    #[ORM\ManyToOne(inversedBy: 'organizationInvites')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Organization $organization = null;

    #[ORM\Column]
    private bool $accepted = false;

    public function getId(): ?UuidInterface
    {
        return $this->id;
    }

    /**
     * @param UuidInterface $id 
     * - Allow to set the id for when it's retrieved from the database
     * @return static
     */
    public function setId(UuidInterface $id): static
    {
        $this->id = $id;
        return $this;
    }

    public function getInvitedUser(): ?User
    {
        return $this->invitedUser;
    }

    public function setInvitedUser(?User $invitedUser): static
    {
        $this->invitedUser = $invitedUser;

        return $this;
    }

    public function getOrganization(): ?Organization
    {
        return $this->organization;
    }

    public function setOrganization(?Organization $organization): static
    {
        $this->organization = $organization;

        return $this;
    }
    public function getAccepted(): bool
    {
        return $this->accepted;
    }
    public function setAccepted(bool $accepted): static
    {
        $this->accepted = $accepted;

        return $this;
    }
    public function __construct()
    {
        // set uuid on creation
        $this->id = Uuid::uuid4();
    }
}
