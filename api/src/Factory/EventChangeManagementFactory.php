<?php

namespace App\Factory;

use App\Entity\eventChangeManagement;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<eventChangeManagement>
 */
final class EventChangeManagementFactory extends PersistentProxyObjectFactory
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
        return eventChangeManagement::class;
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
                'endDateTime' => self::faker()->dateTimeBetween('+1 week', '+1 month'),
                'eventTitle' => self::faker()->sentence(5),
                'location' => self::faker()->address(),
                'maxAttendees' => self::faker()->numberBetween(1, 20),
                'startDateTime' => self::faker()->dateTimeBetween('now', '+1 week'),
                'active' => self::faker()->boolean(),
            ]),
            'beforeChanges' => json_encode([
                'endDateTime' => self::faker()->dateTimeBetween('+1 week', '+1 month'),
                'eventTitle' => self::faker()->sentence(5),
                'location' => self::faker()->address(),
                'maxAttendees' => self::faker()->numberBetween(1, 20),
                'startDateTime' => self::faker()->dateTimeBetween('now', '+1 week'),
                'active' => self::faker()->boolean(),
            ]),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(eventChangeManagement $eventChangeManagement): void {})
        ;
    }
}
