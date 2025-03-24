<?php

namespace App\Doctrine;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\QueryBuilder;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\Security\Core\User\UserInterface;

final readonly class FinancialAdminOfExtension implements QueryCollectionExtensionInterface
{
    public function __construct(private Security $security, private UserRepository $uRepo, private LoggerInterface $logger) {}

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void
{
    if ($resourceClass !== \App\Entity\Budget::class) {
        return;
    }
    
    if ($operation) {
        $this->logger->info('Operation Name: ' . $operation->getName());
    }

    if ($this->security->isGranted('ROLE_ADMIN')) {
        return; // Allow super admins
    }

    $user = $this->security->getUser();
    if (!$user instanceof UserInterface) {
        $queryBuilder->andWhere('1 = 0'); // No access for unauthenticated users
        return;
    }

    $fullUserObject = $this->uRepo->getUserByEmail($user->getUserIdentifier());
    $orgs = $fullUserObject->getFinanceAdminOfOrg()?->toArray() ?? [];

    if (empty($orgs)) {
        $queryBuilder->andWhere('1 = 0'); // Restrict access if not a financial admin
        return;
    }

    if (isset($context['uriVariables']['orgId'])) {
        $orgId = $context['uriVariables']['orgId'];
        if (!in_array($orgId, $orgs)) {
            return;
        }
        $queryBuilder->andWhere('o.id = :orgId')->setParameter('orgId', $orgId);
    }
}

}