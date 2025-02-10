<?php

require 'vendor/autoload.php';

use Symfony\Component\HttpClient\HttpClient;
use App\State\DuffelApiProvider;

// Create the HttpClient instance
$client = HttpClient::create();

// Inject HttpClient into DuffelApiProvider
$duffelApiProvider = new DuffelApiProvider($client);

// Call the API and get flights
$flights = $duffelApiProvider->getFlights("JFK", "LAX", "2025-03-15", 1);

// Print the response
print_r($flights);
