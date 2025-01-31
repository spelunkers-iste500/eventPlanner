<?php

namespace App\Factory;

use App\Entity\Flight;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<Flight>
 */
final class FlightFactory extends PersistentProxyObjectFactory
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
        return Flight::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        return [
           'airline' => self::faker()->randomElement([
                'American Airlines', 'Delta Air Lines', 'United Airlines', 'Southwest Airlines', 
                'JetBlue Airways', 'Alaska Airlines', 'Spirit Airlines', 'Frontier Airlines'
            ]),
            'arrivalLocation' => self::faker()->city(),
            'arrivalTime' => self::faker()->dateTimeBetween('now', '+1 year'),
            'departureLocation' => self::faker()->city(),
            'departureTime' => self::faker()->dateTimeBetween('now', '+1 year'),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(Flight $flight): void {})
        ;
    }
}
