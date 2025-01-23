<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;


#[ORM\Entity]
#[ApiResource]
class Permission
{
    /** The unique identifier of this permission. */
    
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'permissionID', type: 'integer')]
    private ?int $permissionID = null;

    /** The name of this permission. */
    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    public ?string $name = null;

    /** A description for this permission (optional). */
    #[ORM\Column(type: 'text', nullable: true)]
    public ?string $description = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime',nullable: true)]
    public \DateTimeInterface $createdDate;

    /**#[ORM\OneToMany(targetEntity: RolePermissions::class, mappedBy: 'permission', cascade: ['persist', 'remove'])]
    public Collection $rolePermissions;*/

    /**relationship */
    /**#[ORM\OneToMany(targetEntity: rolePermissions::class, mappedBy: 'rolePermissions', cascade: ['persist', 'remove'])]
    public iterable $permissions;*/

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}