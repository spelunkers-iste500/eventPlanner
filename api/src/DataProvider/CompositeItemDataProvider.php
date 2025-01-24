<?php
// src/Api/DataProvider/CompositeItemDataProvider.php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\Token;

class CompositeItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{
    private CompositeRepository $compositeRepository;

    public function __construct(CompositeRepository $compositeRepository)
    {
        $this->compositeRepository = $compositeRepository;
    }

    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return $resourceClass === Token::class;
    }

    public function getItem(string $resourceClass, $id, string $operationName = null, array $context = [])
    {
        list($identifier, $token) = explode('-', $id);

        return $this->compositeRepository->findOneBy([
           'identifier' => $identifier,
           'token' => $token
        ]);
    }
}