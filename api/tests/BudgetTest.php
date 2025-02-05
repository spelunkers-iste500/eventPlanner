<?php
// api/tests/Eventtest.php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Budget;
use App\Entity\User;
use App\Factory\UserFactory;
use App\Factory\BudgetFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class BudgetTest extends ApiTestCase
{
    // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
    use ResetDatabase, Factories;


    public function testCreateBudget(): void
    {
        UserFactory::createOne(['email' => 'ratchie@rit.edu']);
        $iri = $this->findIriBy(User::class, ['email' => 'ratchie@rit.edu']);
        $startTime = microtime(true);
        $response = static::createClient()->request('POST', '/budgets', [
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                "total"=> "100000.00",
                "spentBudget"=> "50000.00",
                "vipBudget"=> "20000.00",
                "regBudget"=> "80000.00",
                "financialPlannerID"=> "$iri",
            ]
        ]);
        $endTime = microtime(true);
        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Budget',
            '@type' => 'Budget',
            "total"=> "100000.00",
            "spentBudget"=> "50000.00",
            "vipBudget"=> "20000.00",
            "regBudget"=> "80000.00",
            "financialPlannerID"=> "$iri", 

        ]);
        $this->assertMatchesResourceItemJsonSchema(Budget::class);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Create Budget execution time: " . $executionTime . " milliseconds\n";
    }
    public function testUpdateBudget(): void
    {
        // Only create the book we need with a given ISBN
        BudgetFactory::createOne(["total"=> "420.69"]);

        $client = static::createClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $iri = $this->findIriBy(Budget::class, ["total"=> "420.69"]);
        $startTime = microtime(true);
        // Use the PATCH method here to do a partial update
        $client->request('PATCH', $iri, [
            'json' => [
                "vipBudget"=> "6969.11",
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ]
        ]);
        $endTime = microtime(true);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            "vipBudget"=> "6969.11",
            "total"=> "420.69",
        ]);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Update Budget execution time: " . $executionTime . " milliseconds\n";
    }
    public function testDeleteBudget(): void
    {
        // Only create the user we need with a given email
        BudgetFactory::createOne(["total"=> "420.69"]);

        $client = static::createClient();
        $iri = $this->findIriBy(Budget::class, ["total"=> "420.69"]);
        $startTime = microtime(true);
        $client->request('DELETE', $iri);
        $endTime = microtime(true);
        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            // Through the container, you can access all your services from the tests, including the ORM, the mailer, remote API clients...
            static::getContainer()->get('doctrine')->getRepository(Budget::class)->findOneBy(["total"=> "420.69"])
        );
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Delete Budget execution time: " . $executionTime . " milliseconds\n";
    }
    
}