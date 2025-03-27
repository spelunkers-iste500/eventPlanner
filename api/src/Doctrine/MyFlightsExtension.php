<?php

namespace App\Doctrine;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use Symfony\Bundle\SecurityBundle\Security;
use App\Repository\UserRepository;
use Psr\Log\LoggerInterface;
use Doctrine\ORM\QueryBuilder;
use ApiPlatform\Metadata\Operation;
use App\Entity\Flight;

final readonly class MyFlightsExtension implements QueryCollectionExtensionInterface
{
    public function __construct(private Security $security, private UserRepository $userRepo, private LoggerInterface $logger) {}

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void
    {
        // Ensure this extension only applies to the Flight entity
        if ($resourceClass !== Flight::class) {
            return;
        }
        $user = $this->security->getUser();

        switch ($operation->getName()) {
            case '_api_/my/flights.{_format}_get_collection':
                $queryBuilder->andWhere(':user = o.user')->setParameter('user', $user);
                break;
            default:
                break;
        }
    }
}
