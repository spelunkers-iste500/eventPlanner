<?php

namespace App\Story;

ini_set('memory_limit', '6G');

use Zenstruck\Foundry\Story;
use App\Entity\Organization;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\DependencyInjection\Security\UserProvider\UserProviderFactoryInterface;
use Zenstruck\Foundry\Maker\MakeFactory;
use App\Factory\UserFactory;
use App\Factory\OrganizationFactory;
use App\Factory\EventFactory;
use App\Factory\BudgetFactory;
use App\Factory\UserEventFactory;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class ConcurrentUserTestingStory extends Story
{
    private EntityManagerInterface $entityManager;
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher)
    {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }
    public function createUser(string $firstname, string $lastname, string $email, string $plainPassword, bool $superAdmin, Organization $org, string $otp, string $orgRole): User
    {
        $user = UserFactory::createOne([
            'firstname' => $firstname,
            'lastname' => $lastname,
            'email' => $email,
            'superAdmin' => $superAdmin,
            'otpSecret' => $otp,
            //'OrgMembership' => new ArrayCollection([$org]) // Add organization to orgmemberships
        ]);
        if ($orgRole === 'financial') {
            $user->addFinanceAdminOfOrg($org);
            $user->_save();
        } elseif ($orgRole === 'orgAdmin') {
            $user->addAdminOfOrg($org);
            $user->_save();
        } elseif ($orgRole === 'eventAdmin') {
            $user->addEventAdminOfOrg($org);
            $user->_save();
        }

        $hashedPassword = $this->passwordHasher->hashPassword($user, $plainPassword);
        $user->setPassword($hashedPassword);

        $user->_save();
        return $user;
    }

    public function build(): void
    {
        $otpcode = "G5AGCNDNEMSWM326LZJDGSDGLZSEA6RQMFBEQWCIO47TOQDYIRKQ";
        $organization = OrganizationFactory::new()->createOne(['name' => 'Spelunkers']);

        for ($i = 10001; $i <= 20000; $i++) {
            $email = sprintf('testuser%06d@test.com', $i); // Generate email like testuser000001@test.com
            $this->createUser(
                firstname: 'Test',
                lastname: 'User' . $i,
                email: $email,
                plainPassword: 'spelunkers123',
                superAdmin: false,
                org: $organization,
                otp: $otpcode,
                orgRole: 'user' // Assign a role, e.g., 'eventAdmin'
            );

            // Flush and clear the Entity Manager every 10 users
            if ($i % 10 === 0) {
                $this->entityManager->flush();
                $this->entityManager->clear();
                
                sleep(1); // Optional: Sleep for 1 second to avoid overwhelming the database
            }
        }

        // Final flush to persist any remaining users
        $this->entityManager->flush();
        $this->entityManager->clear();
    }
}
