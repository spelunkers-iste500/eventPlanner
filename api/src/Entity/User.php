<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Lexik\Bundle\JWTAuthenticationBundle\Security\User\JWTUserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use App\Repository\UserRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ApiResource]
#[ORM\Table(name: 'users')]
class User implements JWTUserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(name: 'id', type: 'integer')]
    public int $id;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    public string $name;

    #[ORM\Column(length: 255, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Email]
    public string $email;

    #[ORM\Column(name: '"emailVerified"', type: 'datetime', nullable: true)]
    public \DateTimeInterface $emailVerified;

    #[ORM\Column(length: 255, nullable: true)]
    public string $image;

    #[ORM\OneToOne(targetEntity: Account::class)]
    #[ORM\JoinColumn(name: '"providerAccountId"', referencedColumnName: '"userId"', nullable: true)]
    public string $providerAccountID;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $createdDate;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
    public function getRoles(): array
    {
        return ['ROLE_USER'];
    }
    public static function createFromPayload($username, array $payload)
    {
        // return User object that corrosponds to the id:session_token pair
        $registry = new ManagerRegistry();
        $userRepo = new UserRepository($registry); // create new user repository to allow for finding user by id
        $user = $userRepo->findOneBy(['id' => $payload['id']]);
        return $user;
    }
    public function eraseCredentials() {}
    public function getUserIdentifier(): string
    {
        return $this->id;
    }
    public function getPassword(): string
    {   
        // todo: implement working password getter
        $registry = new ManagerRegistry();
        $userRepo = new UserRepository($registry); // create new user repository to allow for finding user by id
        $em = $userRepo->getEntityManager();
        $q = $em->createQuery('SELECT a.providerAccountId FROM App\Entity\Account a WHERE a.userId = :id');
        return $q->setParameter('id', $this->id)->getResult();
    }
}
