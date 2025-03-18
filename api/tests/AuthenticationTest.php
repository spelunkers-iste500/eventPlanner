<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;
use App\Factory\UserFactory;
use App\Entity\User;

class AuthenticationTest extends ApiTestCase
{
    use Factories;
    use ResetDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        self::ensureKernelShutdown();
        self::bootKernel();
    }
    public function calculateExecutionTime(float $startTime, string $echoPhrase): string {
        $endTime = microtime(true);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        return $echoPhrase . " execution time: " . $executionTime . " milliseconds\n";
    }
    public function testLogin(): void
    {
        $startTime = microtime(true);
        
        $client = self::createClient();
        $container = self::getContainer();

        // Create User and Account using Foundry
        $user = UserFactory::new()->createOne([
            'email' => 'test@example.com',
            'superAdmin' => true
        ]);
        $user->setPassword(
            $container->get('security.user_password_hasher')->hashPassword($user, 'spleunkers123')
        );
        $user->_save(); //needed when doing the add function
        $userIri = $this->findIriBy(User::class, ['id' => $user->getId()]);
        
        // retrieve a token
        $response = $client->request('POST', '/auth', [
             'headers' => ['Content-Type' => 'application/json'],
             'json' => [
                 'email' => (string) 'test@example.com', // Use user ID from the created user
                 'password' => (string) 'spleunkers123', // user password
             ],
         ]);
        $json = $response->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertArrayHasKey('token', $json);
        // test not authorized
        $client->request('GET', '/organizations');
        $this->assertResponseStatusCodeSame(401);      
        // test authorized
        $client->request('GET', "$userIri", ['auth_bearer' => $json['token']]);
        $this->assertResponseIsSuccessful();
        
        $executionMessage = $this->calculateExecutionTime($startTime, "Auth Test");
        echo $executionMessage;
        }
    }