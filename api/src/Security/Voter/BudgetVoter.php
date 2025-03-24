<?php

namespace App\Security\Voter;

use App\Entity\Budget;
use App\Entity\UserEvent;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

final class BudgetVoter extends Voter
{
    public const EDIT = 'edit';
    public const VIEW = 'view';

    protected function supports(string $attribute, mixed $subject): bool
    {
        // replace with your own logic
        // https://symfony.com/doc/current/security/voters.html
        return in_array($attribute, [self::EDIT, self::VIEW])
            && $subject instanceof \App\Entity\Budget;
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
    private static function canEdit(UserInterface $user, Budget $subject): bool
    {
        // conditions for editing:
        // - the user must be a finance admin of the org
        // - the user must be a finance admin of the event
        // - the user must be a finance admin of the budget
        // - the user must be a platform admin
        return (
            // subject has a method to return all finance admins
            $subject->getOrganization()->getFinanceAdmins()->contains($user)||
            $subject->getOrganization()->getAdmins()->contains($user)||
            in_array('ROLE_ADMIN', $user->getRoles())
        );
    }
    private static function canView(UserInterface $user, Budget $subject): bool
    {
        // conditions for viewing:
        // - the user must be a finance admin of the org
        // - the user must be a finance admin of the event
        // - the user must be a finance admin of the budget
        // - the user must be an event admin
        // - the user must be a platform admin

        $new_collection = $subject->getEvent()->getAttendees();
        $org_confirmation = False;
        foreach ($new_collection as $userEvent) {
            if ($userEvent->getUser() === $user) {
                $org_confirmation = True;
            }
        }


        return (
            $org_confirmation ||
            $subject->getOrganization()->getFinanceAdmins()->contains($user) ||
            $subject->getOrganization()->getAdmins()->contains($user)||
            $subject->getOrganization()->getEventAdmins()->contains($user) ||
            in_array('ROLE_ADMIN', $user->getRoles())
        );
    }
}
