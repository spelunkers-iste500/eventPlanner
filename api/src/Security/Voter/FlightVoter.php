<?php

namespace App\Security\Voter;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

final class FlightVoter extends Voter
{
    public const VIEW = 'view';
    public const EDIT = 'edit';

    protected function supports(string $attribute, mixed $subject): bool
    {
        // replace with your own logic
        // https://symfony.com/doc/current/security/voters.html
        return in_array($attribute, [self::VIEW, self::EDIT])
            && $subject instanceof \App\Entity\Flight;
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
            case self::VIEW:
                if ($subject->getUserEvent()->getUser() === $user || $subject->getUserEvent()->getEvent()->getOrganization()->getEventAdmins()->contains($user) || $subject->getUserEvent()->getEvent()->getOrganization()->getAdmins()->contains($user)) {
                    return true;
                }
                break;
            case self::EDIT:
                if ($subject->getUserEvent()->getEvent()->getOrganization()->getEventAdmins()->contains($user) || $subject->getUserEvent()->getEvent()->getOrganization()->getAdmins()->contains($user)) {
                    return true;
                }
                break;
        }

        return false;
    }
}
