<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class eventOrganization
{
    #[ORM\Id]
    #[ORM\Column(name: 'eventID', type: 'integer')]
    public int $eventID;

    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    public int $orgID;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $field1;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $field2;

    // Relationships
    // #[ORM\ManyToOne(targetEntity: Event::class, inversedBy: 'eventOrganization')]
    // #[ORM\JoinColumn(name: 'eventID', referencedColumnName: 'eventID', nullable: false)]
    // public ?Event $event = null;

    public function __construct()
    {
        $this->lastModified = new \DateTimeInterface();
        $this->createdDate = new \DateTimeInterface();
    }
}
