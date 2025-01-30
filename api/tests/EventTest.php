<?php
// api/tests/Eventtest.php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Event;
use App\Factory\EventFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class EventTest extends ApiTestCase
{
    // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
    use ResetDatabase, Factories;


    public function testCreateEvent(): void
    {
        $response = static::createClient()->request('POST', '/events', [
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                "eventTitle"=> "Pizza Party",
                "startDateTime"=> "2025-01-29T18:30:00+00:00",
                "endDateTime"=> "2025-01-29T19:01:00+00:00",
                "location"=> "Gosnell",
                "maxAttendees"=> 20,
                "lastModified"=> "2025-01-28T18:01:00+00:00",
                "createdDate"=> "2025-01-28T18:01:00+00:00", 
            ]
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
            "lastModified"=> "2025-01-28T18:01:00+00:00",
            "createdDate"=> "2025-01-28T18:01:00+00:00", 

        ]);
        $this->assertMatchesResourceItemJsonSchema(Event::class);
    }
    public function testUpdateUser(): void
    {
        // Only create the book we need with a given ISBN
        EventFactory::createOne(['eventTitle' => 'Gavin Rager']);

        $client = static::createClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $iri = $this->findIriBy(Event::class, ['eventTitle' => 'Gavin Rager']);

        // Use the PATCH method here to do a partial update
        $client->request('PATCH', $iri, [
            'json' => [
                'location' => "Munson's Office",
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ]
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'eventTitle' => 'Gavin Rager',
            'location' => "Munson's Office",
        ]);
    }
    public function testDeleteEvent(): void
    {
        // Only create the user we need with a given email
        EventFactory::createOne(['eventTitle' => 'Gavin Rager']);

        $client = static::createClient();
        $iri = $this->findIriBy(Event::class, ['eventTitle' => 'Gavin Rager']);

        $client->request('DELETE', $iri);

        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            // Through the container, you can access all your services from the tests, including the ORM, the mailer, remote API clients...
            static::getContainer()->get('doctrine')->getRepository(Event::class)->findOneBy(['eventTitle' => 'Gavin Rager'])
        );
    }
    
}