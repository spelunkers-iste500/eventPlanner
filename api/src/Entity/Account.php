<?php

namespace App\Entity;


use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\OpenApi\Model\Operation;
use App\State\CurrentAccountProvider;

#[ORM\Entity]
#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/accounts/me.{_format}',
            openapi: new Operation(summary: "Get the current user email"),
            provider: CurrentAccountProvider::class
        ),
        new GetCollection(
            uriTemplate: '/accounts.{_format}',
            openapi: new Operation(summary: "Get All Accounts"),
            security: "is_granted('ROLE_ADMIN')",
            securityPostDenormalize: "is_granted('ROLE_ADMIN')"
        )
    ],

)]
#[ORM\Table(name: 'accounts')]

class Account
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: 'integer')]
    public int $id;

    #[ORM\Column(type: 'integer', name: '"userId"')]
    public int $userId;

    #[ORM\JoinTable(name: 'accounts_users')]
    #[ORM\JoinColumn(name: '"userId"', referencedColumnName: 'id')]
    #[ORM\InverseJoinColumn(name: 'id', referencedColumnName: 'account_id')]
    #[ORM\OneToOne(targetEntity: User::class, inversedBy: 'account', cascade: ['all'])]
    private User $user;

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

    public function __construct(User $user)
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
        $this->setUser($user);
        $this->provider = "email";
        $this->type = "email";
        $this->providerAccountId = (string)random_int(10000, 100000000000000000);
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function setUserId(int $userId): void
    {
        $this->userId = $userId;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): void
    {
        $this->user = $user;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): void
    {
        $this->type = $type;
    }

    public function getProvider(): string
    {
        return $this->provider;
    }

    public function setProvider(string $provider): void
    {
        $this->provider = $provider;
    }

    public function getProviderAccountId(): string
    {
        return $this->providerAccountId;
    }

    public function setProviderAccountId(string $providerAccountId): void
    {
        $this->providerAccountId = $providerAccountId;
    }

    public function getRefreshToken(): ?string
    {
        return $this->refreshToken;
    }

    public function setRefreshToken(?string $refreshToken): void
    {
        $this->refreshToken = $refreshToken;
    }

    public function getAccessToken(): ?string
    {
        return $this->accessToken;
    }

    public function setAccessToken(?string $accessToken): void
    {
        $this->accessToken = $accessToken;
    }

    public function getExpiresAt(): ?\DateTimeInterface
    {
        return $this->expiresAt;
    }

    public function setExpiresAt(?\DateTimeInterface $expiresAt): void
    {
        $this->expiresAt = $expiresAt;
    }

    public function getIdToken(): ?string
    {
        return $this->idToken;
    }

    public function setIdToken(?string $idToken): void
    {
        $this->idToken = $idToken;
    }

    public function getScope(): ?string
    {
        return $this->scope;
    }

    public function setScope(?string $scope): void
    {
        $this->scope = $scope;
    }

    public function getSessionState(): ?string
    {
        return $this->sessionState;
    }

    public function setSessionState(?string $sessionState): void
    {
        $this->sessionState = $sessionState;
    }

    public function getTokenType(): ?string
    {
        return $this->tokenType;
    }

    public function setTokenType(?string $tokenType): void
    {
        $this->tokenType = $tokenType;
    }

    public function getLastModified(): \DateTimeInterface
    {
        return $this->lastModified;
    }

    public function setLastModified(\DateTimeInterface $lastModified): void
    {
        $this->lastModified = $lastModified;
    }

    public function getCreatedDate(): \DateTimeInterface
    {
        return $this->createdDate;
    }

    public function setCreatedDate(\DateTimeInterface $createdDate): void
    {
        $this->createdDate = $createdDate;
    }
}
