<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class rolePermissions
{
    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: Role::class, inversedBy: 'rolePermissions')]
    #[ORM\JoinColumn(name: 'roleID', referencedColumnName: 'roleID', nullable: false)]
    public Role $role;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: Permission::class, inversedBy: 'rolePermissions')]
    #[ORM\JoinColumn(name: 'permissionID', referencedColumnName: 'permissionID', nullable: false)]
    public Permission $permission;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime',nullable: true)]
    public \DateTimeInterface $createdDate;

    /**the permissions for this tole permissions*/
    /**#[ORM\ManyToOne(inversedBy:'permissions')]
    #[Asser\NotNull]
    public ?rolePermissions $rolePermissions = null;*/

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}
