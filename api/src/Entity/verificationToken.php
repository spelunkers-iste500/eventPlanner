<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity]
#[ApiResource]
class verificationToken
{
    #[ORM\Id]
    #[ORM\Column(type: 'text')]
    public string $identifier;

    #[ORM\Id]
    #[ORM\Column(type: 'text')]
    public string $token;

    #[ORM\Column(type: 'datetimetz')]
    public \DateTimeInterface $expires;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public ?\DateTimeInterface $lastModified = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public ?\DateTimeInterface $creationDate = null;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}