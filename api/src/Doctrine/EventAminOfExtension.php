<?php

namespace App\Doctrine;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Event;
use App\Repository\UserRepository;
use Doctrine\ORM\QueryBuilder;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

final readonly class EventAminOfExtension implements QueryCollectionExtensionInterface
{
    public function __construct(private Security $security, private UserRepository $userRepo, private LoggerInterface $logger) {}

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void
    {
        // Ensure this extension only applies to the Event entity
        if ($resourceClass !== Event::class) {
            return;
        }

        if ($operation && $operation->getName() !== '_api_/events{._format}_get_collection') {
            // Only apply this extension to the specific collection operation
            return;
        }

        $user = $this->security->getUser();

        if ($user === null || !$user instanceof UserInterface) {
            // No access for unauthenticated users
            $queryBuilder->andWhere('1 = 0');
            return;
        }

        // Allow superadmins full access
        if ($this->security->isGranted('ROLE_ADMIN')) {
            return;
        }

        // Get organization ID from URI variables
        $orgId = $context['uriVariables']['orgId'] ?? null;
        if (!$orgId) {
            $queryBuilder->andWhere('1 = 0');
            return;
        }

        // Get organizations where the user is an Org or Event Admin
        $adminOrgs = $this->userRepo->getAdminOrgs($user);
        $eventOrgs = $this->userRepo->getEventAdminOrgs($user);

        // Merge both roles to check if user is allowed
        $allowedOrgs = array_unique(array_merge($adminOrgs, $eventOrgs));

        if (!in_array($orgId, $allowedOrgs)) {
            throw new AccessDeniedHttpException('User is not an admin of this organization');
        }

        // Apply filtering for the requested orgId
        $queryBuilder
            ->andWhere('e.organization = :orgId')
            ->setParameter('orgId', $orgId);
    }
}
