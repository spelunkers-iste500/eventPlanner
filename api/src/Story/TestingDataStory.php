<?php

namespace App\Story;

use App\Entity\Organization;
use Zenstruck\Foundry\Maker\MakeFactory;
use Zenstruck\Foundry\Story;
use App\Factory\OrganizationFactory;
use App\Factory\EventFactory;

final class TestingDataStory extends Story
{
    public function build(): void
    {
        // TODO build your story here (https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#stories)
        OrganizationFactory::new()->createOne(['name' => 'Spleunkers']);
        EventFactory::createMany(10);
        
    }
}
