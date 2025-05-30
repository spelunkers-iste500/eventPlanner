<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Repository\OrganizationInviteRepository;
use App\State\OrganizationInviteState;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: OrganizationInviteRepository::class)]
#[ApiResource]

#[Post(
    description: 'The /organizationInvite.{_format} is used by the organization admin or super admin to invite a user to the organization. This POST request returns the organization, expected email, and invite type. Requires the "edit" permission, which is granted to organization admins or users with the ROLE_ADMIN role.',
    securityPostDenormalize: "is_granted('edit', object)",
    // security: "is_granted('edit', object)",
    uriTemplate: '/organizationInvite.{_format}',
    denormalizationContext: ['groups' => ['invite:organization']],
    processor: OrganizationInviteState::class
    //processor:  LoggerStateProcessor::class
)]

#[Get(
    description: 'The /organizationInvite/{id}.{_format} is used by the organization admin or super admin to retrieve an organization invite. This GET request returns the organization, expected email, and invite type. Requires the "view" permission, which is granted to organization admins or users with the ROLE_ADMIN role.',
)]

#[GetCollection(
    description: 'Retrieve flight offer requests. Returns the details of each requested flight offer.'
)]

class OrganizationInvite
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid')]
    private ?UuidInterface $id = null;

    #[ORM\ManyToOne(inversedBy: 'organizationInvites')]
    private ?User $invitedUser = null;

    #[ORM\ManyToOne(inversedBy: 'organizationInvites')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['invite:organization'])]
    private ?Organization $organization = null;

    #[ORM\Column]
    private bool $accepted = false;

    #[ORM\Column(length: 255)]
    #[Groups(['invite:organization'])]
    private ?string $expectedEmail = null;

    #[ORM\Column(length: 255)]
    #[Assert\Choice(choices: ['admin', 'eventAdmin', 'financeAdmin'])]
    #[Groups(['invite:organization'])]
    private ?string $inviteType = null;

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

    public function getExpectedEmail(): ?string
    {
        return $this->expectedEmail;
    }

    public function setExpectedEmail(string $expectedEmail): static
    {
        $this->expectedEmail = $expectedEmail;

        return $this;
    }

    public function getInviteType(): ?string
    {
        return $this->inviteType;
    }

    public function setInviteType(string $inviteType): static
    {
        $this->inviteType = $inviteType;

        return $this;
    }
}
