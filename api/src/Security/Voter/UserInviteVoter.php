<?php

namespace App\Security\Voter;

use App\Entity\Event;
use App\Repository\EventRepository;
use Ramsey\Uuid\Lazy\LazyUuidFromString;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

final class UserInviteVoter extends Voter
{
    public function __construct(private EventRepository $eventRepo) {}

    public const INVITE = 'invite';

    protected function supports(string $attribute, mixed $subject): bool
    {
        // replace with your own logic
        // https://symfony.com/doc/current/security/voters.html
        return in_array($attribute, [self::INVITE])
            && $subject instanceof \App\Entity\UserInvite;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        // if the user is anonymous, do not grant access
        if (!$user instanceof UserInterface) {
            return false;
        }

        // ... (check conditions and return true to grant permission) ...
        switch ($attribute) {
            case self::INVITE:
                if (
                    $this->eventRepo->getEventById($subject->getEvent()->getId()->toString())->getOrganization()->getEventAdmins()->contains($user) ||
                    in_array('ROLE_ADMIN', $user->getRoles())
                ) {
                    return true;
                }
        }
        return false;
    }
}
