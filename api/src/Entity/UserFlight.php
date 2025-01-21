<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
#[ApiResource]
class UserFlight
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $userFlightID = null;

    #[ORM\Column(type: 'integer')]
    private int $userID;

    #[ORM\Column(length: 20)]
    private string $flightNumber;

    #[ORM\Column(length: 10)]
    private string $seatNumber;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private string $cost;

    #[ORM\Column(length: 55)]
    private string $tsaPreCheckNumber;

    #[ORM\Column(length: 55)]
    private string $frequentFlyerNumber;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $lastModified;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $createdDate;

    public function getUserFlightID(): ?int
    {
        return $this->userFlightID;
    }

    public function getUserID(): int
    {
        return $this->userID;
    }

    public function setUserID(int $userID): self
    {
        $this->userID = $userID;
        return $this;
    }

    public function getFlightNumber(): string
    {
        return $this->flightNumber;
    }

    public function setFlightNumber(string $flightNumber): self
    {
        $this->flightNumber = $flightNumber;
        return $this;
    }

    public function getSeatNumber(): string
    {
        return $this->seatNumber;
    }

    public function setSeatNumber(string $seatNumber): self
    {
        $this->seatNumber = $seatNumber;
        return $this;
    }

    public function getCost(): float
    {
        return $this->cost;
    }

    public function setCost(float $cost): self
    {
        $this->cost = $cost;
        return $this;
    }

    public function getTsaPreCheckNumber(): string
    {
        return $this->tsaPreCheckNumber;
    }

    public function setTsaPreCheckNumber(string $tsaPreCheckNumber): self
    {
        $this->tsaPreCheckNumber = $tsaPreCheckNumber;
        return $this;
    }

    public function getFrequentFlyerNumber(): string
    {
        return $this->frequentFlyerNumber;
    }

    public function setFrequentFlyerNumber(string $frequentFlyerNumber): self
    {
        $this->frequentFlyerNumber = $frequentFlyerNumber;
        return $this;
    }

    public function getLastModified(): \DateTimeInterface
    {
        return $this->lastModified;
    }

    public function setLastModified(\DateTimeInterface $lastModified): self
    {
        $this->lastModified = $lastModified;
        return $this;
    }

    public function getCreatedDate(): \DateTimeInterface
    {
        return $this->createdDate;
    }

    public function setCreatedDate(\DateTimeInterface $createdDate): self
    {
        $this->createdDate = $createdDate;
        return $this;
    }
}
