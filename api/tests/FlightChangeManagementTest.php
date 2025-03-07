<?php
// api/tests/FlightChangeManagementtest.php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\FlightChangeManagement;
use App\Entity\Flight;
use App\Entity\Event;
use App\Factory\EventFactory;
use App\Factory\FlightFactory;
use App\Factory\FlightChangeManagementFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;
/*
class FlightChangeManagementTest extends ApiTestCase
{
    // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
    use ResetDatabase, Factories;

    public function testGetFlightChangeManagementCollection(): void
{
    // Create 50 FlightChangeManagement using our factory
    FlightChangeManagementFactory::createMany(50);
    $startTime = microtime(true);
    // The client implements Symfony HttpClient's `HttpClientInterface`, and the response `ResponseInterface`
    $response = static::createClient()->request('GET', '/flight_change_managements');
    $endTime = microtime(true);
    $this->assertResponseIsSuccessful();
    // Asserts that the returned content type is JSON-LD (the default)
    $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

    // Asserts that the returned JSON is a superset of this one
    $this->assertJsonContains([
        '@context' => '/contexts/flightChangeManagement',
        '@id' => '/flight_change_managements',
        '@type' => 'hydra:Collection',
        'hydra:totalItems' => 50,
        'hydra:view' => [
            '@id' => '/flight_change_managements?page=1',
            '@type' => 'hydra:PartialCollectionView',
            'hydra:first' => '/flight_change_managements?page=1',
            'hydra:last' => '/flight_change_managements?page=2',
            'hydra:next' => '/flight_change_managements?page=2',
        ],
    ]);

    // Because test fixtures are automatically loaded between each test, you can assert on them
    $this->assertCount(30, $response->toArray()['hydra:member']);

    // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
    // This generated JSON Schema is also used in the OpenAPI spec!
    $this->assertMatchesResourceCollectionJsonSchema(FlightChangeManagement::class);
    $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
    $executionTime = round($executionTime, 3); // Round to 3 decimal places
    echo "Get all FlightChangeManagement execution time: " . $executionTime . " milliseconds\n";
}   
public function testCreateFlightChangeManagement(): void
{
    EventFactory::createOne(['eventTitle' => 'Gavin Rager']);
    $eventiri = $this->findIriBy(Event::class, ['eventTitle' => 'Gavin Rager']);
    FlightFactory::createOne(["flightNumber"=> "1234"]);
    $iri = $this->findIriBy(Flight::class, ["flightNumber"=> "1234"]);
    $startTime = microtime(true);
    $response = static::createClient()->request('POST', '/flight_change_managements', [
        'headers' => ['Content-Type' => 'application/ld+json'],
        'json' => [
            'active' => true,
            'afterChanges' => [
                "flightNumber: 420",
                "eventID: $eventiri",
                "departureTime: 2025-02-01 17:24:40",
                "arrivalTime: 2025-02-01 17:24:40",
                "departureLocation: Buffalo Airport",
                "arrivalLocation: Baltimore Washington International",
                "airline: SouthWest",
                "flightTracker: https://maps.google.com",
            ],
            'beforeChanges' => [
                "flightNumber: 421",
                "eventID: $eventiri",
                "departureTime: 2025-02-02 17:25:40",
                "arrivalTime: 2025-02-02 18:25:40",
                "departureLocation: Buffalo Airport",
                "arrivalLocation: Baltimore Washington International",
                "airline: Jet Blue",
                "flightTracker: https://maps.google.com",
            ],
            'description' => 'Initial flight change management entry.',
            'versionNum' => 'v1.0.0',
            'flightID' => $iri,
        ]
    ]);
    $endTime = microtime(true);
    $this->assertResponseStatusCodeSame(201);
    $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
    $this->assertJsonContains([
        '@context' => '/contexts/flightChangeManagement',
        '@type' => 'flightChangeManagement',
        'active' => true,
        'afterChanges' => [
            "flightNumber: 420",
            "eventID: $eventiri",
            "departureTime: 2025-02-01 17:24:40",
            "arrivalTime: 2025-02-01 17:24:40",
            "departureLocation: Buffalo Airport",
            "arrivalLocation: Baltimore Washington International",
            "airline: SouthWest",
            "flightTracker: https://maps.google.com",
        ],
        'beforeChanges' => [
            "flightNumber: 421",
            "eventID: $eventiri",
            "departureTime: 2025-02-02 17:25:40",
            "arrivalTime: 2025-02-02 18:25:40",
            "departureLocation: Buffalo Airport",
            "arrivalLocation: Baltimore Washington International",
            "airline: Jet Blue",
            "flightTracker: https://maps.google.com",
        ],
        'description' => 'Initial flight change management entry.',
        'versionNum' => 'v1.0.0',
        'flightID' => $iri,
    ]);
    $this->assertMatchesResourceItemJsonSchema(FlightChangeManagement::class);
    $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
    $executionTime = round($executionTime, 3); // Round to 3 decimal places
    echo "Create FlightChangeManagement execution time: " . $executionTime . " milliseconds\n";
}
    public function testUpdateFlightChangeManagement(): void
    {
        // Only create the book we need with a given ISBN
        FlightChangeManagementFactory::createOne(['description' => 'Gavin made and oopsie']);

        $client = static::createClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $iri = $this->findIriBy(FlightChangeManagement::class, ['description' => 'Gavin made and oopsie']);
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
        echo "Update FlightChangeManagement execution time: " . $executionTime . " milliseconds\n";
    }
    public function testDeleteFlightChangeManagement(): void
    {
        // Only create the user we need with a given email
        FlightChangeManagementFactory::createOne(['description' => 'Gavin made and oopsie']);

        $client = static::createClient();
        $iri = $this->findIriBy(FlightChangeManagement::class, ['description' => 'Gavin made and oopsie']);
        $startTime = microtime(true);
        $client->request('DELETE', $iri);
        $endTime = microtime(true);
        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            // Through the container, you can access all your services from the tests, including the ORM, the mailer, remote API clients...
            static::getContainer()->get('doctrine')->getRepository(FlightChangeManagement::class)->findOneBy(['description' => 'Gavin made and oopsie'])
        );
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Delete FlightChangeManagement execution time: " . $executionTime . " milliseconds\n";
    }
    
}*/