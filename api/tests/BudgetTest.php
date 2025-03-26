<?php
        // api/tests/Budgettest.php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Budget;
use App\Entity\User;
use App\Entity\Event;
use App\Entity\Organization;      
use App\Factory\UserFactory;      
use App\Factory\BudgetFactory;      
use App\Factory\OrganizationFactory;      
use App\Factory\EventFactory;      
use Zenstruck\Foundry\Test\Factories;      
use Zenstruck\Foundry\Test\ResetDatabase;

 class BudgetTest extends ApiTestCase
 {
     // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
     use ResetDatabase, Factories;
     public function createUser(string $email, string $plainPassword, bool $superAdmin, Organization $org, bool $isbudgetadmin): User {
        $container = self::getContainer();
        $user = UserFactory::createOne(['email' => $email, 'superAdmin' => $superAdmin]);
        $hashedPassword = $container->get('security.user_password_hasher')->hashPassword($user, $plainPassword);
        $user->setPassword($hashedPassword);
        $user->_save(); // Save the user after setting the password
        if($isbudgetadmin){
            $user->addFinanceAdminOfOrg($org);
            $user->_save();
        }
        return $user;
    }
    public function authenticateUser(string $email, string $password): array {
        $authclient = self::createClient();
        $authresponse = $authclient->request('POST', '/auth', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => $email,
                'password' => $password,
            ],
        ]);
        return $authresponse->toArray();
    }
    public function calculateExecutionTime(float $startTime, string $echoPhrase): string {
        $endTime = microtime(true);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        return $echoPhrase . " execution time: " . $executionTime . " milliseconds\n";
    }
     public function testGetBudgetCollection(): void
     {
        $startTime = microtime(true);
        //create org
        $org = OrganizationFactory::createOne(['name' => 'ITS']);
        $orgid = $org->getId();
        $org2 = OrganizationFactory::createOne(['name' => 'RIT']);
        $org2id = $org2->getId();
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', false, $org, true);
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false, $org, false);
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        $jwttokenUser2 = $this->authenticateUser('ritchie@rit.edu', 'spleunkers123');
        //create event
        // Create 50 Budgets using our factory
        BudgetFactory::createMany(50, function() use ($org) {
            return [
                'organization' => $org,
                'event' => EventFactory::new()->createOne(['organization' => $org])
            ];
        });
        //make budgets for other org
        BudgetFactory::createMany(5, function() use ($org2) {
            return [
                'organization' => $org2,
                'event' => EventFactory::new()->createOne(['organization' => $org2])
            ];
        });

        // test get budget collection as regular user should get nothing
    
        $response = static::createClient()->request('GET', "/organizations/$orgid/budgets", ['auth_bearer' => $jwttokenUser2['token']]);
        $this->assertResponseIsSuccessful();
        // Asserts that the returned content type for 50 orgs has org admin
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/contexts/Budget',
            '@id' => "/organizations/$orgid/budgets",
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 0,
        ]);
        $this->assertCount(0, $response->toArray()['hydra:member']);
        //test as budget admin
        $response = static::createClient()->request('GET', "/organizations/$orgid/budgets",['auth_bearer' => $jwttoken['token']]);
        $this->assertResponseIsSuccessful();
        // Asserts that the returned content type is JSON-LD (the default)
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/contexts/Budget',
            '@id' => "/organizations/$orgid/budgets",
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 50,
            'hydra:view' => [
                '@id' => "/organizations/$orgid/budgets?page=1",
                '@type' => 'hydra:PartialCollectionView',
                'hydra:first' => "/organizations/$orgid/budgets?page=1",
                'hydra:last' => "/organizations/$orgid/budgets?page=2",
                'hydra:next' => "/organizations/$orgid/budgets?page=2",
            ],
           ]);
        // Because test fixtures are automatically loaded between each test, you can assert on them
        $this->assertCount(30, $response->toArray()['hydra:member']);
        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        // This generated JSON Schema is also used in the OpenAPI spec!
        $this->assertMatchesResourceCollectionJsonSchema(Budget::class);
        //end time calculation
        $executionMessage = $this->calculateExecutionTime($startTime, "Get all Budgets");
        echo $executionMessage;
     }    
     public function testCreateBudget(): void
     {
        $startTime = microtime(true);
        //create org
        $org = OrganizationFactory::createOne(['name' => 'ITS']);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', true, $org, true);
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false, $org, false);
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        $jwttokenUser2 = $this->authenticateUser('ritchie@rit.edu', 'spleunkers123');
        //create event
        $event = EventFactory::new()->createOne(['organization' => $org]);
        //get iris for event org and user
        $useriri = $this->findIriBy(User::class, ['id' => $user->getId()]);
        $orgIri = $this->findIriBy(Organization::class, ['id' => $org->getId()]);
        $eventIri = $this->findIriBy(Event::class, ['id' => $event->getId()]);
        //try this as normal user should fail
        $response = static::createClient()->request('POST', '/budgets', [
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                "perUserTotal"=> 50000,
                "organization" => $orgIri,
                "event" => $eventIri
            ],
            'auth_bearer' => $jwttokenUser2['token']
        ]);
        $this->assertResponseStatusCodeSame(403);
        //do this as budget admin
        $response = static::createClient()->request('POST', '/budgets', [
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                "perUserTotal"=> 50000,
                "organization" => $orgIri,
                "event" => $eventIri
            ],
            'auth_bearer' => $jwttoken['token']
        ]);
        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Budget',
            '@type' => 'Budget',
            "perUserTotal"=> 50000,
            "organization" => $orgIri,
            "event" => $eventIri
        ]);
        $this->assertMatchesResourceItemJsonSchema(Budget::class);
        $executionMessage = $this->calculateExecutionTime($startTime, "Create Budget");
        echo $executionMessage;
     }
    public function testGetBudget(): void{
        $startTime = microtime(true);
        //create org
        $org = OrganizationFactory::createOne(['name' => 'ITS']);
        $orgIri = $this->findIriBy(Organization::class, ['id' => $org->getId()]);
        $orgid = $org->getId();
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', false, $org, true);
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false, $org, false);
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        $jwttokenUser2 = $this->authenticateUser('ritchie@rit.edu', 'spleunkers123');
        //create event
        $event = EventFactory::new()->createOne(['organization' => $org]);
        $eventIri = $this->findIriBy(Event::class, ['id' => $event->getId()]);
        //create budget
        $budget = BudgetFactory::createOne(["perUserTotal"=> 50000, 'organization' => $org, 'event' => $event]);
        $budgetIri = $this->findIriBy(Budget::class, ['id' => $budget->getId()]);
        //test as normal user should fail
        $response = static::createClient()->request('GET', $budgetIri, ['auth_bearer' => $jwttokenUser2['token']]);
        $this->assertResponseStatusCodeSame(403);
        //test as budget admin
        $response = static::createClient()->request('GET', $budgetIri, ['auth_bearer' => $jwttoken['token']]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Budget',
            '@type' => 'Budget',
            "perUserTotal"=> 50000,
            "organization" => $orgIri,
            "event" => $eventIri
        ]);
        $this->assertMatchesResourceItemJsonSchema(Budget::class);
        //end time calculation
        $executionMessage = $this->calculateExecutionTime($startTime, "Get a Budget");
        echo $executionMessage;
    }
    
    public function testUpdateBudget(): void
    {
        $startTime = microtime(true);
        //create org
        $org = OrganizationFactory::createOne(['name' => 'ITS']);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', false, $org, true);
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false, $org, false);
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        $jwttokenUser2 = $this->authenticateUser('ritchie@rit.edu', 'spleunkers123');

        //create event
        $event = EventFactory::new()->createOne(['organization' => $org]);
        //create budget
        $budget = BudgetFactory::createOne(["perUserTotal"=> 50000, 'organization' =>$org, 'event' => $event]);
        $budgeiri = $this->findIriBy(Budget::class, ['id' => $budget->getId()]);
       
        $client = static::createClient();
        //update budget as normal user should fail
        $client->request('PATCH', $budgeiri, [
            'json' => [
                "perUserTotal"=> 694200,
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ],
            'auth_bearer' =>  $jwttokenUser2['token']
        ]);
        $this->assertResponseStatusCodeSame(403);
        // update budget as budget admin
        $client->request('PATCH', $budgeiri, [
            'json' => [
                "perUserTotal"=> 694200,
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ],
            'auth_bearer' =>  $jwttoken['token']
        ]);

        $this->assertResponseIsSuccessful();
        //ending message
        $executionMessage = $this->calculateExecutionTime($startTime, "Update Budget");
        echo $executionMessage;
    }

    public function testDeleteBudget(): void
    {
        $startTime = microtime(true);
        //create org
        $org = OrganizationFactory::createOne(['name' => 'ITS']);
        $orgid = $org->getId();
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', false, $org, true);
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false, $org, false);
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        $jwttokenUser2 = $this->authenticateUser('ritchie@rit.edu', 'spleunkers123');  
        //create event
        $event = EventFactory::new()->createOne(['organization' => $org]);
        // create budget
        $budget = BudgetFactory::createOne(["perUserTotal"=> "50000", 'organization' => $org, 'event' => $event]);
        $budgetiri = $this->findIriBy(Budget::class, ['id' => $budget->getId()]);
        $client = static::createClient();
        //try to delete as normal user shoudl fail
        $client->request('DELETE', $budgetiri,['auth_bearer' => $jwttokenUser2['token']]);
        //validate reply
        $this->assertResponseStatusCodeSame(403);
        //try to delete as budget admin
        $client->request('DELETE', $budgetiri,['auth_bearer' => $jwttoken['token']]);
        //validate reply
        $this->assertResponseStatusCodeSame(204);   
        $executionMessage = $this->calculateExecutionTime($startTime, "Delete Budget");
        echo $executionMessage;
    }
    
 }