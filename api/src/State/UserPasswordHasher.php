<?php
// api/src/State/UserPasswordHasher.php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\State\LoggerStateProcessor;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\User;
use App\Entity\UserEvent;
use App\Repository\EventRepository;
use App\Repository\OrganizationInviteRepository;
use App\Repository\UserEventRepository;
use Psr\Log\LoggerInterface;

/**
 * @implements ProcessorInterface<User, User|void>
 */
final readonly class UserPasswordHasher implements ProcessorInterface
{
    public function __construct(
        private ProcessorInterface $processor,
        private UserPasswordHasherInterface $passwordHasher,
        private LoggerStateProcessor $changeLogger,
        private UserEventRepository $userEventRepository,
        private OrganizationInviteState $orgInviteState,
        private OrganizationInviteRepository $orgInviteRepository,
        private EventRepository $eventRepository,
        private LoggerInterface $logger
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
        // after the user gets persisted, we need to add them to the events related to the optional invite code
        $inviteCode = $data->getEventCode();
        // get optional event code
        $orgInvite = $data->getUserOrgInviteId();
        $orgInviteObject = $this->orgInviteRepository->findOneBy(['id' => $orgInvite]); // doesn't get found
        if ($orgInvite && $orgInviteObject) {
            // check to see if orgInvite is in the allowedOrganizationInvites
            if ($orgInviteObject->getExpectedEmail() === $data->getEmail()) {
                $orgInviteObject->setInvitedUser($processedUser);
                $this->orgInviteState->process($orgInviteObject, $operation, $uriVariables, $context);
            }
        } else
        if ($inviteCode) {
            $event = $this->eventRepository->findOneBy(['inviteCode' => $inviteCode]);
            if ($event) {
                // if the user is already set, don't overwrite it
                // make a new userEvent object and set the user to the processed user
                $userEvent = $this->userEventRepository->findOneBy(['event' => $event, 'email' => $processedUser->getEmail()]);
                // $userEvent->setEvent($event);
                $userEvent->setUser($processedUser);
                $this->userEventRepository->save($userEvent, true);
            }
        }
        $this->changeLogger->process($processedUser, $operation, $uriVariables, $context);

        return $processedUser;
    }
}
