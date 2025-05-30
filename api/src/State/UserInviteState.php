<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use ApiPlatform\State\ProviderInterface;
use App\Entity\UserEvent;
use App\Entity\UserInvite;
use App\Repository\EventRepository;
use App\Repository\UserEventRepository;
use App\Repository\UserRepository;
use Psr\Log\LoggerAwareInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class UserInviteState implements ProcessorInterface, ProviderInterface, LoggerAwareInterface
{
    private ?\Psr\Log\LoggerInterface $logger = null;

    public function setLogger(\Psr\Log\LoggerInterface $logger): void
    {
        $this->logger = $logger;
    }
    public function __construct(private EventRepository $eRepo, private MailerInterface $mailer, private UserRepository $uRepo, private UserEventRepository $uEventRepo) {}
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        // $data is the userInvite object
        // We now have an object with a list of emails, and an organization invite code.
        // We can now send the emails to the users, using the invite code.
        // invite link should be localhost for dev, and the actual domain for production
        if ($_ENV['APP_ENV'] === 'dev') {
            $inviteLinkBase = 'https://localhost/register';
        } else {
            $inviteLinkBase = 'https://staging.spelunkers.xeanto.us/register';
        }
        foreach ($data->getEmails() as $email) {
            // Send an email to the user informing them they are invited to join the event, if they don't exist
            $user = $this->uRepo->findOneBy(['email' => $email]);
            $userEvent = $this->uEventRepo->findOneBy(['email' => $email, 'event' => $data->getEvent()]);
            if ($userEvent) {
                // User already exists and is already invited to the event
                // if invite is cancelled, set to pending again
                if ($userEvent->getStatus() === 'cancelled') {
                    $userEvent->setStatus('pending');
                    $this->uEventRepo->save($userEvent, true);
                }
                continue;
            } else if ($user) {
                try {
                    // User exists, so we can add them to the user event object and persist it
                    $userEvent = new UserEvent();
                    $userEvent->setUser($user);
                    $userEvent->setEvent($data->getEvent());
                    $this->uEventRepo->save($userEvent, true);
                    // Notify user that they have been added to the event
                    $email = (new Email())
                        ->to($email)
                        ->subject('You have been added to an event')
                        ->html('<p>You have been added to the event: ' . $data->getEvent()->getEventTitle() . '</p>');
                    $this->mailer->send($email);
                } catch (\Throwable $th) {
                    $this->logger->error('Error while processing user invite', [
                        'exception' => $th,
                        'email' => $email,
                        'event' => $data->getEvent()->getEventTitle(),
                    ]);
                }
            } else {
                try {
                    // User does not exist, so we can send them an email with a link to register
                    // and create a UserEvent object without a user but with an expected email
                    $userEvent = new UserEvent();
                    $userEvent->setEvent($data->getEvent());
                    $userEvent->setEmail($email);
                    $this->uEventRepo->save($userEvent, true);
                    $inviteLink = $inviteLinkBase . '?eventCode=' . $data->getEventInviteCode() . '&email=' . $email;
                    $emailMessage = (new Email())
                        ->to($email)
                        ->subject('You have been invited to join an event')
                        ->html('<p>Click on the following link to join the event: <a href="' . $inviteLink . '">Join</a></p>');
                    $this->mailer->send($emailMessage);
                } catch (\Throwable $th) {
                    $this->logger->error('Error while sending invite email to new user', [
                        'exception' => $th,
                        'email' => $email,
                        'event' => $data->getEvent()->getEventTitle(),
                    ]);
                }
            }
        }
    }
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $uInv = new UserInvite();
        $uInv->setEvent(
            $this->eRepo->getEventById($uriVariables['eventId'])
        );
        return $uInv;
    }
}
