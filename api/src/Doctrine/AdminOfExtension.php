<?php

namespace App\Doctrine;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Event;
use App\Repository\OrganizationRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\QueryBuilder;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

final readonly class AdminOfExtension implements QueryCollectionExtensionInterface
{
    public function __construct(private Security $security, private UserRepository $userRepo, private LoggerInterface $logger, private OrganizationRepository $orgRepo) {}

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void
    {
        // Ensure this extension only applies to the Event entity
        if ($resourceClass !== Event::class) {
            return;
        }

        $user = $this->security->getUser();

        // if ($user === null || !$user instanceof UserInterface) {
        //     // No access for unauthenticated users
        //     $queryBuilder->andWhere('1 = 0');
        //     return;
        // }

        // Allow superadmins full access
        if ($this->security->isGranted('ROLE_ADMIN')) {
            return;
        }
        // /my/organizations/events/admins.{_format}_get_collection
        // Get organization ID from URI variables
        $orgId = $context['uri_variables']['orgId'] ?? null;
        // hydrated user object
        $fullOrgObject = $this->orgRepo->findOneBy(['id' => $orgId]); // one query
        $fullUserObject = $this->userRepo->getUserByEmail($user->getUserIdentifier());
        $orgs = $fullUserObject->getAdminOfOrg();
        switch ($operation->getName()) {
            case '_api_/my/organizations/events/financeAdmin.{_format}_get_collection':
                $queryBuilder
                    ->join('o.organization', 'org')
                    ->andWhere(':user MEMBER OF org.financeAdmins')
                    ->setParameter('user', $fullUserObject);
                break;

            case '_api_/my/organizations/events/eventAdmin.{_format}_get_collection':
                $queryBuilder
                    ->join('o.organization', 'org')
                    ->andWhere(':user MEMBER OF org.eventadmins')
                    ->setParameter('user', $fullUserObject);
                $this->logger->info('Query: ' . $queryBuilder->getQuery()->getSQL());
                break;

            case '_api_/my/organizations/events/fullAdmin.{_format}_get_collection':
                $queryBuilder
                    ->join('o.organization', 'org')
                    ->andWhere(':user MEMBER OF org.admins')
                    ->setParameter('user', $fullUserObject);
                break;
                break;
            default:
                break;
        }
    }
}
