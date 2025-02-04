<?php
// api/src/State/DuffelApiProvider.php

/* 
query path: https://api.duffel.com/air/offer_requests
Method: Post
Response Body: JSON Encapsulated under data object
*/


namespace App\State;

use App\Entity\Flight;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;

final class DuffelApiProvider implements ProviderInterface{
    public function __construct(
        private ProviderInterface $example
    ) {}

    public function provide(){
        return $this;
    }
}