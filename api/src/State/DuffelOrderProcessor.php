<?php
// api/src/State/DuffelOrderProvider.php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\FlightOrder;
use App\Entity\Budget;
use Symfony\Bundle\SecurityBundle\Security;
use ApiPlatform\State\ProcessorInterface;

/**
 * This processes the order info and updates the budget for the end users
 */
final class DuffelOrderProcessor implements ProcessorInterface{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if (!$data instanceof FlightOrder) {
            throw new \InvalidArgumentException('Expected a FlightOrder entity.');
        }

        $orderTotal = (float) $data; //FIND A WAY TO PARSE THIS

        // Fetch the budget (assuming only one budget exists)
        $budget = $this->entityManager->getRepository(Budget::class)->findOneBy([]);

        if (!$budget) {
            throw new \RuntimeException('No budget found.');
        }

        // Convert budget fields to float
        $currentTotal = (float) $budget->total;
        $currentSpent = (float) $budget->spentBudget;

        // Ensure there's enough budget
        if ($currentTotal < $orderTotal) {
            throw new \RuntimeException('Insufficient budget for this flight.');
        }

        // Deduct from total and add to spent
        $budget->total = (string) ($currentTotal - $orderTotal);
        $budget->spentBudget = (string) ($currentSpent + $orderTotal);
        $budget->lastModified = new \DateTime(); // Update timestamp

        $this->entityManager->persist($budget);
        $this->entityManager->flush();

        return $data;
}
}