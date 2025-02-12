<?php

namespace App\Factory;

use App\Entity\Account;
use App\Entity\User;
use Zenstruck\Foundry\Model\Factory;
use Zenstruck\Foundry\Proxy;

class AccountFactory extends Factory
{
    protected function initialize(): self
    {
        return $this->afterInstantiate(function (Account $account) {
            // If no user is passed, create one and link it to the account
            if (!$account->getUserId()) {
                $user = UserFactory::new()->createOne(); // Creates a new User
                $account->setUserId($user->getId()); // Links the account to the created user
            }
        });
    }

    protected function getDefaults(): array|callable
    {
        return [
            'provider' => self::faker()->randomElement(['google', 'github', 'email']),
            'providerAccountId' => self::faker()->uuid(),
            'type' => self::faker()->randomElement(['oauth', 'email']),
            'userId' => null, // Will be set when linking to a user
            'refreshToken' => self::faker()->sha256(),
            'accessToken' => self::faker()->sha256(),
            'expiresAt' => self::faker()->dateTimeBetween('now', '+1 year'),
            'idToken' => self::faker()->sha256(),
            'scope' => self::faker()->word(),
            'sessionState' => self::faker()->sha256(),
            'tokenType' => self::faker()->randomElement(['Bearer', 'JWT']),
        ];
    }

    protected static function getEntityClass(): string
    {
        return Account::class;
    }
}
