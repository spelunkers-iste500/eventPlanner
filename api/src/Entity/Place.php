<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\State\DuffelPlaceProvider;

#[ApiResource]
#[GetCollection(
    provider: DuffelPlaceProvider::class,
    uriTemplate: '/places/search/{query}.{_format}',
    uriVariables: ['query'],
)]
#[Get(
    provider: DuffelPlaceProvider::class,
)]
class Place
{
    #[ApiResource(identifier: true)]
    public string $id;
    public string $query;
    public string $name;
    public string $type;
    public string $iataCode;
    public string $cityName;
    // assign values to the properties on construct
    public function __construct(string $id, string $name, string $type, string $iataCode, string $cityName)
    {
        $this->id = $id;
        $this->name = $name;
        $this->type = $type;
        $this->iataCode = $iataCode;
        $this->cityName = $cityName;
        $this->query = $name;
    }

    public function setId(string $id)
    {
        $this->id = $id;
    }

    public function getId()
    {
        return $this->id;
    }
}
