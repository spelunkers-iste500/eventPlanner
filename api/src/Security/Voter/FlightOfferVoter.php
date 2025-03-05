<?php

namespace App\Security\Voter;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;
use App\Entity\FlightOffer;
use App\Repository\UserRepository;
use \DateTime;
use Symfony\Bundle\SecurityBundle\Security;

final class FlightOfferVoter extends Voter
{

    public function __construct(private Security $security, private UserRepository $userRepository) {}

    public const EDIT = 'book';
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
        // check if user has current events
        return self::$userRepository->doesUserHaveCurrentEvents($user->getUserIdentifier());
        // @TODO: check if booked flight is owned by the user
    }

    private static function canView(UserInterface $user, FlightOffer $flightOffer): bool
    {
        // check if user has current events
        return self::$userRepository->doesUserHaveCurrentEvents($user->getUserIdentifier());
    }
}
