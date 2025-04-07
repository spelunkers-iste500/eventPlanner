<?php

namespace App\Security\Voter;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

final class OrganizationInviteVoter extends Voter
{
    public const EDIT = 'edit';
    public const VIEW = 'view';

    protected function supports(string $attribute, mixed $subject): bool
    {
        // replace with your own logic
        // https://symfony.com/doc/current/security/voters.html
        return in_array($attribute, [self::EDIT, self::VIEW])
            && $subject instanceof \App\Entity\OrganizationInvite;
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
    public static function canEdit(UserInterface $user, \App\Entity\OrganizationInvite $subject): bool
    {
        // conditions for editing:
        // - the user must be an event admin of the event
        // - the user must be an org admin
        // - the user must be a platform admin

        return (
            $subject->getOrganization()->getAdmins()->contains($user) ||
            in_array("ROLE_ADMIN", $user->getRoles())
        );
    }
    public static function canView(UserInterface $user, \App\Entity\OrganizationInvite $subject): bool
    {
        // conditions for viewing:
        // - the user must be a part of the event
        // - the user must be part of the event admins
        // - the user must be part of the org admins
        // - the user must be a platform admin
        return (
            $subject->getOrganization()->getAdmins()->contains($user) ||
            in_array('ROLE_ADMIN', $user->getRoles())
        );
    }
}
