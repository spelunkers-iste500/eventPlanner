<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;

#[ApiResource]
#[Get(
    description: "Gets an API token from the server, after logging in with nextauth",
    uriTemplate: '/api/auth/token',
)]
final class Token
{
    #[ApiResource(identifier: true)]
    private string $token;

    public function getToken(): string
    {
        return $this->token;
    }
}
