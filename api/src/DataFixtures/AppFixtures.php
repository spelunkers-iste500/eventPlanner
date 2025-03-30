<?php

namespace App\DataFixtures;

use App\Story\TestingDataStory;
use App\Story\ConcurrentUserTestingStory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        ConcurrentUserTestingStory::load(); // concurrent user testing data
        //TestingDataStory::load();//frontend testing data
    }
}
