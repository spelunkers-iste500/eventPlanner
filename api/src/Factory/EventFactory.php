<?php

namespace App\Factory;

use App\Entity\Event;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<Event>
 */
final class EventFactory extends PersistentProxyObjectFactory
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
        return Event::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        return [
            'endDateTime' => self::faker()->dateTimeBetween('+1 week', '+1 month'),
            'eventTitle' => substr(self::faker()->sentence(5), 0, 55),
            'location' => substr(self::faker()->address(), 0, 55),
            'maxAttendees' => self::faker()->numberBetween(1, 20),
            'startDateTime' => self::faker()->dateTimeBetween('now', '+1 week'),
            'startFlightBooking' => self::faker()->dateTimeBetween('now', '+1 year'),
            'endFlightBooking' => self::faker()->dateTimeBetween('now', '+1 year'),
            'inviteCode' => self::faker()->regexify('[A-Za-z0-9]{15}'),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(Event $event): void {})
        ;
    }
}
