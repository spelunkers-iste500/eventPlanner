<?php

namespace App\Doctrine;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Repository\UserRepository;
use Doctrine\ORM\QueryBuilder;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\Security\Core\User\UserInterface;

final readonly class OrgAdminOfExtension implements QueryCollectionExtensionInterface
{
    public function __construct(private Security $security, private UserRepository $uRepo, private LoggerInterface $logger) {}

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void
    {
        // return only the users that are part of the organizations the uesr is an admin of
        return;
        if ($this->security->isGranted('ROLE_ADMIN')) { // allow superadmin
            return;
        }
        $user = $this->security->getUser();
        if ($user === null) {
            // throw new HttpExceptionInterface('User is not authenticated');
        }
        // add where restriction to the query builder to filter users by the organizations the current user is an admin of
        if ($user instanceof UserInterface) {
            $orgs = $this->uRepo->getAdminOrgs($user);
            // if the uriVariables has an orgId, return that organiuzations members
            // only if that user is an admin or event admin of that organization
            if (isset($context['uriVariables']['orgId']) && (count($orgs) > 0)) {
                $orgId = $context['uriVariables']['orgId'];
                if (!in_array($orgId, $orgs)) {
                    throw new HttpExceptionInterface('User is not an admin of this organization');
                }
                $queryBuilder
                    ->andWhere('o.id = :orgId')
                    ->setParameter('orgId', $orgId);
            } else {
                // $queryBuilder->andWhere('1 = 0'); problematic
            }
        }
        // if the user is not an admin of any organization, return an empty result set
        else {
            // $queryBuilder->andWhere('1 = 0'); // problematic
        }
    }
}
