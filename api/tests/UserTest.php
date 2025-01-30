<?php
// api/tests/usertest.php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;
use App\Factory\UserFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class UserTest extends ApiTestCase
{
    // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
    use ResetDatabase, Factories;


    public function testCreateUser(): void
    {
        $response = static::createClient()->request('POST', '/users', [
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                'name' => 'Ritchie',
                'email' => 'ritchie@rit.edu',
                'emailVerified' => '2025-01-28T18:01:00+00:00',
                'image' => 'https://www.rit.edu/blog/sites/rit.edu.blog/files/styles/blog_author_600_x_600_focused_/public/images/blog-author/Screen%20Shot%202021-03-24%20at%209.45.15%20AM.png?h=687e6f5a&itok=V2F-hH8I',
                'lastModified' => '2025-01-28T18:01:00+00:00',
                'createdDate' => '2025-01-28T18:01:00+00:00',
            ]
        ]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/User',
            '@type' => 'User',
            'name' => 'Ritchie',
            'email' => 'ritchie@rit.edu',
            'emailVerified' => '2025-01-28T18:01:00+00:00',
            'image' => 'https://www.rit.edu/blog/sites/rit.edu.blog/files/styles/blog_author_600_x_600_focused_/public/images/blog-author/Screen%20Shot%202021-03-24%20at%209.45.15%20AM.png?h=687e6f5a&itok=V2F-hH8I',
            'lastModified' => '2025-01-28T18:01:00+00:00',
            'createdDate' => '2025-01-28T18:01:00+00:00',
        ]);
        $this->assertMatchesResourceItemJsonSchema(User::class);
    }
    public function testUpdateUser(): void
    {
        // Only create the book we need with a given ISBN
        UserFactory::createOne(['email' => 'ratchie@rit.edu']);

        $client = static::createClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $iri = $this->findIriBy(User::class, ['email' => 'ratchie@rit.edu']);

        // Use the PATCH method here to do a partial update
        $client->request('PATCH', $iri, [
            'json' => [
                'name' => 'Ratchie the Tiger',
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ]
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'email' => 'ratchie@rit.edu',
            'name' => 'Ratchie the Tiger',
        ]);
    }
    public function testDeleteUser(): void
    {
        // Only create the user we need with a given email
        UserFactory::createOne(['email' => 'ratchie@rit.edu']);

        $client = static::createClient();
        $iri = $this->findIriBy(User::class, ['email' => 'ratchie@rit.edu']);

        $client->request('DELETE', $iri);

        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            // Through the container, you can access all your services from the tests, including the ORM, the mailer, remote API clients...
            static::getContainer()->get('doctrine')->getRepository(User::class)->findOneBy(['email' => 'ratchie@rit.edu'])
        );
    }
}