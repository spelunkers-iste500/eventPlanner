<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity]
#[ApiResource]
class Organization
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id', type: 'integer')]
    public ?int $id = null;

    #[ORM\Column(length: 55)]
    public string $name;

    #[ORM\Column(length: 255)]
    public string $description;

    #[ORM\Column(length: 255)]
    public string $address;

    #[ORM\Column(length: 55)]
    public string $primaryEmail;

    #[ORM\Column(length: 55)]
    public string $secondaryEmail;

    #[ORM\Column(length: 55)]
    public string $industry;

    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'organizations')]
    private Collection $users;

    #[ORM\ManyToMany(targetEntity: Event::class, mappedBy: 'organizations')]
    private Collection $events;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $createdDate;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}
