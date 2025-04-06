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

class OrganizationInviteTest extends ApiTestCase
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
    public function testCreateOrganizationInvite(): void
    {
        $startTime = microtime(true);
        //create orgs
        $org1 = OrganizationFactory::createOne(["name" => "Spelunkers"]);
        $org2 = OrganizationFactory::createOne(["name" => "The Tiger's Den"]);
        $org1Iri = $this->findIriBy(Organization::class, ['id' => $org1->getId()]);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', false,$org1 );
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false, $org2);
        //auth tokens
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        $jwttokenUser2 = $this->authenticateUser('ritchie@rit.edu', 'spleunkers123');

        //test create org if user is not org admin
        $response = static::createClient()->request('POST', '/organizationInvite', [
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                "organization" => $org1Iri,
                "expectedEmail" => "test01@test.com",
                "inviteType" => "admin",
            ],
            'auth_bearer' =>  $jwttokenUser2['token']
        ]);
        $this->assertResponseStatusCodeSame(403);

        //test create org if user is org admin
        $response = static::createClient()->request('POST', '/organizationInvite', [
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                "organization" => $org1Iri,
                "expectedEmail" => "test01@test.com",
                "inviteType" => "admin",
            ],
            'auth_bearer' =>  $jwttoken['token']
        ]);
        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $executionMessage = $this->calculateExecutionTime($startTime, "Create Organization invite");
        echo $executionMessage;
    }

}
