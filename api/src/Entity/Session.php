<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity]
#[ApiResource]
#[ORM\Table(name: 'sessions')]
class Session
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: 'integer')]
    public int $id;

    #[ORM\Column(name: '"userId"', type: 'integer', nullable: false)]
    public int $userId;

    #[ORM\Column(type: 'datetime', nullable: false)]
    public ?\DateTimeInterface $expires;

    #[ORM\Column(name: '"sessionToken"', type: 'string', length: 255, nullable: false)]
    public string $sessionToken;

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
