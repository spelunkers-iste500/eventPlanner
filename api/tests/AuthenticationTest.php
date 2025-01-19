<?php
// tests/AuthenticationTest.php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Factory\UserFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;
use App\Entity\User;

class AuthenticationTest extends ApiTestCase
{
    use Factories;
    use ResetDatabase;

    public function testLogin(): void
    {
        $client = self::createClient();
        $container = self::getContainer();

        // Create a user using Foundry
        $user = UserFactory::createOne([
            'email' => 'test@example.com',
            'password' => $container->get('security.user_password_hasher')->hashPassword(new User(), '$3CR3T')
        ]);

        // retrieve a token
        $response = $client->request('POST', '/auth', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'test@example.com',
                'password' => '$3CR3T',
            ],
        ]);

        $json = $response->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertArrayHasKey('token', $json);

        // test not authorized
        $client->request('GET', '/books');
        $this->assertResponseStatusCodeSame(401);

        // test authorized
        $client->request('GET', '/books', ['auth_bearer' => $json['token']]);
        $this->assertResponseIsSuccessful();
    }
}