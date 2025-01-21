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

    #[ORM\Column(type: 'integer')]
    public int $userID;

    #[ORM\Column(length: 20)]
    public string $flightNumber;

    #[ORM\Column(length: 10)]
    public string $seatNumber;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    public string $cost;

    #[ORM\Column(length: 55)]
    public string $tsaPreCheckNumber;

    #[ORM\Column(length: 55)]
    public string $frequentFlyerNumber;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime')]
    public \DateTimeInterface $createdDate;

    public function __construct()
    {
        $this->lastModified = new \DateTimeInterface();
        $this->createdDate = new \DateTimeInterface();
    }
}
