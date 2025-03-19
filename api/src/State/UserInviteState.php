<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use ApiPlatform\State\ProviderInterface;
use App\Entity\UserInvite;
use App\Repository\OrganizationRepository;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class UserInviteState implements ProcessorInterface, ProviderInterface
{
    public function __construct(private OrganizationRepository $orgRepo, private MailerInterface $mailer) {}
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        // $data is the userInvite object
        $data->setOrganization(
            $this->orgRepo->getOrganizationById($uriVariables['organizationId'])
        );
        // We now have an objet with a list of emails, and an organization invite code.
        // We can now send the emails to the users, using the invite code.
        // invite link should be localhost for dev, and the actual domain for production
        if ($_ENV['APP_ENV'] === 'dev') {
            $inviteLinkBase = 'https://localhost/register';
        } else {
            $inviteLinkBase = 'http://staging.spelunkers.xeanto.us/register';
        }
        foreach ($data->getEmails() as $email) {
            $inviteLink = $inviteLinkBase . '?orgCode=' . $data->getOrganizationInviteCode() . '&email=' . $email;
            $email = (new Email())
                ->to($email)
                ->subject('You have been invited to join an organization')
                ->html('<p>Click on the following link to join the organization: <a href="' . $inviteLink . '">Join</a></p>');
            $this->mailer->send($email);
        }
    }
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $uInv = new UserInvite();
        $uInv->setOrganization(
            $this->orgRepo->getOrganizationById($uriVariables['organizationId'])
        );
        return $uInv;
    }
}
