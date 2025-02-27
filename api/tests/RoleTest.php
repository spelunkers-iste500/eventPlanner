<?php
// api/tests/Eventtest.php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Role;
use App\Factory\RoleFactory;
use App\Factory\UserFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class RoleTest extends ApiTestCase
{
    // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
    use ResetDatabase, Factories;

    public function testGetRoleCollection(): void
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
        // Create 50 Roles using our factory
        RoleFactory::createMany(50);
        $startTime = microtime(true);
        // The client implements Symfony HttpClient's `HttpClientInterface`, and the response `ResponseInterface`
        $response = static::createClient()->request('GET', '/roles',['auth_bearer' => $json['token']]);
        $endTime = microtime(true);
        $this->assertResponseIsSuccessful();
        // Asserts that the returned content type is JSON-LD (the default)
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/contexts/Role',
            '@id' => '/roles',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 50,
            'hydra:view' => [
                '@id' => '/roles?page=1',
                '@type' => 'hydra:PartialCollectionView',
                'hydra:first' => '/roles?page=1',
                'hydra:last' => '/roles?page=2',
                'hydra:next' => '/roles?page=2',
            ],
        ]);

        // Because test fixtures are automatically loaded between each test, you can assert on them
        $this->assertCount(30, $response->toArray()['hydra:member']);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        // This generated JSON Schema is also used in the OpenAPI spec!
        
        $this->assertMatchesResourceCollectionJsonSchema(Role::class);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Get all Roles execution time: " . $executionTime . " milliseconds\n";
    }  
    public function testCreateRole(): void
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
        $startTime = microtime(true);
        $response = static::createClient()->request('POST', '/roles', [
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                "name"=> "Information Technology Services Admin",
                "description"=> "super cool description",
            ],
            #'auth_bearer' => $json['token']
        ]);
        $endTime = microtime(true);
        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Role',
            '@type' => 'Role',
            "name"=> "Information Technology Services Admin",
            "description"=> "super cool description",


        ]);
        $this->assertMatchesResourceItemJsonSchema(Role::class);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Create Role execution time: " . $executionTime . " milliseconds\n";
    }
    public function testUpdateRole(): void
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
        // Only create the book we need with a given ISBN
        RoleFactory::createOne(["name"=> "Information Technology Services Admin"]);

        $client = static::createClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $iri = $this->findIriBy(Role::class, ["name"=> "Information Technology Services Admin"]);
        $startTime = microtime(true);
        // Use the PATCH method here to do a partial update
        $client->request('PATCH', $iri, [
            'json' => [
                "description"=> "This is a super cool description"
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ]
            #'auth_bearer' => $json['token']
        ]);
        $endTime = microtime(true);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            "name"=> "Information Technology Services Admin",
            "description"=> "This is a super cool description"
        ]);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Update Role execution time: " . $executionTime . " milliseconds\n";
    }
    public function testDeleteRole(): void
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
        RoleFactory::createOne(["name"=> "Information Technology Services"]);

        $client = static::createClient();
        $iri = $this->findIriBy(Role::class, ["name"=> "Information Technology Services"]);
        $startTime = microtime(true);
        $client->request('DELETE', $iri);
        $endTime = microtime(true);
        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            // Through the container, you can access all your services from the tests, including the ORM, the mailer, remote API clients...
            static::getContainer()->get('doctrine')->getRepository(Role::class)->findOneBy(["name"=> "Information Technology Services"])
        );
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Delete Role execution time: " . $executionTime . " milliseconds\n";
    }
    
}