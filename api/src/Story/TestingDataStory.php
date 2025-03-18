<?php

namespace App\Story;

use App\Entity\Organization;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\DependencyInjection\Security\UserProvider\UserProviderFactoryInterface;
use Zenstruck\Foundry\Maker\MakeFactory;
use Zenstruck\Foundry\Story;
use App\Factory\UserFactory;
use App\Factory\OrganizationFactory;
use App\Factory\EventFactory;
use App\Factory\BudgetFactory;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class TestingDataStory extends Story
{
    private EntityManagerInterface $entityManager;
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher)
    {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }

    public function createUser(string $firstname, string $lastname, string $email, string $plainPassword, bool $superAdmin, Organization $org): User
    {
        $user = UserFactory::createOne([
            'firstname' => $firstname,
            'lastname' => $lastname,
            'email' => $email,
            'superAdmin' => $superAdmin,
            //'OrgMembership' => new ArrayCollection([$org]) // Add organization to orgmemberships
        ]);

        $hashedPassword = $this->passwordHasher->hashPassword($user, $plainPassword);
        $user->setPassword($hashedPassword);

        $user->_save();
        return $user;
    }
    public function build(): void
    {
        //Create Organizations
        $org1 = OrganizationFactory::new()->createOne(['name' => 'Spleunkers']);
        $org2 = OrganizationFactory::new()->createOne(['name' => 'RIT']);
        $org3 = OrganizationFactory::new()->createOne(['name' => 'ITS']);
        $org4 = OrganizationFactory::new()->createOne(['name' => 'GCCIS']);
        $org5 = OrganizationFactory::new()->createOne(['name' => 'CAD']);

        //create users
        $user = $this->createUser('Spleunkers', 'user','user@rit.edu', 'spleunkers123', false, $org1);
        $budgetUser = $this->createUser('Spleunkers', 'budgetAdmin','budgetadmin@rit.edu', 'spleunkers123', false, $org1);
        $orgAdmin = $this->createUser('Spleunkers', 'orgAdmin', 'orgadmin@rit.edu', 'spleunkers123', false, $org1);
        $eventadmin = $this->createUser('Spleunkers', 'eventAdmin','eventadmin@rit.edu', 'spleunkers123', false, $org1);
        $platformadmin = $this->createUser('Spleunkers', 'God Mode','superadmin@rit.edu', 'spleunkers123', true, $org1);
        //add user permissions
        $orgAdmin->addAdminOfOrg($org1);
        $eventadmin->addEventAdminOfOrg($org1);
        $budgetUser->addfinanceAdminOfOrg($org1);
        //create budgets and events
        BudgetFactory::createMany(10, function() use ($org1) {
            return [
                'organization' => $org1,
                'event' => EventFactory::new()->createOne(['organization' => $org1])
            ];
        });
    }
}
