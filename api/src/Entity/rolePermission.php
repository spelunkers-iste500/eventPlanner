<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class rolePermission
{
    // #[ORM\Id]
    // #[ORM\ManyToOne(targetEntity: Role::class, inversedBy: 'rolePermissions')]
    // #[ORM\JoinColumn(name: 'roleID', referencedColumnName: 'roleID', nullable: false)]
    // public Role $roleID;

    // #[ORM\Id]
    // #[ORM\ManyToOne(targetEntity: Permission::class, inversedBy: 'rolePermissions')]
    // #[ORM\JoinColumn(name: 'permissionID', referencedColumnName: 'permissionID', onDelete: 'CASCADE', nullable: false)]
    // public Permission $permissionID;

    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    public int $roleID;

    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    public int $permissionID;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $createdDate;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $lastModified;

    public function __construct()
    {
        $this->createdDate = new \DateTime();
        $this->lastModified = new \DateTime();
    }
}
