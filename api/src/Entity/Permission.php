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
    #[ORM\Id, ORM\GeneratedValue, ORM\Column(name: 'permissionID', type: 'integer')]
    public ?int $permissionID = null;

    /** The name of this permission. */
    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    public ?string $name = null;

    /** A description for this permission (optional). */
    #[ORM\Column(type: 'text', nullable: true)]
    public ?string $description = null;

    /** The date this permission was last modified. */
    #[ORM\Column(type: 'datetime', nullable: true)]
    public ?\DateTimeInterface $lastModified = null;

    /** The date this permission was last modified. */
    #[ORM\Column(type: 'datetime', nullable: true)]
    public ?\DateTimeInterface $creationDate = null;

    // //Relations
    // #[ORM\OneToMany(mappedBy: 'permission', targetEntity: RolePermission::class, cascade: ['persist', 'remove'])]
    // public Collection $rolePermissions;

    public function __construct()
    {
        $this->lastModified = new \DateTimeInterface();
        $this->createdDate = new \DateTimeInterface();
    }
}