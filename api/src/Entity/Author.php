<?php
// api/src/Entity/Book.php
namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/** An author. */
#[ORM\Entity]
#[ApiResource]
class Author
{
    /** The ID of this author. */
    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    private ?int $id = null;

    /** The name of this author */
    #[ORM\Column]
    #[Assert\NotBlank]
    public ?string $name = null;


    /** @var Books[] All books authored by this author. */
    #[ORM\OneToMany(targetEntity: Book::class, mappedBy: 'author', cascade: ['persist', 'remove'])]
    public iterable $books;

    public function __construct()
    {
        $this->books = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }
}
