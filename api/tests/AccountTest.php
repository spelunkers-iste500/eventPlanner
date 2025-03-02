<?php
// api/tests/Eventtest.php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Account;
use App\Factory\UserFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;
/*
class AccountTest extends ApiTestCase
{
    // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
    use ResetDatabase, Factories;

    public function testGetAccountCollection(): void
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
        // Create 50 Organizations using our factory
        UserFactory::createMany(50);
        $startTime = microtime(true);
        // The client implements Symfony HttpClient's `HttpClientInterface`, and the response `ResponseInterface`
        $response = static::createClient()->request('GET', '/accounts',['auth_bearer' => $json['token']]);
        $endTime = microtime(true);
        $this->assertResponseIsSuccessful();
        // Asserts that the returned content type is JSON-LD (the default)
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/contexts/Account',
            '@id' => '/accounts',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 51,
            'hydra:view' => [
                '@id' => '/accounts?page=1',
                '@type' => 'hydra:PartialCollectionView',
                'hydra:first' => '/accounts?page=1',
                'hydra:last' => '/accounts?page=2',
                'hydra:next' => '/accounts?page=2',
            ],
        ]);

        // Because test fixtures are automatically loaded between each test, you can assert on them
        $this->assertCount(30, $response->toArray()['hydra:member']);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        // This generated JSON Schema is also used in the OpenAPI spec!
        
        $this->assertMatchesResourceCollectionJsonSchema(Account::class);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Get all Accounts execution time: " . $executionTime . " milliseconds\n";
    }
}*/