<?php

namespace App\Factory;

use App\Entity\Account;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<Account>
 */
final class AccountFactory extends PersistentProxyObjectFactory
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
        return Account::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        return [
            'provider' => self::faker()->randomElement(['google', 'github', 'email']),
        'providerAccountId' => self::faker()->uuid(),
        'type' => self::faker()->randomElement(['oauth', 'email']),
        'userId' => self::faker()->randomNumber(),
        'refreshToken' => self::faker()->sha256(),
        'accessToken' => self::faker()->sha256(),
        'expiresAt' => self::faker()->dateTimeBetween('now', '+1 year')->format('Y-m-d\TH:i:s\Z'),
        'idToken' => self::faker()->sha256(),
        'scope' => self::faker()->word(),
        'sessionState' => self::faker()->sha256(),
        'tokenType' => self::faker()->randomElement(['Bearer', 'JWT']),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(Account $account): void {})
        ;
    }
}
