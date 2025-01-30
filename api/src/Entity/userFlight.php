<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class userFlight
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    public ?int $userFlightID = null;

    #[ORM\OneToOne(targetEntity: Flight::class)]
    #[ORM\JoinColumn(name: 'flightID', referencedColumnName: 'flightID', nullable: true)]
    public Flight $flightNumber;

    #[ORM\Column(length: 10)]
    public string $seatNumber;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    public string $cost;

    #[ORM\Column(length: 55)]
    public string $tsaPreCheckNumber;

    #[ORM\Column(length: 55)]
    public string $frequentFlyerNumber;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime',nullable: true)]
    public \DateTimeInterface $createdDate;

    //Relationships

    //UserFlights -> User
    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id', nullable: false)]
    public User $user;

    public function __construct()
    {
        $this->lastModified = new \DateTime();
        $this->createdDate = new \DateTime();
    }
}
