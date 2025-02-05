<?php
// api/tests/Eventtest.php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Flight;
use App\Entity\Event;
use App\Factory\EventFactory;
use App\Factory\FlightFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class FlightTest extends ApiTestCase
{
    // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
    use ResetDatabase, Factories;


    public function testCreateFlight(): void
    {
        EventFactory::createOne(['eventTitle' => 'Gavin Rager']);
        $iri = $this->findIriBy(Event::class, ['eventTitle' => 'Gavin Rager']);
        $startTime = microtime(true);
        $response = static::createClient()->request('POST', '/flights', [
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                "flightNumber"=> "420",
                "eventID"=> "$iri",
                "departureTime"=> "2025-02-01T17:24:40+00:00",
                "arrivalTime"=> "2025-02-01T17:24:40+00:00",
                "departureLocation"=> "Buffalo Airport",
                "arrivalLocation" => "Baltimore Washington International",
                "airline"=> "SouthWest Airline",
                "flightTracker"=> "https://maps.google.com",
            ]
        ]);
        $endTime = microtime(true);
        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Flight',
            '@type' => 'Flight',
            "flightNumber"=> "420",
            "eventID"=> "$iri",
            "departureTime"=> "2025-02-01T17:24:40+00:00",
            "arrivalTime"=> "2025-02-01T17:24:40+00:00",
            "departureLocation"=> "Buffalo Airport",
            "arrivalLocation" => "Baltimore Washington International",
            "airline"=> "SouthWest Airline",
            "flightTracker"=> "https://maps.google.com", 

        ]);
        $this->assertMatchesResourceItemJsonSchema(Flight::class);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Create Flight execution time: " . $executionTime . " milliseconds\n";
    }
    public function testUpdateFlight(): void
    {
        // Only create the book we need with a given ISBN
        FlightFactory::createOne(["flightNumber"=> "1234"]);

        $client = static::createClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $iri = $this->findIriBy(Flight::class, ["flightNumber"=> "1234"]);
        $startTime = microtime(true);
        // Use the PATCH method here to do a partial update
        $client->request('PATCH', $iri, [
            'json' => [
                "departureLocation"=> "The White House",
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ]
        ]);
        $endTime = microtime(true);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            "departureLocation"=> "The White House",
            "flightNumber"=> "1234",
        ]);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Update Flight execution time: " . $executionTime . " milliseconds\n";
    }
    public function testDeleteFlight(): void
    {
        // Only create the user we need with a given email
        FlightFactory::createOne(["flightNumber"=> "1234"]);

        $client = static::createClient();
        $iri = $this->findIriBy(Flight::class, ["flightNumber"=> "1234"]);
        $startTime = microtime(true);
        $client->request('DELETE', $iri);
        $endTime = microtime(true);
        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            // Through the container, you can access all your services from the tests, including the ORM, the mailer, remote API clients...
            static::getContainer()->get('doctrine')->getRepository(Flight::class)->findOneBy(["flightNumber"=> "1234"])
        );
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Delete Flight execution time: " . $executionTime . " milliseconds\n";
    }
    
}