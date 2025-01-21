<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class userOrganization
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    public int $userID;

    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    public int $orgID;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $createdDate;

    public function __construct()
    {
        $this->lastModified = new \DateTimeInterface();
        $this->createdDate = new \DateTimeInterface();
    }
}
