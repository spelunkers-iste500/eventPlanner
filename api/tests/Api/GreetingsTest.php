<?php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;

class GreetingsTest extends ApiTestCase
{
    public function testHomePage(): void
    {
        static::createClient()->request('get', '/');

        $this->assertResponseStatusCodeSame(200);
    }
}
