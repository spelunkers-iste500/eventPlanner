<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\UserInvite;
use App\Repository\UserRepository;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class OrganizationInviteState implements ProcessorInterface
{
    public function __construct(private ProcessorInterface $processor, private UserRepository $userRepository, private MailerInterface $mailer) {}
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        // on creation, check to see if the user exists via the email
        // if the user exists, set the invitedUser to the user, and set accepted to true
        // then send an email to the user that they have been added to the organization, 
        // and add the user to the organization as a member of the requested field
        // else send an email to the user that they have been invited to the organization

        // on creation the object should not have a user associated.
        // find the user by email and associte the user with the invite.
        $user = $this->userRepository->findOneBy(['email' => $data->getExpectedEmail()]);
        if ($user) {
            $data->setAccepted(true);
            $data->setInvitedUser($user);
            switch ($data->getInviteType()) {
                case 'admin':
                    $data->getOrganization()->addAdmin($user);
                    // persist the organization, as well as the OrganizationInvite then send email notifying user
                    $this->processor->process($data, $operation, $uriVariables, $context);
                    $this->userRepository->save($user, true);
                    $email = (new Email())
                        ->to($data->getExpectedEmail())
                        ->subject('You have been added to an administrative position on an organization.')
                        ->html('<p>Placeholder text</p>');
                    break;
                case 'eventAdmin':
                    $data->getOrganization()->addEventAdmin($user);
                    // persist the organization, as well as the OrganizationInvite then send email notifying user
                    $this->processor->process($data, $operation, $uriVariables, $context);
                    $this->userRepository->save($user, true);
                    $email = (new Email())
                        ->to($data->getExpectedEmail())
                        ->subject('You have been added to an administrative position on an organization.')
                        ->html('<p>Placeholder text</p>');
                    break;
                case 'financeAdmin':
                    $data->getOrganization()->addFinanceAdmin($user);
                    // persist the organization, as well as the OrganizationInvite then send email notifying user
                    $this->processor->process($data, $operation, $uriVariables, $context);
                    $this->userRepository->save($user, true);
                    $email = (new Email())
                        ->to($data->getExpectedEmail())
                        ->subject('You have been added to an administrative position on an organization.')
                        ->html('<p>Placeholder text</p>');
                    break;
                default:
                    // throw error on invalid invite type
                    break;
            }
        } else {
            // send email to user that they have been invited to the organization
            // as role, then persist the OrganizationInvite
            $this->processor->process($data, $operation, $uriVariables, $context);
            $inviteLink = 'https://localhost/register?orgInviteId=' . $data->getId() . '&email=' . $data->getExpectedEmail();
            $email = (new Email())
                ->to($data->getExpectedEmail())
                ->subject('You have been invited to join an organization')
                ->html('<p>Click on the following link to join the organization: <a href="' . $inviteLink . '">Join</a></p>');
            $this->mailer->send($email);
        }
    }
}
