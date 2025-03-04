<?php

namespace App\Story;

use App\Entity\Organization;
use App\Entity\User;
use Zenstruck\Foundry\Maker\MakeFactory;
use Zenstruck\Foundry\Story;
use App\Factory\UserFactory;
use App\Factory\OrganizationFactory;
use App\Factory\EventFactory;
use App\Factory\BudgetFactory;
use Doctrine\Common\Collections\ArrayCollection;

final class TestingDataStory extends Story
{
    public function build(): void
    {
        // TODO build your story here (https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#stories)
        $org1 = OrganizationFactory::new()->createOne(['name' => 'Spleunkers']);
        $org2 = OrganizationFactory::new()->createOne(['name' => 'RIT']);
        $org3 = OrganizationFactory::new()->createOne(['name' => 'ITS']);
        $org4 = OrganizationFactory::new()->createOne(['name' => 'GCCIS']);
        $org5 = OrganizationFactory::new()->createOne(['name' => 'CAD']);
        OrganizationFactory::createMany(5);
        BudgetFactory::createMany(10, function() use ($org1) {
            return [
                'organization' => $org1,
                'event' => EventFactory::new()->createOne(['organization' => $org1])
            ];
        });
        #EventFactory::createMany(10, ['organization' => $org1, 'budget' =>  ]);
        $orgCollection = new ArrayCollection([$org1]);
        #UserFactory::createMany(100,['OrgMembership' => $orgCollection]);
    }
}
