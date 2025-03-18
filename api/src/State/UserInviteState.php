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
        // $email = (new Email())
        //     ->to($data->getEmail())
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
