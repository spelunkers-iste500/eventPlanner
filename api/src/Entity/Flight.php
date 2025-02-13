<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use App\State\DuffelApiProvider;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[ORM\Entity]
#[ApiResource]
class Flight
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 3)]
    private string $origin;

    #[ORM\Column(length: 3)]
    private string $destination;

    #[ORM\Column(type: "date")]
    private \DateTimeInterface $departureDate;

    #[ORM\Column]
    private int $passengerCount;

    #[ORM\Column(type: "decimal", precision: 10, scale: 2, nullable: true)]
    private ?float $price = null;

    // Remove the DuffelApiProvider from the constructor, it shouldn't be needed directly in the entity
    public function __construct()
    {
        // Constructor logic here if needed
    }

    // Static method to fetch flights using the provider
    public static function fetchFlights(DuffelApiProvider $duffelApiProvider, string $origin, string $destination, string $departureDate, int $passengerCount): array
    {
        // Fetch flight data from the provider
        $flightsData = $duffelApiProvider->getFlights($origin, $destination, $departureDate, $passengerCount);

        $flights = [];
        foreach ($flightsData['data']['flights'] ?? [] as $flightData) {
            $flight = new self();  // Create the Flight entity normally
            $flight->setOrigin($flightData['origin']);
            $flight->setDestination($flightData['destination']);
            $flight->setDepartureDate(new \DateTime($flightData['departure_date']));
            $flight->setPassengerCount($passengerCount);
            $flights[] = $flight;
        }

        return $flights;
    }

    // Getters and setters for the fields

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOrigin(): string
    {
        return $this->origin;
    }

    public function setOrigin(string $origin): self
    {
        $this->origin = $origin;
        return $this;
    }

    public function getDestination(): string
    {
        return $this->destination;
    }

    public function setDestination(string $destination): self
    {
        $this->destination = $destination;
        return $this;
    }

    public function getDepartureDate(): \DateTimeInterface
    {
        return $this->departureDate;
    }

    public function setDepartureDate(\DateTimeInterface $departureDate): self
    {
        $this->departureDate = $departureDate;
        return $this;
    }

    public function getPassengerCount(): int
    {
        return $this->passengerCount;
    }

    public function setPassengerCount(int $passengerCount): self
    {
        $this->passengerCount = $passengerCount;
        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(?float $price): self
    {
        $this->price = $price;
        return $this;
    }
}