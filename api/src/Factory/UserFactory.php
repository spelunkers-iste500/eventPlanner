<?php

namespace App\Factory;

use App\Entity\User;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * @extends PersistentProxyObjectFactory<User>
 */
final class UserFactory extends PersistentProxyObjectFactory
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
        return User::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        return [
            'firstName' => self::faker()->firstName(), // Generates a realistic first name
            'lastName' => self::faker()->lastName(), // Generates a realistic last name
            'birthday' => self::faker()->dateTimeBetween('-100 years', '-18 years'), // Ensures the birthday is for an adult
            'email' => self::faker()->unique()->safeEmail(), // Generates a realistic email address
            'emailVerified' => true,
            'gender' => self::faker()->randomElement(['m', 'f']), // More realistic gender options
            'hashed_password' => self::faker()->password(), // Generates a realistic password hash
            'phoneNumber' => self::faker()->numerify('+###########'), // Generates a phone 
            'superAdmin' => false,
            'title' => self::faker()->randomElement(['mr', 'mrs', 'ms', 'dr', 'miss']), // Generates a realistic title ['mr', 'mrs', 'ms', 'dr', 'miss']
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(User $user): void {})
        ;
    }
}
