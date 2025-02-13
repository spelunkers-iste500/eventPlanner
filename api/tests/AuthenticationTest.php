<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;
use App\Entity\User;
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
        $user = UserFactory::new()->createOne(['name' => 'Test User', 'email' => 'test@example.com']);

        $userpassword = $user -> getPassword();

        // retrieve a token
        $response = $client->request('POST', '/auth', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'id' => $user->getId(), // Use user ID from the created user
                'token' => $userpassword, // Token is from the created account
            ],
        ]);

        $json = $response->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertArrayHasKey('token', $json);

        // test not authorized
        $client->request('GET', '/account');
        $this->assertResponseStatusCodeSame(401);

        // test authorized
        $client->request('GET', '/account', ['auth_bearer' => $json['token']]);
        $this->assertResponseIsSuccessful();
    }
}
