<?php

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class Account
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    public int $id;

    #[ORM\Column(type: 'integer')]
    public int $userId;

    #[ORM\Column(type: 'string', length: 255)]
    public string $type;

    #[ORM\Column(type: 'string', length: 255)]
    public string $provider;

    #[ORM\Column(type: 'string', length: 255)]
    public string $providerAccountId;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    public ?string $refresh_token = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    public ?string $access_token = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public ?\DateTimeInterface $expires_at = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    public ?string $id_token = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    public ?string $scope = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    public ?string $session_state = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    public ?string $token_type = null;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $createdDate;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}