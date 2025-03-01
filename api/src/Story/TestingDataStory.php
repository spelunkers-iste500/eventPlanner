<?php

namespace App\Story;

use App\Entity\Organization;
use App\Entity\User;
use Zenstruck\Foundry\Maker\MakeFactory;
use Zenstruck\Foundry\Story;
use App\Factory\UserFactory;
use App\Factory\OrganizationFactory;
use App\Factory\EventFactory;

final class TestingDataStory extends Story
{
    public function build(): void
    {
        // TODO build your story here (https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#stories)
        OrganizationFactory::new()->createOne(['name' => 'Spleunkers']);
        OrganizationFactory::new()->createOne(['name' => 'Rochester Institute of Technology']);
        $user = UserFactory::new()->createOne(['email' => 'erb1851@rit.edu', 'name' => 'Eddie Brotz']);
        EventFactory::createMany(10);

    }
}
