<?php
// api/tests/Eventtest.php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Organization;
use App\Factory\OrganizationFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class OrganizationTest extends ApiTestCase
{
    // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
    use ResetDatabase, Factories;


    public function testCreateOrganization(): void
    {
        $startTime = microtime(true);
        $response = static::createClient()->request('POST', '/organizations', [
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                "name"=> "Information Technology Services",
                "address"=> "1 Lomb Memorial Dr, Rochester, NY 14623",
                "description"=> "super cool description",
                "industry"=> "Information Technology",
                "primaryEmail"=> "ritchie@rit.edu",
                "secondaryEmail"=> "ratchie@rit.edu", 
            ]
        ]);
        $endTime = microtime(true);
        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Organization',
            '@type' => 'Organization',
            "name"=> "Information Technology Services",
            "address"=> "1 Lomb Memorial Dr, Rochester, NY 14623",
            "description"=> "super cool description",
            "industry"=> "Information Technology",
            "primaryEmail"=> "ritchie@rit.edu",
            "secondaryEmail"=> "ratchie@rit.edu", 

        ]);
        $this->assertMatchesResourceItemJsonSchema(Organization::class);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Create Organization execution time: " . $executionTime . " milliseconds\n";
    }
    public function testUpdateOrganization(): void
    {
        // Only create the book we need with a given ISBN
        OrganizationFactory::createOne(["name"=> "Information Technology Services"]);

        $client = static::createClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $iri = $this->findIriBy(Organization::class, ["name"=> "Information Technology Services"]);
        $startTime = microtime(true);
        // Use the PATCH method here to do a partial update
        $client->request('PATCH', $iri, [
            'json' => [
                "description"=> "This is a super cool description"
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ]
        ]);
        $endTime = microtime(true);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            "name"=> "Information Technology Services",
            "description"=> "This is a super cool description"
        ]);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Update Organization execution time: " . $executionTime . " milliseconds\n";
    }
    public function testDeleteOrganization(): void
    {
        // Only create the user we need with a given email
        OrganizationFactory::createOne(["name"=> "Information Technology Services"]);

        $client = static::createClient();
        $iri = $this->findIriBy(Organization::class, ["name"=> "Information Technology Services"]);
        $startTime = microtime(true);
        $client->request('DELETE', $iri);
        $endTime = microtime(true);
        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            // Through the container, you can access all your services from the tests, including the ORM, the mailer, remote API clients...
            static::getContainer()->get('doctrine')->getRepository(Organization::class)->findOneBy(["name"=> "Information Technology Services"])
        );
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Delete Organization execution time: " . $executionTime . " milliseconds\n";
    }
    
}