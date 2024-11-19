<?php
// api/src/Entity/User.php
namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/** A user object. */
#[ORM\Entity]
#[ApiResource]
class User
{
    /** The user ID. */
    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    private ?int $userId = null;

    // /** The first name of the user */
    // #[ORM\Column]
    // #[Assert\NotBlank]
    // public ?string $firstName = null;

    // /** The last name of the user */
    // #[ORM\Column]
    // #[Assert\NotBlank]
    // public ?string $lastName = null;
    // /** The email  of the user */
    // #[ORM\Column]
    // #[Assert\NotBlank]
    // public ?string $email = null;

    // /** The hashed password */
    // #[ORM\Column]
    // #[Assert\NotBlank]
    // public ?string $passwordHash = null;

    // /** The hashed password */
    // #[ORM\Column]
    // #[Assert\NotBlank]
    // public bool $VIP = false;

    /** MFA Token */
    #[ORM\Column]
    #[Assert\NotBlank]
    public ?string $mfaTokenKey = null;

    public function getId(): ?int
    {
        return $this->userId;
    }
}
