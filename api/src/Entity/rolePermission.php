<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class rolePermission
{

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'rolePermissionID', type: 'integer')]
    public ?int $rolePermissionID;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $createdDate;

    //Relationships

    //rolePermission -> Role
    #[ORM\ManyToOne(targetEntity: Role::class, inversedBy: 'rolePermissions')]
    #[ORM\JoinColumn(name: 'roleID', referencedColumnName: 'id', nullable: false)]
    public Role $role;

    //rolePermission -> Permission
    #[ORM\ManyToOne(targetEntity: Permission::class, inversedBy: 'rolePermissions')]
    #[ORM\JoinColumn(name: 'permissionID', referencedColumnName: 'id', nullable: false)]
    public Permission $permission;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}

