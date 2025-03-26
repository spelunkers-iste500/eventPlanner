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
use App\Entity\Organization;
use Symfony\Component\Security\Core\User\UserInterface;

final readonly class MyOrganizationsExtension implements QueryCollectionExtensionInterface
{
    public function __construct(private Security $security, private UserRepository $userRepo, private LoggerInterface $logger) {}

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void
    {
        // Ensure this extension only applies to the Organization entity
        $user = $this->security->getUser();
        if ($resourceClass !== Organization::class) {
            return;
        } else if ($operation && $operation->getName() !== '_api_/my/organizations/.{_format}_get_collection') {
            return;
        } else if ($user === null || !$user instanceof UserInterface) {
            // No access for unauthenticated users
            $queryBuilder->andWhere('1 = 0');
            return;
        } else if ($this->security->isGranted('ROLE_ADMIN')) {
            return;
        }
        $queryBuilder
            ->andwhere(':user MEMBER OF o.financeAdmins')
            ->orWhere(':user MEMBER OF o.admins')
            ->orWhere(':user MEMBER OF o.eventadmins')
            ->setParameter('user', $user);
    }
}
