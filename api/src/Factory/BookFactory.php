<?php

namespace App\Factory;

use App\Entity\Book;
use Doctrine\ORM\EntityRepository;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;
use Zenstruck\Foundry\Persistence\Proxy;
use Zenstruck\Foundry\Persistence\ProxyRepositoryDecorator;

/**
 * @extends PersistentProxyObjectFactory<Book>
 *
 * @method        Book|Proxy                                create(array|callable $attributes = [])
 * @method static Book|Proxy                                createOne(array $attributes = [])
 * @method static Book|Proxy                                find(object|array|mixed $criteria)
 * @method static Book|Proxy                                findOrCreate(array $attributes)
 * @method static Book|Proxy                                first(string $sortedField = 'id')
 * @method static Book|Proxy                                last(string $sortedField = 'id')
 * @method static Book|Proxy                                random(array $attributes = [])
 * @method static Book|Proxy                                randomOrCreate(array $attributes = [])
 * @method static EntityRepository|ProxyRepositoryDecorator repository()
 * @method static Book[]|Proxy[]                            all()
 * @method static Book[]|Proxy[]                            createMany(int $number, array|callable $attributes = [])
 * @method static Book[]|Proxy[]                            createSequence(iterable|callable $sequence)
 * @method static Book[]|Proxy[]                            findBy(array $attributes)
 * @method static Book[]|Proxy[]                            randomRange(int $min, int $max, array $attributes = [])
 * @method static Book[]|Proxy[]                            randomSet(int $number, array $attributes = [])
 */
final class BookFactory extends PersistentProxyObjectFactory
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
        return Book::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        return [
            'description' => self::faker()->text(),
            'publicationDate' => \DateTimeImmutable::createFromMutable(self::faker()->dateTime()),
            'title' => self::faker()->text(),
        ];
    }
    protected function getDefaults(): array
    {
        return [
            'author' => self::faker()->name(),
            'description' => self::faker()->text(),
            'isbn' => self::faker()->isbn13(),
            'publication_date' => \DateTimeImmutable::createFromMutable(self::faker()->dateTime()),
            'title' => self::faker()->sentence(4),
        ];
    }
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(Book $book): void {})
        ;
    }
}
