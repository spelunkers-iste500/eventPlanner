<?php

namespace App\Security\Voter;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

final class UserVoter extends Voter
{

    protected function supports(string $attribute, mixed $subject): bool
    {
        // replace with your own logic
        // https://symfony.com/doc/current/security/voters.html
        return in_array($attribute, [self::EDIT, self::VIEW])
            && $subject instanceof \App\Entity\User;
    }

    const EDIT = 'edit';
    const VIEW = 'view';

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $currentUser = $token->getUser();
        // if the user is anonymous, do not grant access
        if (!$currentUser instanceof UserInterface) {
            return false;
        }

        return match ($attribute) {
            self::EDIT => self::canEdit(currentUser: $currentUser, targetUser: $subject),
            self::VIEW => self::canView(currentUser: $currentUser, targetUser: $subject),
            default => false,
        };
    }

    public static function canEdit($currentUser, $targetUser)
    {
        // user can edit their own profile
        if ($currentUser->getId() === $targetUser->getId()) {
            return true;
        }
        return false;
    }
    public static function canView($currentUser, $targetUser)
    {
        // user can view their own profile
        if ($currentUser->getId() === $targetUser->getId()) {
            return true;
        }
        return false;
    }
}
