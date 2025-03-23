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
        // return only the users that are part of the organizations the user is a financial admin of
        if ($this->security->isGranted('ROLE_ADMIN')) { // allow superadmin
            return;
        }
        $user = $this->security->getUser();
        if ($user === null) {
            // throw new HttpExceptionInterface('User is not authenticated');
        }
        // add where restriction to the query builder to filter users by the organizations the current user is a financial admin of
        if ($user instanceof UserInterface) {
            $orgs = $this->uRepo->getFinancialAdminOrgs($user);
            // if the uriVariables has an orgId, return that organization's members
            // only if that user is a financial admin of that organization
            if (isset($context['uriVariables']['orgId']) && (count($orgs) > 0)) {
                $orgId = $context['uriVariables']['orgId'];
                if (!in_array($orgId, $orgs)) {
                    throw new HttpExceptionInterface('User is not a financial admin of this organization');
                }
                $queryBuilder
                    ->andWhere('o.id = :orgId')
                    ->setParameter('orgId', $orgId);
            } else {
                // $queryBuilder->andWhere('1 = 0'); problematic
            }
        }
        // if the user is not a financial admin of any organization, return an empty result set
        else {
            $queryBuilder->andWhere('1 = 0'); // no results
        }
    }
}
