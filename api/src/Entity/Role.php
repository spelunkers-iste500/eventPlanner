<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity]
#[ApiResource]
#[ORM\Table(name: 'roles')]
class Role
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'roleID', type: 'integer')]
    public ?int $roleID = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\NotBlank]
    public ?string $name = null;

    #[ORM\Column(type: 'text', nullable: true)]
    public ?string $description = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $creationDate;

    #[ORM\OneToMany(targetEntity: rolePermission::class, mappedBy: 'role', cascade: ['persist', 'remove'])]
    public Collection $rolePermissions;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->creationDate = new \DateTime();
        $this->rolePermissions = new ArrayCollection();
    }
}
