<?php
// api/src/State/DuffelOrderProvider.php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\FlightOrder;
use App\Entity\Budget;
use ApiPlatform\State\ProcessorInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * This processes the order info and updates the budget for the end users
 */
final class DuffelOrderProcessor implements ProcessorInterface
{
    public function __construct(private EntityManagerInterface $entityManager, private HttpClientInterface $client) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        /* 
        *
        *   This is where a flight order is processed (held) and the bduget updated.
        *   Since, currently, each flight will be approved manually, no guard rails will be put in place.
        *   This is a simple implementation to show the concept of state machines.
        */

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
