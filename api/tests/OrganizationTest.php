<?php
// api/tests/Eventtest.php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Organization;
use App\Entity\User;
use App\Factory\OrganizationFactory;
use App\Factory\UserFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class OrganizationTest extends ApiTestCase
{
    // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
    use ResetDatabase, Factories;
    public function createUser(string $email, string $plainPassword, bool $superAdmin, Organization $org): User
    {
        $container = self::getContainer();
        $user = UserFactory::createOne(['email' => $email, 'superAdmin' => $superAdmin]);
        $hashedPassword = $container->get('security.user_password_hasher')->hashPassword($user, $plainPassword);
        $user->setPassword($hashedPassword);
        $user->_save(); // Save the user after setting the password
        $user->addAdminOfOrg($org);
        $user->_save();
        return $user;
    }
    public function authenticateUser(string $email, string $password): array
    {
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
    public function calculateExecutionTime(float $startTime, string $echoPhrase): string
    {
        $endTime = microtime(true);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        return $echoPhrase . " execution time: " . $executionTime . " milliseconds\n";
    }
    public function testGetOrganizationCollection(): void
    {
        $startTime = microtime(true);
        //create orgs
        $org = OrganizationFactory::createOne(["name" => "Information Technology Services"]);
        $org2 = OrganizationFactory::createOne(["name" => "The Tiger's Den"]);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', true,$org );
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false, $org2);
        //get org iri
        $orgiri = $this->findIriBy(User::class, ['id' => $org->getId()]);
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        $jwttokenUser2 = $this->authenticateUser('ritchie@rit.edu', 'spleunkers123');
        // Create 49 additional Organizations using our factory
        OrganizationFactory::createMany(48);

        // test get organization as regular user should deny
        $response = static::createClient()->request('GET', '/organizations', ['auth_bearer' => $jwttokenUser2['token']]);
        $this->assertResponseStatusCodeSame(403);
        // test get organization has super admin
        $response = static::createClient()->request('GET', '/organizations', ['auth_bearer' => $jwttoken['token']]);

        $this->assertResponseIsSuccessful();
        // Asserts that the returned content type for 50 orgs has org admin
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/contexts/Organization',
            '@id' => '/organizations',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 50,
            'hydra:view' => [
                '@id' => '/organizations?page=1',
                '@type' => 'hydra:PartialCollectionView',
                'hydra:first' => '/organizations?page=1',
                'hydra:last' => '/organizations?page=2',
                'hydra:next' => '/organizations?page=2',
            ],
        ]);
        $this->assertCount(30, $response->toArray()['hydra:member']);
        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        $this->assertMatchesResourceCollectionJsonSchema(Organization::class);
        $executionMessage = $this->calculateExecutionTime($startTime, "Get All Organizations");
        echo $executionMessage;
    }
    //function to test get user permissions
    public function testPermissionGetOrganization(): void
    {
        $startTime = microtime(true);
        //create orgs
        $org = OrganizationFactory::createOne([
            "name" => "Information Technology Services",
            "description" => "super cool description",
            "industry" => "Information Technology",
            "address" => "1 Lomb Memorial Dr, Rochester, NY 14623",
        ]);
        $org2 = OrganizationFactory::createOne(["name" => "The Tiger's Den"]);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', false,$org );
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false, $org2);

        $orgiri = $this->findIriBy(Organization::class, ['id' => $org->getId()]);
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        $jwttokenUser2 = $this->authenticateUser('ritchie@rit.edu', 'spleunkers123');

        $client = static::createClient();
        // Use the get method to get info on user
        $client->request('GET', $orgiri, ['auth_bearer' => $jwttoken['token']]);

        //verify user is good
        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $orgiri,
            "name" => "Information Technology Services",
            "description" => "super cool description",
            "industry" => "Information Technology",
            "address" => "1 Lomb Memorial Dr, Rochester, NY 14623",
        ]);
        //test to see if user can't patch another user
        $client->request('GET', $orgiri, ['auth_bearer' => $jwttokenUser2['token']]);
        $this->assertResponseStatusCodeSame(403);
        //end time calculation
        $executionMessage = $this->calculateExecutionTime($startTime, "Get org");
        echo $executionMessage;
    }
    public function testCreateOrganization(): void
    {
        $startTime = microtime(true);
        //create orgs
        $org2 = OrganizationFactory::createOne(["name" => "The Tiger's Den"]);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', true,$org2 );
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false, $org2);
        //auth tokens
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        $jwttokenUser2 = $this->authenticateUser('ritchie@rit.edu', 'spleunkers123');

        //test create org if user is not org admin
        $response = static::createClient()->request('POST', '/organizations', [
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                "name" => "Information Technology Services",
                "address" => "1 Lomb Memorial Dr, Rochester, NY 14623",
                "description" => "super cool description",
                "industry" => "Information Technology",
            ],
            'auth_bearer' =>  $jwttokenUser2['token']
        ]);
        $this->assertResponseStatusCodeSame(403);

        //test create org if user is org admin
        $response = static::createClient()->request('POST', '/organizations', [
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                "name" => "Information Technology Services",
                "address" => "1 Lomb Memorial Dr, Rochester, NY 14623",
                "description" => "super cool description",
                "industry" => "Information Technology",
            ],
            'auth_bearer' =>  $jwttoken['token']
        ]);
        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $executionMessage = $this->calculateExecutionTime($startTime, "Create Organizations");
        echo $executionMessage;
    }
    public function testUpdateOrganization(): void
     {
        $startTime = microtime(true);
        //create orgs
        $org = OrganizationFactory::createOne(["name" => "Information Technology Services"]);
        $org2 = OrganizationFactory::createOne(["name" => "The Tiger's Den"]);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', false,$org );
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false, $org2);
        //auth tokens// Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        $jwttokenUser2 = $this->authenticateUser('ritchie@rit.edu', 'spleunkers123');
        $client = static::createClient();
        // get org iri

        $orgiri = $this->findIriBy(Organization::class, ['id' => $org->getId()]);
        //try to update org as regular user should fail
        $client->request('PATCH', $orgiri, [
            'json' => [
                "description" => "This is a super cool description"
            ],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
            'auth_bearer' => $jwttokenUser2['token']
        ]);
        $this->assertResponseStatusCodeSame(403);

        // update org as org admin
        $client->request('PATCH', $orgiri, [
            'json' => [
                "description" => "This is a super cool description"
            ],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
            'auth_bearer' => $jwttoken['token']
        ]);
        $endTime = microtime(true);
        $this->assertResponseIsSuccessful();
        $executionMessage = $this->calculateExecutionTime($startTime, "Update Organizations");
        echo $executionMessage;
     }

    public function testDeleteOrganization(): void
    {
        $startTime = microtime(true);
        //create orgs
        $org = OrganizationFactory::createOne(["name" => "Information Technology Services"]);
        $org2 = OrganizationFactory::createOne(["name" => "The Tiger's Den"]);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', true, $org2);
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false, $org2);
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        $jwttokenUser2 = $this->authenticateUser('ritchie@rit.edu', 'spleunkers123');
        // Only create the org we need with given info

        $orgiri = $this->findIriBy(Organization::class, ['id' => $org->getId()]);


        $client = static::createClient();
        //fail test to ensure no other user can delete except super admin
        $client->request('DELETE', $orgiri, ['auth_bearer' => $jwttokenUser2['token']]);
        $this->assertResponseStatusCodeSame(403);

        $client->request('DELETE', $orgiri, ['auth_bearer' => $jwttoken['token']]);

        $this->assertResponseStatusCodeSame(204);
        //  $this->assertNull(
        // Through the container, you can access all your services from the tests, including the ORM, the mailer, remote API clients...
        //static::getContainer()->get('doctrine')->getRepository(Organization::class)->findOneBy(["name" => "Information Technology Services"])
        // );

        $executionMessage = $this->calculateExecutionTime($startTime, "Delete Organizations");
        echo $executionMessage;
    }
}
