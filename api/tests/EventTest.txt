<?php
// api/tests/Eventtest.php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Event;
use App\Entity\User;
use App\Factory\EventFactory;
use App\Factory\UserFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class EventTest extends ApiTestCase
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
    public function testGetEventCollection(): void
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
    }
    
    public function testCreateEvent(): void
    {
        $startTime = microtime(true);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', true);
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');

        $client = static::createClient();
        $client->request('POST', '/events', [
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                "eventTitle"=> "Pizza Party",
                "startDateTime"=> "2025-01-29T18:30:00+00:00",
                "endDateTime"=> "2025-01-29T19:01:00+00:00",
                "location"=> "Gosnell",
                "maxAttendees"=> 20,
                'startFlightBooking' => "2025-01-29T18:30:00+00:00",
                'endFlightBooking' => "2025-01-29T19:01:00+00:00"
            ],
            'auth_bearer' => $jwttoken['token']
        ]);
        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Event',
            '@type' => 'Event',
            "eventTitle"=> "Pizza Party",
            "startDateTime"=> "2025-01-29T18:30:00+00:00",
            "endDateTime"=> "2025-01-29T19:01:00+00:00",
            "location"=> "Gosnell",
            "maxAttendees"=> 20,
            'startFlightBooking' => "2025-01-29T18:30:00+00:00",
            'endFlightBooking' => "2025-01-29T19:01:00+00:00"

        ]);
        $this->assertMatchesResourceItemJsonSchema(Event::class);
        //endtime to terminal
        $executionMessage = $this->calculateExecutionTime($startTime, "Create Event");
        echo $executionMessage;
    }
    
    public function testUpdateEvent(): void
    {
        $startTime = microtime(true);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', true);
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        // create event
        $event = EventFactory::createOne(['eventTitle' => 'Gavin Rager']);

        $client = static::createClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $eventiri = $this->findIriBy(Event::class, ['id' => $event->getId()]);
        // Use the PATCH method here to do a partial update
        $client->request('PATCH', $eventiri, [
            'json' => [
                'location' => "Munson's Office",
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ]
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $eventiri,
            'eventTitle' => 'Gavin Rager',
            'location' => "Munson's Office",
        ]);
        //endtime to terminal
        $executionMessage = $this->calculateExecutionTime($startTime, "Create Event");
        echo $executionMessage;
    }
    
    public function testDeleteEvent(): void
    {
        $startTime = microtime(true);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', true);
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        // create event
        $event = EventFactory::createOne(['eventTitle' => 'Gavin Rager']);
        $eventiri = $this->findIriBy(Event::class, ['id' => $event->getId()]);
        
        $client = static::createClient();
        
        $client->request('DELETE', $eventiri, ['auth_bearer' =>$jwttoken['token']]);
        
        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            // Through the container, you can access all your services from the tests, including the ORM, the mailer, remote API clients...
            static::getContainer()->get('doctrine')->getRepository(Event::class)->findOneBy(['eventTitle' => 'Gavin Rager'])
        );
        
        $executionMessage = $this->calculateExecutionTime($startTime, "Delete event");
        echo $executionMessage;
    }
    
}
