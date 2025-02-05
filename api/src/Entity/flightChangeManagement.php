<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class flightChangeManagement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'changeID', type: 'integer')]
    public ?int $changeID = null;

    //Relationships

    //eventOrganization -> Event
    #[ORM\ManyToOne(targetEntity: Flight::class)]
    #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id', nullable: true)]
    public Flight $flightID;

    #[ORM\Column(length: 55)]
    public string $versionNum;

    #[ORM\Column(type: 'boolean')]
    public bool $active;

    #[ORM\Column(length: 255)]
    public string $description;

    #[ORM\Column(type: 'json')]
    public array $beforeChanges;

    #[ORM\Column(type: 'json')]
    public array $afterChanges;

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
