<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;
use App\Factory\AccountFactory;
use App\Factory\UserFactory;

class AuthenticationTest extends ApiTestCase
{
    use Factories;
    use ResetDatabase;

    public function testLogin(): void
    {
        $client = self::createClient();
        
        // Create User and Account using Foundry
        $user = UserFactory::new()
            ->createOne(['name' => 'Test User', 'email' => 'test@example.com']);

        $account = AccountFactory::new()
            ->createOne([
                'providerAccountId' => '12345',
                'userId' => $user->getId(), // Link to created user
                'type' => 'user',
                'provider' => 'test_user',
            ]);

        // retrieve a token
        $response = $client->request('POST', '/auth', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'id' => $user->getId(), // Use user ID from the created user
                'token' => '12345', // Token is from the created account
            ],
        ]);

        $json = $response->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertArrayHasKey('token', $json);

        // test not authorized
        $client->request('GET', '/greetings');
        $this->assertResponseStatusCodeSame(401);

        // test authorized
        $client->request('GET', '/greetings', ['auth_bearer' => $json['token']]);
        $this->assertResponseIsSuccessful();
    }
}
