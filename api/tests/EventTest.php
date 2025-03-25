<?php
// api/tests/Eventtest.php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Event;
use App\Entity\Organization;
use App\Entity\User;
use App\Factory\EventFactory;
use App\Factory\UserFactory;
use App\Factory\OrganizationFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class EventTest extends ApiTestCase
{
    // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
    use ResetDatabase, Factories;
    public function createUser(string $email, string $plainPassword, bool $superAdmin, Organization $org, bool $iseventadmin): User {
        $container = self::getContainer();
        $user = UserFactory::createOne(['email' => $email, 'superAdmin' => $superAdmin]);
        $hashedPassword = $container->get('security.user_password_hasher')->hashPassword($user, $plainPassword);
        $user->setPassword($hashedPassword);
        $user->_save(); // Save the user after setting the password
        if($iseventadmin){
            $user->addEventAdminOfOrg($org);
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
    /*public function testGetEventCollection(): void
    {
        $startTime = microtime(true);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', true);
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        // Create 50 Events using our factory
        EventFactory::createMany(50);

        // The client implements Symfony HttpClient's `HttpClientInterface`, and the response `ResponseInterface`
        $response = static::createClient()->request('GET', '/events', ['auth_bearer' => $jwttoken['token']]);

        $this->assertResponseIsSuccessful();
        // Asserts that the returned content type is JSON-LD (the default)
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/contexts/Event',
            '@id' => '/events',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 50,
            'hydra:view' => [
                '@id' => '/events?page=1',
                '@type' => 'hydra:PartialCollectionView',
                'hydra:first' => '/events?page=1',
                'hydra:last' => '/events?page=2',
                'hydra:next' => '/events?page=2',
            ],
        ]);

        // Because test fixtures are automatically loaded between each test, you can assert on them
        $this->assertCount(30, $response->toArray()['hydra:member']);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform

        $this->assertMatchesResourceCollectionJsonSchema(Event::class);
        //endtime to terminal
        $executionMessage = $this->calculateExecutionTime($startTime, "Get All Events");
        echo $executionMessage;
    }*/
    public function testGetEventCollection(): void
    {
        $startTime = microtime(true);
        //create orgs
        $org = OrganizationFactory::createOne(["name" => "Information Technology Services"]);
        $org2 = OrganizationFactory::createOne(["name" => "The Tiger's Den"]);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', false,$org,true );
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false, $org2, false);
        //create events
        EventFactory::createmany(50,['organization' => $org]);
        //get org id
        $orgid = $org->getId();
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        $jwttokenUser2 = $this->authenticateUser('ritchie@rit.edu', 'spleunkers123');
        // Create 49 additional Organizations using our factory

        // test get events as regular user should get nothing
       /* 
        $response = static::createClient()->request('GET', "/organizations/$orgid/events/", ['auth_bearer' => $jwttokenUser2['token']]);
        $this->assertResponseIsSuccessful();
        // Asserts that the returned content type for 50 eventshas org admin
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/contexts/Event',
            '@id' => "/organizations/$orgid/events/",
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 0,
        ]);
        $this->assertCount(0, $response->toArray()['hydra:member']);*/
        // test get organization has super admin
        $response = static::createClient()->request('GET', "/organizations/$orgid/events/", ['auth_bearer' => $jwttoken['token']]);

        $this->assertResponseIsSuccessful();
        // Asserts that the returned content type for 50 orgs has org admin
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/contexts/Event',
            '@id' => "/organizations/$orgid/events/",
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 50,
            'hydra:view' => [
                '@id' => "/organizations/$orgid/events/?page=1",
                '@type' => 'hydra:PartialCollectionView',
                'hydra:first' => "/organizations/$orgid/events/?page=1",
                'hydra:last' => "/organizations/$orgid/events/?page=2",
                'hydra:next' => "/organizations/$orgid/events/?page=2",
            ],
        ]);
        $this->assertCount(30, $response->toArray()['hydra:member']);
        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        $this->assertMatchesResourceCollectionJsonSchema(Event::class);
        $executionMessage = $this->calculateExecutionTime($startTime, "Get org events");
        echo $executionMessage;
    }
    public function testCreateEvent(): void
    {
        $startTime = microtime(true);
        //createorg
        $org = OrganizationFactory::createOne(["name" => "Information Technology Services"]);
        $orgid = $org->getId();
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', false, $org, true);
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false,$org, false);
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        $jwttokenUser2 = $this->authenticateUser('ritchie@rit.edu', 'spleunkers123');

        $client = static::createClient();
        //create event as regular user this should fail
        $client->request('POST', "/organizations/{$orgid}/events/", [
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                "eventTitle"=> "Pizza Party",
                "startDateTime"=> "2025-01-29T18:30:00+00:00",
                "endDateTime"=> "2025-01-29T19:01:00+00:00",
                "location"=> "Gosnell",
                "maxAttendees"=> 20,
                'startFlightBooking' => "2025-01-29T18:30:00+00:00",
                'endFlightBooking' => "2025-01-29T19:01:00+00:00",
                'organization' => "/organizations/$orgid"
            ],
            'auth_bearer' => $jwttokenUser2['token']
        ]);
        $this->assertResponseStatusCodeSame(403);
        //create event as event admin
        $client->request('POST', "/organizations/{$orgid}/events/", [
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                "eventTitle"=> "Pizza Party",
                "startDateTime"=> "2025-01-29T18:30:00+00:00",
                "endDateTime"=> "2025-01-29T19:01:00+00:00",
                "location"=> "Gosnell",
                "maxAttendees"=> 20,
                'startFlightBooking' => "2025-01-29T18:30:00+00:00",
                'endFlightBooking' => "2025-01-29T19:01:00+00:00",
                'organization' => "/organizations/$orgid"
            ],
            'auth_bearer' => $jwttoken['token']
        ]);
        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        //endtime to terminal
        $executionMessage = $this->calculateExecutionTime($startTime, "Create Event");
        echo $executionMessage;
    }
    public function testUpdateEvent(): void
    {
        $startTime = microtime(true);
        //create org
        $org = OrganizationFactory::createOne(["name" => "Information Technology Services"]);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', false, $org, true);
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false,$org, false);
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        $jwttokenUser2 = $this->authenticateUser('ritchie@rit.edu', 'spleunkers123');
        // create event
        $event = EventFactory::createOne(['eventTitle' => 'Gavin Rager', 'organization' => $org]);

        $client = static::createClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $eventiri = $this->findIriBy(Event::class, ['id' => $event->getId()]);
        
        //try to update as reguar user should fail
        $client->request('PATCH', $eventiri, [
            'json' => [
                'maxAttendees' => 6,
                "startDateTime"=> "2025-01-29T18:30:00+00:00",
            ],
            'headers' => ['Content-Type' => 'application/merge-patch+json',],
            'auth_bearer' => $jwttokenUser2['token']
        ]);
        $this->assertResponseStatusCodeSame(403);
        
        // Use the PATCH as superadmin
        $client->request('PATCH', $eventiri, [
            'json' => [
                'maxAttendees' => 6,
                "startDateTime"=> "2025-01-29T18:30:00+00:00",
            ],
            'headers' => ['Content-Type' => 'application/merge-patch+json',],
            'auth_bearer' =>  $jwttoken['token']
        ]);

        $this->assertResponseIsSuccessful();

        //endtime to terminal
        $executionMessage = $this->calculateExecutionTime($startTime, "Update Event");
        echo $executionMessage;
    }
    public function testaddAttendeeToEvent(): void
    {
        $startTime = microtime(true);
        //create org
        $org = OrganizationFactory::createOne(["name" => "Information Technology Services"]);
        $org2 = OrganizationFactory::createOne(["name" => "RIT"]);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', false, $org, true);
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false,$org2, true);
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        $jwttokenUser2 = $this->authenticateUser('ritchie@rit.edu', 'spleunkers123');
        // create event
        $event = EventFactory::createOne(['eventTitle' => 'Gavin Rager', 'organization' => $org]);
        $client = static::createClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $eventiri = $this->findIriBy(Event::class, ['id' => $event->getId()]);

        //try to update as reguar user should fail
        $client->request('PATCH', "$eventiri/addAttendees", [
            'json' => [
                'attendees' => $user,
            ],
            'headers' => ['Content-Type' => 'application/merge-patch+json',],
            'auth_bearer' => $jwttokenUser2['token']
        ]);
        $this->assertResponseStatusCodeSame(403);

        // Use the PATCH as superadmin
        $client->request('PATCH', "$eventiri/addAttendees", [
            'json' => [
                'attendees' => $user,
            ],
            'headers' => ['Content-Type' => 'application/merge-patch+json',],
            'auth_bearer' =>  $jwttoken['token']
        ]);

        $this->assertResponseIsSuccessful();

        //endtime to terminal
        $executionMessage = $this->calculateExecutionTime($startTime, "add Event attendee");
        echo $executionMessage;
    }

        public function testDeleteEvent(): void
    {
        $startTime = microtime(true);
        //create org
        $org = OrganizationFactory::createOne(["name" => "Information Technology Services"]);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', false, $org, true);
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false,$org, false);
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        $jwttokenUser2 = $this->authenticateUser('ritchie@rit.edu', 'spleunkers123');
        // create event
        $event = EventFactory::createOne(['eventTitle' => 'Gavin Rager', 'organization' => $org]);
        $eventiri = $this->findIriBy(Event::class, ['id' => $event->getId()]);
        $client = static::createClient();
        //test delete event as regular user this should fail
        $client->request('DELETE', $eventiri, ['auth_bearer' =>$jwttokenUser2['token']]);
        $this->assertResponseStatusCodeSame(403);
        //actually delete the event
        $client->request('DELETE', $eventiri, ['auth_bearer' =>$jwttoken['token']]);
        
        $this->assertResponseStatusCodeSame(204);
        
        
        $executionMessage = $this->calculateExecutionTime($startTime, "Delete event");
        echo $executionMessage;
    }
    
}
