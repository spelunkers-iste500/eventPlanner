<?php

namespace App\Security\Voter;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

final class OrganizationVoter extends Voter
{
    public const EDIT = 'edit';
    public const VIEW = 'view';

    protected function supports(string $attribute, mixed $subject): bool
    {
        // replace with your own logic
        // https://symfony.com/doc/current/security/voters.html
        return in_array($attribute, [self::EDIT, self::VIEW])
            && $subject instanceof \App\Entity\Organization;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        // if the user is anonymous, do not grant access
        if (!$user instanceof UserInterface) {
            return false;
        }

        return match ($attribute) {
            self::EDIT => self::canEdit($user, $subject),
            self::VIEW => self::canView($user, $subject),
            default => false,
        };
    }

    private static function canEdit(UserInterface $user, \App\Entity\Organization $organization): bool
    {
        // check to see if the user is in the admins array
        // and checks to see if the user has ROLE_ADMIN
        $result = ($organization->getAdmins()->contains($user) || in_array($user->getRoles(), ['ROLE_ADMIN']));
        return $organization->getAdmins()->contains($user);
    }
    private static function canView(UserInterface $user, \App\Entity\Organization $organization): bool
    {
        return (
            $organization->getUsers()->contains($user) || // is the user a member
            $organization->getAdmins()->contains($user) || // indirect membership
            in_array($user->getRoles(), ['ROLE_ADMIN']) // is the user a full admin
        );
    }
}
