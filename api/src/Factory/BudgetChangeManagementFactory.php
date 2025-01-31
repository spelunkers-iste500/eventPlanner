<?php

namespace App\Factory;

use App\Entity\budgetChangeManagement;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<budgetChangeManagement>
 */
final class BudgetChangeManagementFactory extends PersistentProxyObjectFactory
{
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct()
    {
    }

    public static function class(): string
    {
        return budgetChangeManagement::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        return [
            'active' => self::faker()->boolean(),
            'afterChanges' => json_encode([
                'regBudget' => self::faker()->randomFloat(2, 1000, 100000),
                'spentBudget' => self::faker()->randomFloat(2, 500, 100000),
                'total' => self::faker()->randomFloat(2, 1500, 200000),
                'vipBudget' => self::faker()->randomFloat(2, 100, 50000),
            ]),
            'beforeChanges' => json_encode([
                'regBudget' => self::faker()->randomFloat(2, 1000, 100000),
                'spentBudget' => self::faker()->randomFloat(2, 500, 100000),
                'total' => self::faker()->randomFloat(2, 1500, 200000),
                'vipBudget' => self::faker()->randomFloat(2, 100, 50000),
            ]),
            'description' => self::faker()->sentence(10),
            'versionNum' => self::faker()->numerify('v#.#.#'),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(budgetChangeManagement $budgetChangeManagement): void {})
        ;
    }
}
