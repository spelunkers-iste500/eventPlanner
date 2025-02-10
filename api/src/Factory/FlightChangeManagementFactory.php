<?php

namespace App\Factory;

use App\Entity\flightChangeManagement;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<flightChangeManagement>
 */
final class FlightChangeManagementFactory extends PersistentProxyObjectFactory
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
        return flightChangeManagement::class;
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
            'description' => self::faker()->text(255),
            'versionNum' => self::faker()->numerify('v#.#.#'),
            'afterChanges' => json_encode([
                'airline' => self::faker()->randomElement([
                    'American Airlines', 'Delta Air Lines', 'United Airlines', 'Southwest Airlines', 
                    'JetBlue Airways', 'Alaska Airlines', 'Spirit Airlines', 'Frontier Airlines'
                ]),
                'arrivalLocation' => self::faker()->city(),
                'arrivalTime' => self::faker()->dateTimeBetween('now', '+1 year'),
                'departureLocation' => self::faker()->city(),
                'departureTime' => self::faker()->dateTimeBetween('now', '+1 year'),
            ]),
            'beforeChanges' => json_encode([
                'airline' => self::faker()->randomElement([
                    'American Airlines', 'Delta Air Lines', 'United Airlines', 'Southwest Airlines', 
                    'JetBlue Airways', 'Alaska Airlines', 'Spirit Airlines', 'Frontier Airlines'
                ]),
                'arrivalLocation' => self::faker()->city(),
                'arrivalTime' => self::faker()->dateTimeBetween('now', '+1 year'),
                'departureLocation' => self::faker()->city(),
                'departureTime' => self::faker()->dateTimeBetween('now', '+1 year'),
            ]),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(flightChangeManagement $flightChangeManagement): void {})
        ;
    }
}
