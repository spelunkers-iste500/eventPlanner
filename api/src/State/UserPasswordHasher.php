<?php
// api/src/State/UserPasswordHasher.php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\State\LoggerStateProcessor;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\User;

/**
 * @implements ProcessorInterface<User, User|void>
 */
final readonly class UserPasswordHasher implements ProcessorInterface
{
    public function __construct(
        private ProcessorInterface $processor,
        private UserPasswordHasherInterface $passwordHasher,
        private LoggerStateProcessor $changeLogger
    ) {}

    /**
     * @param User $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): User
    {
        if (!$data->getPlainPassword()) {
            return $this->processor->process($data, $operation, $uriVariables, $context);
        }

        $hashedPassword = $this->passwordHasher->hashPassword(
            $data,
            $data->getPlainPassword()
        );
        $data->setHashedPassword($hashedPassword);
        $data->eraseCredentials();

        // this is where the user gets persisted / created
        $processedUser = $this->processor->process($data, $operation, $uriVariables, $context);
        // after the user gets persisted, we need to add them to the orgnanization related to the optional invite code

        $this->changeLogger->process($processedUser, $operation, $uriVariables, $context);

        return $processedUser;
    }
}
