<?php

namespace App\Factory;

use App\Entity\Budget;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<Budget>
 */
final class BudgetFactory extends PersistentProxyObjectFactory
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
        return Budget::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        return [
            'regBudget' => self::faker()->randomFloat(2, 1000, 100000),
            'spentBudget' => self::faker()->randomFloat(2, 500, 100000),
            'total' => self::faker()->randomFloat(2, 1500, 200000),
            'vipBudget' => self::faker()->randomFloat(2, 100, 50000),
            'organization' => OrganizationFactory::createOne(),
            'event' => EventFactory::createOne()
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(Budget $budget): void {})
        ;
    }
}
