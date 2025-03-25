<?php
// api/tests/Eventtest.php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\UserEvent;
use App\Entity\Organization;
use App\Entity\User;
use App\Entity\Event;
use App\Factory\EventFactory;
use App\Factory\BudgetFactory;
use App\Factory\UserEventFactory;
use App\Factory\UserFactory;
use App\Factory\OrganizationFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class UserEventsTest extends ApiTestCase
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
    public function CreateEventAttendings(User $user, Event $event, Organization $org): UserEvent {
        $event = EventFactory::new()->createOne([
            'organization' => $org,
        ]);

        // Create UserEvent objects to link users to the event
        $userevent = UserEventFactory::createOne(['user' => $user, 'event' => $event]);
        
        return $userevent;
    }
    public function calculateExecutionTime(float $startTime, string $echoPhrase): string {
        $endTime = microtime(true);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        return $echoPhrase . " execution time: " . $executionTime . " milliseconds\n";
    }

    public function testGetUserEventCollection(): void
    {
        $startTime = microtime(true);
        //create orgs
        $org = OrganizationFactory::createOne(["name" => "Information Technology Services"]);
        $org2 = OrganizationFactory::createOne(["name" => "The Tiger's Den"]);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', false);
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false);
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        $jwttokenUser2 = $this->authenticateUser('ritchie@rit.edu', 'spleunkers123');
        //create user attentding events 
        BudgetFactory::createMany(50, function () use ($org, $user) {
            $event = EventFactory::new()->createOne(['organization' => $org]);
            // Create UserEvent objects to link users to the event
            UserEventFactory::createOne(['user' => $user, 'event' => $event]);
            return [
                'organization' => $org,
                'event' => $event,
            ];
        });

       
        // Create 49 additional Organizations using our factory

        // test get events as regular user should get nothing
        $response = static::createClient()->request('GET', "/my/events", ['auth_bearer' => $jwttokenUser2['token']]);
        $this->assertResponseIsSuccessful();
        // Asserts that the returned content type for 50 eventshas org admin
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/contexts/UserEvent',
            '@id' => "/my/events",
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 0,
        ]);
        $this->assertCount(0, $response->toArray()['hydra:member']);
        // test get organization has super admin
        $response = static::createClient()->request('GET', "/my/events", ['auth_bearer' => $jwttoken['token']]);

        $this->assertResponseIsSuccessful();
        // Asserts that the returned content type for 50 orgs has org admin
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/contexts/UserEvent',
            '@id' => "/my/events",
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 50,
            'hydra:view' => [
                '@id' => "/my/events?page=1",
                '@type' => 'hydra:PartialCollectionView',
                'hydra:first' => "/my/events?page=1",
                'hydra:last' => "/my/events?page=2",
                'hydra:next' => "/my/events?page=2",
            ],
        ]);
        $this->assertCount(30, $response->toArray()['hydra:member']);
        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        $this->assertMatchesResourceCollectionJsonSchema(UserEvent::class);
        $executionMessage = $this->calculateExecutionTime($startTime, "get all my events");
        echo $executionMessage;
    }
}