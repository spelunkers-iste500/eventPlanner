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

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime',nullable: true)]
    public \DateTimeInterface $createdDate;

    //Relationships

    //eventOrganization -> Event
    #[ORM\ManyToOne(targetEntity: Event::class)]
    #[ORM\JoinColumn(name: 'eventID', referencedColumnName: 'eventID', nullable: true)]
    public Event $eventID;

    //eventOrganization -> Organization
    #[ORM\ManyToOne(targetEntity: Organization::class)]
    #[ORM\JoinColumn(name: 'orgID', referencedColumnName: 'orgID', nullable: true)]
    public Organization $orgID;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}
