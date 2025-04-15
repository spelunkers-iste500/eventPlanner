<?php

namespace App\Entity;

use ApiPlatform\Metadata as API;
use ApiPlatform\Metadata\Link;
use App\State\UserInviteState;
use Symfony\Component\Serializer\Attribute\Groups;

#[API\ApiResource]
#[API\Post(
    description: 'Invite users to an event. This POST request requires the "invite" permission, which is granted to event admins of the organization associated with the event or users with the ROLE_ADMIN role. Returns the details of the created user invitation.',
    processor: UserInviteState::class,
    securityPostDenormalize: "is_granted('invite', object)",
    normalizationContext: ['groups' => ['read:userInvite']],
    denormalizationContext: ['groups' => ['write:userInvite']],
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
        $this->emails = [];
    }
    // the event the user is being invited to
    #[Groups(['write:userInvite'])]
    private Event $event;
    public function setEvent(Event $event): void
    {
        $this->event = $event;
    }
    public function getEvent(): Event
    {
        return $this->event;
    }

    #[Groups(['read:userInvite'])]
    public function getEventInviteCode(): string
    {
        if ($this->event === null) {
            return 'abc';
        } else {
            return $this->event->getInviteCode();
        }
        // return $this->event->getInviteCode();
    }

    #[Groups(['read:userInvite', 'write:userInvite'])]
    // the list of emails of the users being invited
    public array $emails;

    public function getEmails(): array
    {
        return $this->emails;
    }
    public function setEmails($emails): void
    {
        $this->emails = $emails;
    }
}
