<?php

namespace App\Security\Voter;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;
use App\Entity\FlightOffer;
use \DateTime;

final class FlightOfferVoter extends Voter
{
    public const EDIT = 'edit';
    public const VIEW = 'view';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::EDIT, self::VIEW])
            && $subject instanceof FlightOffer;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        
        // If the user is not authenticated, deny access
        if (!$user instanceof UserInterface) {
            return false;
        }

        return match ($attribute) {
            self::EDIT => self::canEdit($user, $subject),
            self::VIEW => self::canView($user, $subject),
            default => false,
        };
    }

    private static function canEdit(UserInterface $user, FlightOffer $flightOffer): bool
    {
        $userEvents = $user->getEvents();
        $currentDate = new DateTime();

        // Check if the user is in an event that is currently active (within start and end date)
        foreach ($userEvents as $event) {
            if ($event->getStartDateTime() <= $currentDate && $event->getEndDateTime() >= $currentDate) {
                return true;
            }
        }

        return false;
    }

    private static function canView(UserInterface $user, FlightOffer $flightOffer): bool
    {
        $userEvents = $user->getEvents();
        $currentDate = new DateTime();

        // Check if the user is part of an event to view the offer (active event)
        foreach ($userEvents as $event) {
            if ($event->getStartDateTime() <= $currentDate && $event->getEndDateTime() >= $currentDate) {
                return true;
            }
        }

        return false;
    }
}
