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
    
    //public ?int $permissionID = null;

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

    #[ORM\Id, ORM\GeneratedValue, ORM\Column(name: 'permissionID', type: 'integer')]

    //Relationships 
    //One to Many with RolePermissions
    #[ORM\OneToMany(targetEntity: rolePermission::class, mappedBy:'permissionID')]
    #[ORM\JoinColumn(name: 'permissionID', referencedColumnName: 'permissionID', nullable: false)]
    public rolePermission $permissionID;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}