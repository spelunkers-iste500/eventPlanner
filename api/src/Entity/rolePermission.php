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
    #[ORM\Column(name: 'roleID', type: 'integer')]
    public ?int $rolePermissionID = null;

    #[ORM\ManyToOne(targetEntity: Role::class, inversedBy: 'rolePermission')]
    #[ORM\JoinColumn(name: 'roleID', referencedColumnName: 'roleID', nullable: false)]
    public Role $role;

    #[ORM\ManyToOne(targetEntity: Permission::class, inversedBy: 'rolePermission')]
    #[ORM\JoinColumn(name: 'permissionID', referencedColumnName: 'permissionID', nullable: false)]
    public Permission $permission;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $createdDate;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}
