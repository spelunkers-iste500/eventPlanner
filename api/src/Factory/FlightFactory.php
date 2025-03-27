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
            'flightCost' => self::faker()->randomNumber(4), // Random flight cost
            'departureDateTime' => self::faker()->dateTimeBetween('-1 year', '+1 year'), // Nullable departure date
            'arrivalDateTime' => self::faker()->dateTimeBetween('-1 year', '+1 year'), // Nullable arrival date
            'departureLocation' => self::faker()->city(), // Nullable departure location
            'arrivalLocation' => self::faker()->city(), // Nullable arrival location
            'flightNumber' => self::faker()->regexify('[A-Z]{2}[0-9]{3,4}'), // Nullable flight number
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
