<?php

namespace App\Factory;

use App\Entity\Review;
use Doctrine\ORM\EntityRepository;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;
use Zenstruck\Foundry\Persistence\Proxy;
use Zenstruck\Foundry\Persistence\ProxyRepositoryDecorator;
use function Zenstruck\Foundry\lazy;
/**
 * @extends PersistentProxyObjectFactory<Review>
 *
 * @method        Review|Proxy                              create(array|callable $attributes = [])
 * @method static Review|Proxy                              createOne(array $attributes = [])
 * @method static Review|Proxy                              find(object|array|mixed $criteria)
 * @method static Review|Proxy                              findOrCreate(array $attributes)
 * @method static Review|Proxy                              first(string $sortedField = 'id')
 * @method static Review|Proxy                              last(string $sortedField = 'id')
 * @method static Review|Proxy                              random(array $attributes = [])
 * @method static Review|Proxy                              randomOrCreate(array $attributes = [])
 * @method static EntityRepository|ProxyRepositoryDecorator repository()
 * @method static Review[]|Proxy[]                          all()
 * @method static Review[]|Proxy[]                          createMany(int $number, array|callable $attributes = [])
 * @method static Review[]|Proxy[]                          createSequence(iterable|callable $sequence)
 * @method static Review[]|Proxy[]                          findBy(array $attributes)
 * @method static Review[]|Proxy[]                          randomRange(int $min, int $max, array $attributes = [])
 * @method static Review[]|Proxy[]                          randomSet(int $number, array $attributes = [])
 */
final class ReviewFactory extends PersistentProxyObjectFactory
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
        return Review::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        return [
            'author' => self::faker()->text(),
            'body' => self::faker()->text(),
            'publicationDate' => \DateTimeImmutable::createFromMutable(self::faker()->dateTime()),
            'rating' => self::faker()->numberBetween(1, 32767),
        ];
    }
    protected function getDefaults(): array
    {
        return [
            'author' => self::faker()->name(),
            'body' => self::faker()->text(),
            'book' => lazy(fn() => BookFactory::randomOrCreate()),
            'publicationDate' => \DateTimeImmutable::createFromMutable(self::faker()->dateTime()),
            'rating' => self::faker()->numberBetween(0, 5),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(Review $review): void {})
        ;
    }
}
