<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class eventOrganization
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'eventOrganizationID', type: 'integer')]
    public ?int $eventOrganizationID;

    #[ORM\Column(type: 'integer')]
    public int $orgID;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime',nullable: true)]
    public \DateTimeInterface $createdDate;

    //Relationships

    //eventOrganization -> Event
    // #[ORM\ManyToOne(targetEntity: Event::class, inversedBy: 'eventOrganization')]
    // #[ORM\JoinColumn(name: 'eventOrganization', referencedColumnName: 'eventID', nullable: true)]
    // public Event $event;

    //eventOrganization -> Organization
    // #[ORM\ManyToOne(targetEntity: Event::class, inversedBy: 'budget')]
    // #[ORM\JoinColumn(name: 'eventID', referencedColumnName: 'id', nullable: true)]
    // public Event $eventID;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}
