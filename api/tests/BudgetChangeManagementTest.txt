<?php
// api/tests/BudgetChangeManagementtest.php
/*
namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\BudgetChangeManagement;
use App\Entity\User;
use App\Entity\Budget;
use App\Factory\BudgetFactory;
use App\Factory\BudgetChangeManagementFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class BudgetChangeManagementTest extends ApiTestCase
{
    // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
    use ResetDatabase, Factories;

    public function testGetBudgetChangeManagementCollection(): void
{
    // Create 50 budgetChangeManagement using our factory
    BudgetChangeManagementFactory::createMany(50);
    $startTime = microtime(true);
    // The client implements Symfony HttpClient's `HttpClientInterface`, and the response `ResponseInterface`
    $response = static::createClient()->request('GET', '/budget_change_managements');
    $endTime = microtime(true);
    $this->assertResponseIsSuccessful();
    // Asserts that the returned content type is JSON-LD (the default)
    $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

    // Asserts that the returned JSON is a superset of this one
    $this->assertJsonContains([
        '@context' => '/contexts/budgetChangeManagement',
        '@id' => '/budget_change_managements',
        '@type' => 'hydra:Collection',
        'hydra:totalItems' => 50,
        'hydra:view' => [
            '@id' => '/budget_change_managements?page=1',
            '@type' => 'hydra:PartialCollectionView',
            'hydra:first' => '/budget_change_managements?page=1',
            'hydra:last' => '/budget_change_managements?page=2',
            'hydra:next' => '/budget_change_managements?page=2',
        ],
    ]);

    // Because test fixtures are automatically loaded between each test, you can assert on them
    $this->assertCount(30, $response->toArray()['hydra:member']);

    // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
    // This generated JSON Schema is also used in the OpenAPI spec!
    $this->assertMatchesResourceCollectionJsonSchema(BudgetChangeManagement::class);
    $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
    $executionTime = round($executionTime, 3); // Round to 3 decimal places
    echo "Get all budgetChangeManagement execution time: " . $executionTime . " milliseconds\n";
}   
public function testCreateBudgetChangeManagement(): void
{
    BudgetFactory::createOne(['regBudget' => 80000.69]);
    $iri = $this->findIriBy(Budget::class, ['regBudget' => 80000.69]);
    $startTime = microtime(true);
    $response = static::createClient()->request('POST', '/budget_change_managements', [
        'headers' => ['Content-Type' => 'application/ld+json'],
        'json' => [
            'active' => true,
            'afterChanges' => [
                'regBudget: 80000.69',
                'spentBudget: 50000',
                'total: 100000',
                'vipBudget: 20000',
            ],
            'beforeChanges' => [
                'regBudget: 75000',
                'spentBudget: 45000',
                'total: 95000',
                'vipBudget: 15000',
            ],
            'description' => 'Initial budget change management entry.',
            'versionNum' => 'v1.0.0',
            'budgetID' => $iri,
        ]
    ]);
    $endTime = microtime(true);
    $this->assertResponseStatusCodeSame(201);
    $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
    $this->assertJsonContains([
        '@context' => '/contexts/budgetChangeManagement',
        '@type' => 'budgetChangeManagement',
        'active' => true,
        'afterChanges' => [
            'regBudget: 80000.69',
            'spentBudget: 50000',
            'total: 100000',
            'vipBudget: 20000',
        ],
        'beforeChanges' => [
            'regBudget: 75000',
            'spentBudget: 45000',
            'total: 95000',
            'vipBudget: 15000',
        ],
        'description' => 'Initial budget change management entry.',
        'versionNum' => 'v1.0.0',
        'budgetID' => $iri,
    ]);
    $this->assertMatchesResourceItemJsonSchema(BudgetChangeManagement::class);
    $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
    $executionTime = round($executionTime, 3); // Round to 3 decimal places
    echo "Create BudgetChangeManagement execution time: " . $executionTime . " milliseconds\n";
}
    public function testUpdateBudgetChangeManagement(): void
    {
        // Only create the book we need with a given ISBN
        BudgetChangeManagementFactory::createOne(['description' => 'Gavin made and oopsie']);

        $client = static::createClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $iri = $this->findIriBy(BudgetChangeManagement::class, ['description' => 'Gavin made and oopsie']);
        $startTime = microtime(true);
        // Use the PATCH method here to do a partial update
        $client->request('PATCH', $iri, [
            'json' => [
                'versionNum' => 'v69.1.69',
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ]
        ]);
        $endTime = microtime(true);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'description' => 'Gavin made and oopsie',
            'versionNum' => 'v69.1.69',
        ]);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Update BudgetChangeManagement execution time: " . $executionTime . " milliseconds\n";
    }
    public function testDeleteBudgetChangeManagement(): void
    {
        // Only create the user we need with a given email
        BudgetChangeManagementFactory::createOne(['description' => 'Gavin made and oopsie']);

        $client = static::createClient();
        $iri = $this->findIriBy(BudgetChangeManagement::class, ['description' => 'Gavin made and oopsie']);
        $startTime = microtime(true);
        $client->request('DELETE', $iri);
        $endTime = microtime(true);
        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            // Through the container, you can access all your services from the tests, including the ORM, the mailer, remote API clients...
            static::getContainer()->get('doctrine')->getRepository(BudgetChangeManagement::class)->findOneBy(['description' => 'Gavin made and oopsie'])
        );
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Delete BudgetChangeManagement execution time: " . $executionTime . " milliseconds\n";
    }
    
}*/