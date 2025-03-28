<?php

namespace App\Doctrine;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Event;
use App\Entity\Flight;
use App\Entity\UserEvent;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\User\UserInterface;

final readonly class CustomExtension implements QueryCollectionExtensionInterface
{
    public function __construct(private Security $security) {}
    /**
     * Filter the query builder for the current user. User must be associated via the user field.
     * @param QueryBuilder $queryBuilder the query builder for the extension
     * @param UserInterface $user the user
     * @param Operation|null $operation the operation for the extension
     * @return void
     */
    public static function filterOnCurrentUser(QueryBuilder $queryBuilder, UserInterface $user): void
    {
        $queryBuilder->andWhere(':user = o.user')->setParameter('user', $user);
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void
    {

        $user = $this->security->getUser();

        // Don't filter for platform admins
        if ($this->security->isGranted('ROLE_ADMIN')) {
            return;
        }

        switch ($resourceClass) {
            case Event::class:
                self::eventFilter($queryBuilder, $user, $operation);
                return;
            case UserEvent::class:
                self::userEventFilter($queryBuilder, $user, $operation);
                return;
            case Flight::class:
                self::flightFilter($queryBuilder, $user, $operation);
                return;
        }
    }
    public static function eventFilter(QueryBuilder $queryBuilder, UserInterface $user, ?Operation $operation = null): void
    {
        switch ($operation->getName()) {
            case '_api_/my/organizations/events/financeAdmin.{_format}_get_collection':
                $queryBuilder
                    ->join('o.organization', 'org')
                    ->andWhere(':user MEMBER OF org.financeAdmins')
                    ->setParameter('user', $user);
                return;

            case '_api_/my/organizations/events/eventAdmin.{_format}_get_collection':
                $queryBuilder
                    ->join('o.organization', 'org')
                    ->andWhere(':user MEMBER OF org.eventadmins')
                    ->setParameter('user', $user);
                return;

            case '_api_/my/organizations/events/fullAdmin.{_format}_get_collection':
                $queryBuilder
                    ->join('o.organization', 'org')
                    ->andWhere(':user MEMBER OF org.admins')
                    ->setParameter('user', $user);
                return;
            default:
                return;
        }
    }
    public static function userEventFilter(QueryBuilder $queryBuilder, UserInterface $user, ?Operation $operation = null): void
    {
        switch ($operation->getName()) {
            case '_api_/my/events.{_format}_get_collection':
                self::filterOnCurrentUser($queryBuilder, $user);
                return;
            default:
                return;
        }
    }
    public static function flightFilter(QueryBuilder $queryBuilder, UserInterface $user, ?Operation $operation = null): void
    {
        switch ($operation->getName()) {
            case '_api_/my/flights.{_format}_get_collection':
                self::filterOnCurrentUser($queryBuilder, $user);
                return;
            default:
                return;
        }
    }
}
