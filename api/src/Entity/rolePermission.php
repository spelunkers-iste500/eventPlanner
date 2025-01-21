<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class rolePermission
{
    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: Role::class, inversedBy: 'rolePermissions')]
    #[ORM\JoinColumn(name: 'roleID', referencedColumnName: 'roleID', nullable: false)]
    public Role $roleID;

    #[ORM\Id]
    #[ORM\ManyToOne( mappedBy: 'permissionID', targetEntity: Permission::class)]
    public Permission $permissionID;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime',nullable: true)]
    public \DateTimeInterface $createdDate;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}
