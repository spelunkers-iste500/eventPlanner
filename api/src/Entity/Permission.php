<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use com_exception;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\Collection;


#[ORM\Entity]
#[ApiResource]
class Permission
{
    /** The unique identifier of this permission. */

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id', type: 'integer')]
    public int $id;

    /** The name of this permission. */
    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    public ?string $name = null;

    /** A description for this permission (optional). */
    #[ORM\Column(type: 'text', nullable: true)]
    public ?string $description = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $createdDate;

    #[ORM\ManyToMany(targetEntity: Role::class, inversedBy: 'permissions')]
    private Collection $roles;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}
