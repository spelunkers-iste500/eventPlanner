<?php

namespace App\Security\Voter;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

final class UserEventVoter extends Voter
{
    public const EDIT = 'edit';
    public const USEREDIT = 'userEdit';

    protected function supports(string $attribute, mixed $subject): bool
    {
        // replace with your own logic
        // https://symfony.com/doc/current/security/voters.html
        return in_array($attribute, [self::EDIT])
            && $subject instanceof \App\Entity\UserEvent;
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
            case self::USEREDIT:
                // check to see if the user is on the UserEvent object, and it's the correct route
                if ($subject->getUser() === $token->getUser()) {
                    return true;
                }
            case self::EDIT:
                // is the user a full admin?
                if ($token->getUser()->getRoles() === 'ROLE_ADMIN') {
                    return true;
                }
                // is the user an event or org admin?
                // get the event from the UserEvent object
                $event = $subject->getEvent();
                // get the organization from the event
                $org = $event->getOrganization();
                // get the user from the UserEvent object
                $user = $subject->getUser();
                // check if the user is in either group from the org
                if ($org->getEventAdmins()->contains($user)) {
                    return true;
                }
                break;
        }

        return false;
    }
}
