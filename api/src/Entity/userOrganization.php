<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class userOrganization
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'userOrganizationID', type: 'integer')]
    public ?int $userOrganizationID;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime',nullable: true)]
    public \DateTimeInterface $createdDate;

    //Relationships

    //userOrganization -> User
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'userOrganization')]
    #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id', nullable: false)]
    public User $user;

    //userOrganization -> Organization
    // #[ORM\ManyToOne(targetEntity: Organization::class, inversedBy: 'userOrganization')]
    // #[ORM\JoinColumn(name: 'orgID', referencedColumnName: 'orgID', nullable: false)]
    // public Organization $orgID;


    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}
