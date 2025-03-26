<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\UserRepository;
use Symfony\Bundle\SecurityBundle\Security;

class CurrentUserProvider implements ProviderInterface
{
    public function __construct(private Security $s, private UserRepository $uR) {}
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $userId = $this->s->getUser()->getUserIdentifier();
        $user = $this->uR->getUserByEmail($userId);
        return $user;
    }
}
