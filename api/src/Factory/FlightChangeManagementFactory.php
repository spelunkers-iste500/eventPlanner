<?php

namespace App\Factory;

use App\Entity\ChangeManagement\flightChangeManagement;
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
            'afterChanges' =>[
                'airline: ' . self::faker()->randomElement([
                    'American Airlines', 'Delta Air Lines', 'United Airlines', 'Southwest Airlines', 
                    'JetBlue Airways', 'Alaska Airlines', 'Spirit Airlines', 'Frontier Airlines'
                ]),
                'arrivalLocation: ' . self::faker()->city(),
                'arrivalTime: ' . self::faker()->dateTimeBetween('now', '+1 year')->format('Y-m-d H:i:s'),
                'departureLocation: ' . self::faker()->city(),
                'departureTime: ' . self::faker()->dateTimeBetween('now', '+1 year')->format('Y-m-d H:i:s'),
            ],
            'beforeChanges' => [
                'airline: ' . self::faker()->randomElement([
                    'American Airlines', 'Delta Air Lines', 'United Airlines', 'Southwest Airlines', 
                    'JetBlue Airways', 'Alaska Airlines', 'Spirit Airlines', 'Frontier Airlines'
                ]),
                'arrivalLocation: ' . self::faker()->city(),
                'arrivalTime: ' . self::faker()->dateTimeBetween('now', '+1 year')->format('Y-m-d H:i:s'),
                'departureLocation: ' . self::faker()->city(),
                'departureTimeL ' . self::faker()->dateTimeBetween('now', '+1 year')->format('Y-m-d H:i:s'),
                'flightNumber: ' . self::faker()->regexify('[A-Z]{2}[0-9]{1,17}'),
                'flightTracker: ' . self::faker()->regexify('https://www\.flighttracker\.com/[A-Za-z0-9]{1,240}')
            ],
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
