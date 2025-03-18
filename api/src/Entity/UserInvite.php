<?php

namespace App\Entity;

use ApiPlatform\Metadata as API;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\Link;
use App\State\UserInviteState;
use Symfony\Component\Serializer\Attribute\Groups;

#[API\ApiResource]
#[API\Get(
    uriTemplate: '/organizations/{organizationId}/invite',
    uriVariables: [
        'organizationId' => new Link(
            fromClass: Organization::class,
            fromProperty: 'id',
            toProperty: 'organization',
        ),
    ],
    provider: UserInviteState::class,
    normalizationContext: ['groups' => ['read:userInvite']],
)]
#[API\Post(
    processor: UserInviteState::class,
    securityPostDenormalize: "is_granted('invite', object)",
    normalizationContext: ['groups' => ['read:userInvite']],
    denormalizationContext: ['groups' => ['write:userInvite']],
    uriTemplate: '/organizations/{organizationId}/invite',
    uriVariables: [
        'organizationId' => new Link(
            fromClass: Organization::class,
            fromProperty: 'id',
            toProperty: 'organization',
        ),
    ]
)]
class UserInvite
{
    // #[ApiProperty(identifier: true)]
    // public function getId()
    // {
    //     return 1;
    // }
    public function __construct()
    {
        $this->organization = new Organization();
        $this->emails = [];
    }
    // the organization the user is being invited to
    #[Groups(['write:userInvite'])]
    private Organization $organization;
    public function setOrganization(Organization $organization): void
    {
        $this->organization = $organization;
    }
    public function getOrganization(): Organization
    {
        return $this->organization;
    }

    #[Groups(['read:userInvite'])]
    public function getOrganizationInviteCode(): string
    {
        return $this->organization->getInviteCode();
    }

    #[Groups(['read:userInvite'])]
    // the list of emails of the users being invited
    public array $emails;
}
