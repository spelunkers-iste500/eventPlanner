<?php
// api/tests/EventChangeManagementtest.php
/*
namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\EventChangeManagement;
use App\Entity\Event;
use App\Factory\EventFactory;
use App\Factory\EventChangeManagementFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class EventChangeManagementTest extends ApiTestCase
{
    // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
    use ResetDatabase, Factories;

    public function testGetEventChangeManagementCollection(): void
{
    // Create 50 EventChangeManagement using our factory
    EventChangeManagementFactory::createMany(50);
    $startTime = microtime(true);
    // The client implements Symfony HttpClient's `HttpClientInterface`, and the response `ResponseInterface`
    $response = static::createClient()->request('GET', '/event_change_managements');
    $endTime = microtime(true);
    $this->assertResponseIsSuccessful();
    // Asserts that the returned content type is JSON-LD (the default)
    $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

    // Asserts that the returned JSON is a superset of this one
    $this->assertJsonContains([
        '@context' => '/contexts/eventChangeManagement',
        '@id' => '/event_change_managements',
        '@type' => 'hydra:Collection',
        'hydra:totalItems' => 50,
        'hydra:view' => [
            '@id' => '/event_change_managements?page=1',
            '@type' => 'hydra:PartialCollectionView',
            'hydra:first' => '/event_change_managements?page=1',
            'hydra:last' => '/event_change_managements?page=2',
            'hydra:next' => '/event_change_managements?page=2',
        ],
    ]);

    // Because test fixtures are automatically loaded between each test, you can assert on them
    $this->assertCount(30, $response->toArray()['hydra:member']);

    // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
    // This generated JSON Schema is also used in the OpenAPI spec!
    $this->assertMatchesResourceCollectionJsonSchema(EventChangeManagement::class);
    $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
    $executionTime = round($executionTime, 3); // Round to 3 decimal places
    echo "Get all EventChangeManagement execution time: " . $executionTime . " milliseconds\n";
}   
public function testCreateEventChangeManagement(): void
{
    EventFactory::createOne(['eventTitle' => 'Gavin Rager']);
    $iri = $this->findIriBy(Event::class, ['eventTitle' => 'Gavin Rager']);
    $startTime = microtime(true);
    $response = static::createClient()->request('POST', '/event_change_managements', [
        'headers' => ['Content-Type' => 'application/ld+json'],
        'json' => [
            'active' => true,
            'afterChanges' => [
                "eventTitle: Pizza Party",
                "startDateTime"=> "2025-01-29 18:30:00",
                "endDateTime"=> "2025-01-29 19:01:00",
                "location: Gosnell",
                "maxAttendees: 20",
            ],
            'beforeChanges' => [
                "eventTitle: Gavin's Pizza Party",
                "startDateTime"=> "2025-01-30 18:30:00",
                "endDateTime"=> "2025-01-30 19:01:00",
                "location: Gollisano",
                "maxAttendees: 20",
            ],
            'description' => 'Initial event change management entry.',
            'versionNum' => 'v1.0.0',
            'eventID' => $iri,
        ]
    ]);
    $endTime = microtime(true);
    $this->assertResponseStatusCodeSame(201);
    $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
    $this->assertJsonContains([
        '@context' => '/contexts/eventChangeManagement',
        '@type' => 'eventChangeManagement',
        'active' => true,
        'afterChanges' => [
            "eventTitle: Pizza Party",
            "startDateTime"=> "2025-01-29 18:30:00",
            "endDateTime"=> "2025-01-29 19:01:00",
            "location: Gosnell",
            "maxAttendees: 20",
        ],
        'beforeChanges' => [
            "eventTitle: Gavin's Pizza Party",
            "startDateTime"=> "2025-01-30 18:30:00",
            "endDateTime"=> "2025-01-30 19:01:00",
            "location: Gollisano",
            "maxAttendees: 20",
        ],
        'description' => 'Initial event change management entry.',
        'versionNum' => 'v1.0.0',
        'eventID' => $iri,
    ]);
    $this->assertMatchesResourceItemJsonSchema(EventChangeManagement::class);
    $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
    $executionTime = round($executionTime, 3); // Round to 3 decimal places
    echo "Create EventChangeManagement execution time: " . $executionTime . " milliseconds\n";
}
    public function testUpdateEventChangeManagement(): void
    {
        // Only create the book we need with a given ISBN
        EventChangeManagementFactory::createOne(['description' => 'Gavin made and oopsie']);

        $client = static::createClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $iri = $this->findIriBy(EventChangeManagement::class, ['description' => 'Gavin made and oopsie']);
        $startTime = microtime(true);
        // Use the PATCH method here to do a partial update
        $client->request('PATCH', $iri, [
            'json' => [
                'versionNum' => 'v69.1.69',
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ]
        ]);
        $endTime = microtime(true);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'description' => 'Gavin made and oopsie',
            'versionNum' => 'v69.1.69',
        ]);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Update EventChangeManagement execution time: " . $executionTime . " milliseconds\n";
    }
    public function testDeleteEventChangeManagement(): void
    {
        // Only create the user we need with a given email
        EventChangeManagementFactory::createOne(['description' => 'Gavin made and oopsie']);

        $client = static::createClient();
        $iri = $this->findIriBy(EventChangeManagement::class, ['description' => 'Gavin made and oopsie']);
        $startTime = microtime(true);
        $client->request('DELETE', $iri);
        $endTime = microtime(true);
        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            // Through the container, you can access all your services from the tests, including the ORM, the mailer, remote API clients...
            static::getContainer()->get('doctrine')->getRepository(EventChangeManagement::class)->findOneBy(['description' => 'Gavin made and oopsie'])
        );
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Delete EventChangeManagement execution time: " . $executionTime . " milliseconds\n";
    }
    
}*/