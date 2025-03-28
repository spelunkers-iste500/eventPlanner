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
use App\Factory\UserEventFactory;
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
        //Create Organizations
        $org1 = OrganizationFactory::new()->createOne(['name' => 'Spelunkers']);
        $org2 = OrganizationFactory::new()->createOne(['name' => 'RIT']);
        $org3 = OrganizationFactory::new()->createOne(['name' => 'ITS']);
        $org4 = OrganizationFactory::new()->createOne(['name' => 'GCCIS']);
        $org5 = OrganizationFactory::new()->createOne(['name' => 'CAD']);
        $org2 = OrganizationFactory::new()->createOne(['name' => 'RIT']);
        $org3 = OrganizationFactory::new()->createOne(['name' => 'ITS']);
        $org4 = OrganizationFactory::new()->createOne(['name' => 'GCCIS']);
        $org5 = OrganizationFactory::new()->createOne(['name' => 'CAD']);
        $otpcode = "G5AGCNDNEMSWM326LZJDGSDGLZSEA6RQMFBEQWCIO47TOQDYIRKQ";
        //create users
        $user = $this->createUser('Spleunkers', 'user', 'user@rit.edu', 'spelunkers123', false, $org1, $otpcode, "user");
        $budgetUser = $this->createUser('Spleunkers', 'budgetAdmin', 'budgetadmin@rit.edu', 'spelunkers123', false, $org1, $otpcode, "financial");
        $orgAdmin = $this->createUser('Spleunkers', 'orgAdmin', 'orgadmin@rit.edu', 'spelunkers123', false, $org1, $otpcode, "orgAdmin");
        $eventadmin = $this->createUser('Spleunkers', 'eventAdmin', 'eventadmin@rit.edu', 'spelunkers123', false, $org1, $otpcode, "eventAdmin");
        $platformadmin = $this->createUser('Spleunkers', 'superadmin', 'superadmin@rit.edu', 'spelunkers123', true, $org1, $otpcode, "user");
        //create budgets and events\

        BudgetFactory::createMany(50, function () use ($org1, $eventadmin, $user, $budgetUser) {
            $event = EventFactory::new()->createOne([
                'organization' => $org1,
            ]);

            // Create UserEvent objects to link users to the event
            UserEventFactory::createOne(['user' => $eventadmin, 'event' => $event]);
            UserEventFactory::createOne(['user' => $user, 'event' => $event]);
            UserEventFactory::createOne(['user' => $budgetUser, 'event' => $event]);

            return [
                'organization' => $org1,
                'event' => $event,
                'financialPlannerID' => $budgetUser
            ];
        });
        //EventFactory::new()->createMany(10, ['organization' => $org1, 'attendees' =>  [$eventadmin,  $user]]);
    }
}
