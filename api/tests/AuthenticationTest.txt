<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;
use App\Factory\UserFactory;

 class AuthenticationTest extends ApiTestCase
 {
     use Factories;
     use ResetDatabase;
     public function testLogin(): void
     {
         $client = self::createClient();;      
         // Create User and Account using Foundry
         $user = UserFactory::new()->createOne([
             'email' => 'test@example.com',
             'plainPassword' => 'spleunkers123',
             'superAdmin' => true
         ]);
         $startTime = microtime(true);
         // retrieve a token
         $response = $client->request('POST', '/auth', [
             'headers' => ['Content-Type' => 'application/json'],
             'json' => [
                 'email' => (string) 'test@example.com', // Use user ID from the created user
                 'token' => (string) 'spleunkers123', // user password
             ],
         ]);
         $json = $response->toArray();
         $this->assertResponseIsSuccessful();
         $this->assertArrayHasKey('token', $json);
         // test not authorized
         $client->request('GET', '/organizations');
         $this->assertResponseStatusCodeSame(401);;      
         // test authorized
         $client->request('GET', '/organizations', ['auth_bearer' => $json['token']]);
         $this->assertResponseIsSuccessful();
         $endTime = microtime(true);
         $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
         $executionTime = round($executionTime, 3); // Round to 3 decimal places
         echo "Authentication Test execution time: " . $executionTime . " milliseconds\n";
        }
    }