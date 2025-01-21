<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class userRole
{
    // #[ORM\Id]
    // #[ORM\ManyToOne(targetEntity: User::class)]
    // #[ORM\JoinColumn(name: 'userID', referencedColumnName: 'userID', nullable: false)]
    // public User $user;

    // #[ORM\Id]
    // #[ORM\ManyToOne(targetEntity: Role::class)]
    // #[ORM\JoinColumn(name: 'roleID', referencedColumnName: 'roleID', nullable: false)]
    // public Role $role;

    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    public int $userID;

    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    public int $roleID;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $createdDate;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $lastModified;

    public function __construct()
    {
        $this->lastModified = new \DateTimeInterface();
        $this->createdDate = new \DateTimeInterface();
    }

}
