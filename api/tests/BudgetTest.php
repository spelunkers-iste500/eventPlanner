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

    public function testGetBudgetCollection(): void
    {
        //get auth token for test \
        $authclient = self::createClient();
        // Create User and Account using Foundry
        $user = UserFactory::new()->createOne([
            'email' => 'ratchie@rit.edu',
            'roles' => ['ROLE_ADMIN']
        ]);
        $userpassword = $user -> getPassword();
        // retrieve a token
        $authresponse = $authclient->request('POST', '/auth', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'id' => (string) $user->getId(), // Use user ID from the created user
                'token' => (string) $userpassword, // Token is from the created account
            ],
            
        ]);
        $json = $authresponse->toArray();
        //create organization
        $org = OrganizationFactory::createOne();
        //create event
        $event = EventFactory::new()->createOne(['organization' => $org]);
        // Create 50 Budgets using our factory
        BudgetFactory::createMany(50, function() use ($org) {
            return [
                'organization' => $org,
                'event' => EventFactory::new()->createOne(['organization' => $org])
            ];
        });
        $startTime = microtime(true);
        // The client implements Symfony HttpClient's `HttpClientInterface`, and the response `ResponseInterface`
        $response = static::createClient()->request('GET', '/budgets',['auth_bearer' => $json['token']]);
        $endTime = microtime(true);
        $this->assertResponseIsSuccessful();
        // Asserts that the returned content type is JSON-LD (the default)
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/contexts/Budget',
            '@id' => '/budgets',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 50,
            'hydra:view' => [
                '@id' => '/budgets?page=1',
                '@type' => 'hydra:PartialCollectionView',
                'hydra:first' => '/budgets?page=1',
                'hydra:last' => '/budgets?page=2',
                'hydra:next' => '/budgets?page=2',
            ],
        ]);

        // Because test fixtures are automatically loaded between each test, you can assert on them
        $this->assertCount(30, $response->toArray()['hydra:member']);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        // This generated JSON Schema is also used in the OpenAPI spec!
        $this->assertMatchesResourceCollectionJsonSchema(Budget::class);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Get all Budgets execution time: " . $executionTime . " milliseconds\n";
    }    
    public function testCreateBudget(): void
    {
        //get auth token for test \
        $authclient = self::createClient();
        // Create User and Account using Foundry
        $user = UserFactory::new()->createOne([
            'email' => 'ratchie@rit.edu',
            'roles' => ['ROLE_ADMIN']
        ]);
        $userpassword = $user -> getPassword();
        // retrieve a token
        $authresponse = $authclient->request('POST', '/auth', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'id' => (string) $user->getId(), // Use user ID from the created user
                'token' => (string) $userpassword, // Token is from the created account
            ],
            
        ]);
        $json = $authresponse->toArray();
        
        //create organization
        $org = OrganizationFactory::createOne();
        //create event
        $event = EventFactory::new()->createOne(['organization' => $org]);
        //get iris for event org and user
        $useriri = $this->findIriBy(User::class, ['email' => 'ratchie@rit.edu']);
        $orgIri = $this->findIriBy(Organization::class, ['id' => $org->getId()]);
        $eventIri = $this->findIriBy(Event::class, ['id' => $event->getId()]);
        $startTime = microtime(true);
        $response = static::createClient()->request('POST', '/budgets', [
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                "total"=> "100000.00",
                "spentBudget"=> "50000.00",
                "vipBudget"=> "20000.00",
                "regBudget"=> "80000.00",
                "financialPlannerID"=> "$useriri",
                "organization" => $orgIri,
                "event" => $eventIri
            ],
            'auth_bearer' => $json['token']
        ]);
        $endTime = microtime(true);
        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Budget',
            '@type' => 'Budget',
            "total"=> "100000.00",
            "spentBudget"=> "50000.00",
            "vipBudget"=> "20000.00",
            "regBudget"=> "80000.00",
            "organization" => $orgIri,
            "event" => $eventIri

        ]);
        $this->assertMatchesResourceItemJsonSchema(Budget::class);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Create Budget execution time: " . $executionTime . " milliseconds\n";
    }/*
    public function testUpdateBudget(): void
    {
        //get auth token for test \
        $authclient = self::createClient();
        // Create User and Account using Foundry
        $user = UserFactory::new()->createOne([
            'email' => 'ratchie@rit.edu',
            'roles' => ['ROLE_ADMIN']
        ]);
        $userpassword = $user -> getPassword();
        // retrieve a token
        $authresponse = $authclient->request('POST', '/auth', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'id' => (string) $user->getId(), // Use user ID from the created user
                'token' => (string) $userpassword, // Token is from the created account
            ],
            
        ]);
        $json = $authresponse->toArray();
        //create budget to update
                
        $org = OrganizationFactory::createOne();
        $orgIri = $this->findIriBy(Organization::class, ['id' => $org->getId()]);
        $orgid = $org->getId();
        $budget = BudgetFactory::createOne(["total"=> "420.69", 'organization' => $orgIri]);

        $client = static::createClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $iri = $this->findIriBy(Budget::class, ["total"=> "420.69"]);
        $startTime = microtime(true);
        // Use the PATCH method here to do a partial update
        $client->request('PATCH', "/organizations/$orgid/budgets", [
            'json' => [
                "vipBudget"=> "6969.11",
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ],
            'auth_bearer' => $json['token']
        ]);
        $endTime = microtime(true);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            "vipBudget"=> "6969.11",
            "total"=> "420.69",
        ]);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Update Budget execution time: " . $executionTime . " milliseconds\n";
    }*/

    /*public function testDeleteBudget(): void
    {
        //get auth token for test \
        $authclient = self::createClient();
        // Create User and Account using Foundry
        $user = UserFactory::new()->createOne(['email' => 'test@example.com']);
        $userpassword = $user -> getPassword();
        // retrieve a token
        $authresponse = $authclient->request('POST', '/auth', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'id' => (string) $user->getId(), // Use user ID from the created user
                'token' => (string) $userpassword, // Token is from the created account
            ],
            
        ]);
        $json = $authresponse->toArray();
        // Only create the user we need with a given email
        BudgetFactory::createOne(["total"=> "420.69"]);

        $client = static::createClient();
        $iri = $this->findIriBy(Budget::class, ["total"=> "420.69"]);
        $startTime = microtime(true);
        $client->request('DELETE', $iri,['auth_bearer' => $json['token']]);
        $endTime = microtime(true);
        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            // Through the container, you can access all your services from the tests, including the ORM, the mailer, remote API clients...
            static::getContainer()->get('doctrine')->getRepository(Budget::class)->findOneBy(["total"=> "420.69"])
        );
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Delete Budget execution time: " . $executionTime . " milliseconds\n";
    }*/
    
}