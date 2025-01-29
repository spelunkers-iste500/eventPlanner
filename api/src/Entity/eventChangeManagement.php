<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class eventChangeManagement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'changeID', type: 'integer')]
    public ?int $changeID = null;

    //Relationships

    //eventOrganization -> Event
    // #[ORM\ManyToOne(targetEntity: Event::class, inversedBy: 'eventID')]
    // #[ORM\JoinColumn(name: 'eventID', referencedColumnName: 'eventID', nullable: true)]
    // public Event $eventID;

    #[ORM\Column(length: 55)]
    public string $versionNum;

    #[ORM\Column(type: 'boolean')]
    public bool $active;

    #[ORM\Column(length: 255)]
    public string $description;

    #[ORM\Column(type: 'json', nullable: true)]
    public mixed $beforeChanges = null;

    #[ORM\Column(type: 'json', nullable: true)]
    public mixed $afterChanges = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime',nullable: true)]
    public \DateTimeInterface $createdDate;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}
