<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use DateTime;

#[ApiResource]
#[ORM\Entity(repositoryClass: CompositeRepository::class)]
// #[ORM\Entity]
#[ORM\Table(name: '`verification_token`')]
class Token {
    #[ApiProperty(identifier: false)]
    #[ORM\Id, ORM\Column(type: 'text')]
    public ?string $identifier;

    #[ORM\Column(type: 'datetime')]
    public DateTime $expires;

    #[ApiProperty(identifier: false)]
    #[ORM\Id, ORM\Column(type: 'text')]
    public ?string $token;

    #[ApiProperty(identifier: true)]
    public function getId(): string
    {
        return $this->identifier.'-'.$this->token;
    }
}