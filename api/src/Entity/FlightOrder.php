<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use App\State\DuffelOrderProvider;
use ApiPlatform\Metadata\Get;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ApiResource]
#[Get(provider: DuffelOrderProvider::class)]
class FlightOrder
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'json')]
    private array $offerData = [];

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOfferData(): array
    {
        return $this->offerData;
    }

    public function setOfferData(array $offerData): self
    {
        $this->offerData = $offerData;
        return $this;
    }
}