<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use DateTime;

#[ApiResource]
#[ORM\Entity]
// #[ORM\Entity]
#[ORM\Table(name: '`accounts`')]
class Account {
    #[ORM\Id, ORM\Column(type: 'serial')]
    private int $id;
    #[ORM\Column(type: 'integer')]
    public int $userId;
    #[ORM\Column(type: 'string', Length: 255)]
    public string $type;
    #[ORM\Column]
}