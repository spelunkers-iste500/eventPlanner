<?php
// api/tests/Eventtest.php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Event;
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

    
}