<?php
// api/tests/Eventtest.php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Flight;
use App\Entity\Event;
use App\Entity\Organization;
use App\Entity\User;
use App\Factory\EventFactory;
use App\Factory\OrganizationFactory;
use App\Factory\FlightFactory;
use App\Factory\UserFactory;
use PHPUnit\Framework\Constraint\IsFalse;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

 class FlightTest extends ApiTestCase
 {
     // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
    use ResetDatabase, Factories;
    public function createUser(string $email, string $plainPassword, bool $superAdmin): User {
        $container = self::getContainer();
        $user = UserFactory::createOne(['email' => $email, 'superAdmin' => $superAdmin]);
        $hashedPassword = $container->get('security.user_password_hasher')->hashPassword($user, $plainPassword);
        $user->setPassword($hashedPassword);
        $user->_save(); // Save the user after setting the password
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
     public function testGetFlightCollection(): void
     {
        $startTime = microtime(true);
        //create orgs
        $org = OrganizationFactory::createOne(["name" => "Information Technology Services"]);
        $org2 = OrganizationFactory::createOne(["name" => "The Tiger's Den"]);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', False);
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false);
        //create events
        FlightFactory::createMany(50, function () use ($org, $user) {
            $event = EventFactory::new()->createOne(['organization' => $org]);
            return [
                'event' => $event,
                'user' => $user,
            ];
        });
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        $jwttokenUser2 = $this->authenticateUser('ritchie@rit.edu', 'spleunkers123');
        //test as user with flight shoudl be able to get all flights
        $response = static::createClient()->request('GET', '/my/flights',['auth_bearer' => $jwttoken['token']]);
        $endTime = microtime(true);
        $this->assertResponseIsSuccessful();
        // Asserts that the returned content type is JSON-LD (the default)
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/contexts/Flight',
            '@id' => '/my/flights',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 50,
            'hydra:view' => [
                '@id' => '/my/flights?page=1',
                '@type' => 'hydra:PartialCollectionView',
                'hydra:first' => '/my/flights?page=1',
                'hydra:last' => '/my/flights?page=2',
                'hydra:next' => '/my/flights?page=2',
            ]
        ]);
        $this->assertCount(30, $response->toArray()['hydra:member']);
        $this->assertMatchesResourceCollectionJsonSchema(Flight::class);
         //test as user without flight should get no flights
         $response = static::createClient()->request('GET', '/my/flights',['auth_bearer' => $jwttokenUser2['token']]);
         $endTime = microtime(true);
         $this->assertResponseIsSuccessful();
         // Asserts that the returned content type is JSON-LD (the default)
         $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
         // Asserts that the returned JSON is a superset of this one
         $this->assertJsonContains([
             '@context' => '/contexts/Flight',
             '@id' => '/my/flights',
             '@type' => 'hydra:Collection',
             'hydra:totalItems' => 0,
         ]);
        $this->assertCount(0, $response->toArray()['hydra:member']);
        //end time
        $executionMessage = $this->calculateExecutionTime($startTime, "get all my flights");
        echo $executionMessage;
     }
     public function testPermissionGetFlight(): void
    {
        $startTime = microtime(true);
        //create orgs
        $org = OrganizationFactory::createOne(["name" => "Information Technology Services"]);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', false);
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false);
        //create events
        $event = EventFactory::createOne(['organization' => $org]);
        $eventiri = $this->findIriBy(Event::class, ['id' => $event->getId()]);
        //create flights
        $flight = FlightFactory::createOne([
            'flightCost' => 100,
            'departureDateTime' => new \DateTime('2023-10-01 10:00:00'),
            'arrivalDateTime' => new \DateTime('2023-10-01 12:00:00'),
            'departureLocation' => 'New York',
            'arrivalLocation' => 'Los Angeles',
            'flightNumber' => 'AA123',
            'event' => $event, 
            'user' => $user
        ]);
        $flightIri = $this->findIriBy(Flight::class, ['id' => $flight->getId()]);
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        $jwttokenUser2 = $this->authenticateUser('ritchie@rit.edu', 'spleunkers123');

        $client = static::createClient();
        // Use the get method to get info on user
        $client->request('GET', $flightIri, ['auth_bearer' => $jwttoken['token']]);

        //verify user is good
        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $flightIri,
            'flightCost' => 100,
            'departureDateTime' => '2023-10-01T10:00:00+00:00',
            'arrivalDateTime' => '2023-10-01T12:00:00+00:00',
            'departureLocation' => 'New York',
            'arrivalLocation' => 'Los Angeles',
        ]);
        //test to see if user can't patch another user
        $client->request('GET', $flightIri, ['auth_bearer' => $jwttokenUser2['token']]);
        $this->assertResponseStatusCodeSame(403);
        //end time calculation
        $executionMessage = $this->calculateExecutionTime($startTime, "Get flight");
        echo $executionMessage;
    }

    
 }
