<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use App\State\DuffelApiProvider; //Testing OfferRequests
use App\State\DuffelOrderProvider; //Testing Orders
use ApiPlatform\Metadata\Get;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
#[ApiResource]
#[Get(provider: DuffelApiProvider::class)]
class HttpClientResponse
{

}