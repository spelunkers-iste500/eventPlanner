<?php

namespace App\Doctrine;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\Event;
use Symfony\Bundle\SecurityBundle\Security;
use App\Repository\UserRepository;
use Psr\Log\LoggerInterface;
use Doctrine\ORM\QueryBuilder;
use ApiPlatform\Metadata\Operation;
use App\Entity\UserEvent;
use Symfony\Component\Security\Core\User\UserInterface;

final readonly class MyUserEventsExtension implements QueryCollectionExtensionInterface
{
    public function __construct(private Security $security, private UserRepository $userRepo, private LoggerInterface $logger) {}

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void
    {
        // Ensure this extension only applies to the Event entity
        if ($resourceClass !== UserEvent::class) {
            return;
        }
        $user = $this->security->getUser();
        // check to see if route is the correct one to apply this extension to
        // if ($operation && $operation-> !== '/organizations/{orgId}/events/.{_format}') {
        //     return;
        // }
        if ($operation && $operation->getName() !== '_api_/my/events.{_format}_get_collection') {
            return;
        } else if ($user === null || !$user instanceof UserInterface) {
            // No access for unauthenticated users
            $queryBuilder->where('1 = 0');
            return;
        } else if ($this->security->isGranted('ROLE_ADMIN')) {
            return;
        } else {
            $queryBuilder->andWhere(':user = o.user')->setParameter('user', $user);
            $this->logger->info('Query: ' . $queryBuilder->getQuery()->getSQL());
        }
    }
}
