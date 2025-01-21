<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ApiResource]
#[ORM\Table(name: 'users')]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'userID', type: 'integer')]
    public ?int $userID = null;

    #[ORM\Column(length: 55)]
    #[Assert\NotBlank]
    #[Assert\Length(max: 55)]
    public string $firstName;

    #[ORM\Column(length: 55)]
    #[Assert\NotBlank]
    #[Assert\Length(max: 55)]
    public string $lastName;

    #[ORM\Column(length: 55, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Email]
    public string $email;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 8)]
    public string $password;

    #[ORM\Column(type: 'boolean')]
    public bool $vip = false;

    #[ORM\Column(type: 'boolean')]
    public bool $accountEnabled = true;

    #[ORM\Column(length: 255, nullable: true)]
    public ?string $mfaTokenKey = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime',nullable: true)]
    public \DateTimeInterface $createdDate;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
        $this->mfaTokenKey = null;
    }
}
