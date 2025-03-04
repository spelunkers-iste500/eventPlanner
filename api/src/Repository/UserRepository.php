<?php
// api/src/Repository/UserRepository.php

namespace App\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\User;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function save(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function getUserById(int $id): ?User
    {
        return $this->find($id);
    }

    public function getUsersCurrentEventsByUserId(int $id): array
    {
        $qb = $this->createQueryBuilder('u')
            ->join('u.events', 'e')
            ->where('u.id = :id')
            ->andWhere('e.startDateTime <= :currentDate')
            ->andWhere('e.endDateTime >= :currentDate')
            ->setParameter('id', $id)
            ->setParameter('currentDate', new \DateTime())
            ->getQuery();

        return $qb->getResult();
    }

    public function doesUserHaveCurrentEvents(int $id): bool
    {
        $qb = $this->createQueryBuilder('u')
            ->join('u.events', 'e')
            ->where('u.id = :id')
            // ->andWhere('e.startDateTime <= :currentDate')
            ->andWhere('e.endDateTime >= :currentDate')
            ->setParameter('id', $id)
            ->setParameter('currentDate', new \DateTime())
            ->getQuery();

        return !empty($qb->getResult());
    }
}
