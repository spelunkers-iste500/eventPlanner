<?php

namespace App\Entity;

use ApiPlatform\Metadata as API;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\Link;
use App\State\UserInviteState;
use Symfony\Component\Serializer\Attribute\Groups;

#[API\ApiResource]
#[API\Post(
    processor: UserInviteState::class,
    securityPostDenormalize: "is_granted('invite', object)",
    normalizationContext: ['groups' => ['read:userInvite']],
    denormalizationContext: ['groups' => ['write:userInvite']],
    uriTemplate: '/events/{eventId}/invite',
    uriVariables: [
        'eventId' => new Link(
            fromClass: Event::class,
            fromProperty: 'id',
            toProperty: 'event',
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
        $this->event = new Event();
        $this->emails = [];
    }
    // the event the user is being invited to
    // #[Groups(['write:userInvite'])]
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
