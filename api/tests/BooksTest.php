<?php
// api/tests/BooksTest.php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Book;
use App\Factory\BookFactory;
use App\Factory\UserFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;
use App\Entity\User;

class BooksTest extends ApiTestCase
{
    use ResetDatabase, Factories;

    private function authenticate(): string
    {
        $client = static::createClient();
        $container = self::getContainer();

        // Create a user using Foundry
        $user = UserFactory::createOne([
            'email' => 'test@example.com',
            'password' => $container->get('security.user_password_hasher')->hashPassword(new User(), '$3CR3T')
        ]);

        // Retrieve a token
        $response = $client->request('POST', '/auth', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'test@example.com',
                'password' => '$3CR3T',
            ],
        ]);

        $json = $response->toArray();
        return $json['token'];
    }

    public function testGetCollection(): void
    {
        $token = $this->authenticate();

        // Create 100 books using our factory
        BookFactory::createMany(100);

        $response = static::createClient()->request('GET', '/books', [
            'headers' => ['Authorization' => 'Bearer ' . $token],
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Book',
            '@id' => '/books',
            '@type' => 'Collection',
            'totalItems' => 100,
            'view' => [
                '@id' => '/books?page=1',
                '@type' => 'PartialCollectionView',
                'first' => '/books?page=1',
                'last' => '/books?page=4',
                'next' => '/books?page=2',
            ],
        ]);
        $this->assertCount(30, $response->toArray()['member']);
        $this->assertMatchesResourceCollectionJsonSchema(Book::class);
    }

    public function testCreateBook(): void
    {
        $token = $this->authenticate();

        $response = static::createClient()->request('POST', '/books', [
            'headers' => ['Authorization' => 'Bearer ' . $token],
            'json' => [
                'isbn' => '0099740915',
                'title' => 'The Handmaid\'s Tale',
                'description' => 'Brilliantly conceived and executed, this powerful evocation of twenty-first century America gives full rein to Margaret Atwood\'s devastating irony, wit and astute perception.',
                'author' => 'Margaret Atwood',
                'publicationDate' => '1985-07-31T00:00:00+00:00',
            ],
        ]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Book',
            '@type' => 'Book',
            'isbn' => '0099740915',
            'title' => 'The Handmaid\'s Tale',
            'description' => 'Brilliantly conceived and executed, this powerful evocation of twenty-first century America gives full rein to Margaret Atwood\'s devastating irony, wit and astute perception.',
            'author' => 'Margaret Atwood',
            'publicationDate' => '1985-07-31T00:00:00+00:00',
            'reviews' => [],
        ]);
        $this->assertMatchesRegularExpression('~^/books/\d+$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(Book::class);
    }

    public function testCreateInvalidBook(): void
    {
        $token = $this->authenticate();
    
        static::createClient()->request('POST', '/books', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'isbn' => 'invalid',
            ],
        ]);
    
        $this->assertResponseStatusCodeSame(415);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
    
        $this->assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'title' => 'An error occurred',
            'description' => 'isbn: This value is neither a valid ISBN-10 nor a valid ISBN-13.
    title: This value should not be blank.
    description: This value should not be blank.
    author: This value should not be blank.
    publicationDate: This value should not be null.',
        ]);
    }

    public function testUpdateBook(): void
    {
        $token = $this->authenticate();

        // Only create the book we need with a given ISBN
        BookFactory::createOne(['isbn' => '9781344037075']);

        $client = static::createClient();
        $iri = $this->findIriBy(Book::class, ['isbn' => '9781344037075']);

        $client->request('PATCH', $iri, [
            'headers' => ['Authorization' => 'Bearer ' . $token],
            'json' => [
                'title' => 'updated title',
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ]
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'isbn' => '9781344037075',
            'title' => 'updated title',
        ]);
    }

    public function testDeleteBook(): void
    {
        $token = $this->authenticate();

        // Only create the book we need with a given ISBN
        BookFactory::createOne(['isbn' => '9781344037075']);

        $client = static::createClient();
        $iri = $this->findIriBy(Book::class, ['isbn' => '9781344037075']);

        $client->request('DELETE', $iri, [
            'headers' => ['Authorization' => 'Bearer ' . $token],
        ]);

        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            static::getContainer()->get('doctrine')->getRepository(Book::class)->findOneBy(['isbn' => '9781344037075'])
        );
    }
}