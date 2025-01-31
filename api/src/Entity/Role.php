<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ApiResource]
#[ORM\Table(name: 'roles')]
class Role
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id', type: 'integer')]
    public int $id;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\NotBlank]
    public ?string $name = null;

    #[ORM\Column(type: 'text', nullable: true)]
    public ?string $description = null;

    #[ORM\ManyToMany(targetEntity: Permission::class, mappedBy: 'roles')]
    private Collection $permissions;

    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'roles')]
    private Collection $users;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $creationDate;


    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->creationDate = new \DateTime();
    }
}
