<?php
// api/tests/Eventtest.php
/*
namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Event;
use App\Factory\EventFactory;
use App\Factory\UserFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class EventTest extends ApiTestCase
{
    // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
    use ResetDatabase, Factories;

    /*public function testGetEventCollection(): void
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
        // Create 50 Events using our factory
        EventFactory::createMany(50);
        $startTime = microtime(true);
        // The client implements Symfony HttpClient's `HttpClientInterface`, and the response `ResponseInterface`
        $response = static::createClient()->request('GET', '/events', ['auth_bearer' => $json['token']]);
        $endTime = microtime(true);
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
        // This generated JSON Schema is also used in the OpenAPI spec!
        $this->assertMatchesResourceCollectionJsonSchema(Event::class);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Get all Events execution time: " . $executionTime . " milliseconds\n";
    }*/
    /*
    public function testCreateEvent(): void
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

        $startTime = microtime(true);
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
            'auth_bearer' => $json['token']
        ]);
        $endTime = microtime(true);
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
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Create Event execution time: " . $executionTime . " milliseconds\n";
    }*/
    /*
    public function testUpdateEvent(): void
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
        EventFactory::createOne(['eventTitle' => 'Gavin Rager']);

        $client = static::createClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $iri = $this->findIriBy(Event::class, ['eventTitle' => 'Gavin Rager']);
        $startTime = microtime(true);
        // Use the PATCH method here to do a partial update
        $client->request('PATCH', $iri, [
            'json' => [
                'location' => "Munson's Office",
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ]
        ]);
        $endTime = microtime(true);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'eventTitle' => 'Gavin Rager',
            'location' => "Munson's Office",
        ]);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Update Event execution time: " . $executionTime . " milliseconds\n";
    }
    */
    
    /*public function testDeleteEvent(): void
    {
        // Only create the user we need with a given email
        EventFactory::createOne(['eventTitle' => 'Gavin Rager']);

        $client = static::createClient();
        $iri = $this->findIriBy(Event::class, ['eventTitle' => 'Gavin Rager']);
        $startTime = microtime(true);
        $client->request('DELETE', $iri);
        $endTime = microtime(true);
        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            // Through the container, you can access all your services from the tests, including the ORM, the mailer, remote API clients...
            static::getContainer()->get('doctrine')->getRepository(Event::class)->findOneBy(['eventTitle' => 'Gavin Rager'])
        );
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Delete Event execution time: " . $executionTime . " milliseconds\n";
    }*/
    
//}
