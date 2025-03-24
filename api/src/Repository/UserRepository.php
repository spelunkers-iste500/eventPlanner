<?php
// api/src/Repository/UserRepository.php

namespace App\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\User;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

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

    public function getUsersCurrentEventsByUserId(string $id): array
    {
        if (!Uuid::isValid($id)) {
            return [];
        } else {
            $qb = $this->createQueryBuilder('u')
                ->join('u.eventsAttending', 'ue')
                ->join('ue.event', 'e')
                ->where('u.id = :id')
                ->andWhere('e.endDateTime >= :currentDate')
                ->setParameter('id', $id)
                ->setParameter('currentDate', new \DateTime())
                ->getQuery();

            return $qb->getResult();
        }
    }

    public function doesUserHaveCurrentEvents(string $id): bool
    {
        // if the string has an @ symbol, it's an email otherwise UUID
        // check if uuid is valid
        $qb = $this->createQueryBuilder('u')
            ->join('u.eventsAttending', 'ue')
            ->join('ue.event', 'e')
            ->where((Uuid::isValid($id)) ? 'u.id = :id' : 'u.email = :email')
            ->andWhere('e.endDateTime >= :currentDate')
            ->setParameter((($id)) ? 'id' : 'email', $id)
            ->setParameter('currentDate', new \DateTime())
            ->getQuery();

        return !empty($qb->getResult());
    }
    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', \get_class($user)));
        }

        $user->setPassword($newHashedPassword);

        $this->save($user, true);
    }
    public function getAdminOrgs(User $user): array
    {
        return $user->getAdminOfOrg()->toArray();
    }
    public function getUserByEmail(string $email): ?User
    {
        return $this->findOneBy(['email' => $email]);
    }
    public function getFinancialAdminOrgs(User $user): array
    {
        return $user->getFinanceAdminOfOrg()->toArray();
    }
}
