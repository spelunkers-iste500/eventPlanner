<?php

namespace App\Entity;


use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;


#[ORM\Entity]
#[ApiResource]
#[ORM\Table(name: 'accounts')]
class Account
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: 'integer')]
    public int $id;

    #[ORM\Column(type: 'integer', name: '"userId"')]
    public int $userId;

    #[ORM\Column(type: 'string', length: 255)]
    public string $type;

    #[ORM\Column(type: 'string', length: 255)]
    public string $provider;

    #[ORM\Column(type: 'string', length: 255, name: '"providerAccountId"', unique: true)]
    public string $providerAccountId;

    #[ORM\Column(name: 'refresh_token', type: 'string', length: 255, nullable: true)]
    public ?string $refreshToken = null;

    #[ORM\Column(name: 'access_token', type: 'string', length: 255, nullable: true)]
    public ?string $accessToken = null;

    #[ORM\Column(name: 'expires_at', type: 'datetime', nullable: true)]
    public ?\DateTimeInterface $expiresAt = null;

    #[ORM\Column(name: 'id_token', type: 'string', length: 2048, nullable: true)]
    public ?string $idToken = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    public ?string $scope = null;

    #[ORM\Column(name: 'session_state', type: 'string', length: 255, nullable: true)]
    public ?string $sessionState = null;

    #[ORM\Column(name: 'token_type', type: 'string', length: 255, nullable: true)]
    public ?string $tokenType = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $createdDate;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}
