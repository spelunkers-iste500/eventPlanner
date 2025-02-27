<?php

namespace App\Entity\ChangeManagement;

use App\Entity\Event;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
// #[ApiResource]
class eventChangeManagement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id', type: 'integer')]
    public int $id;

    //Relationships

    //eventOrganization -> Event
    #[ORM\ManyToOne(targetEntity: Event::class)]
    // #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id', nullable: true)]
    public Event $event;

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

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $createdDate;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}
