<?php

namespace App\State;

use ApiPlatform\State\ProcessorInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use App\Entity\ChangeManagement\ChangeLogging;
use ApiPlatform\Metadata\Operation;

/**
 * Global Doctrine State Processor for Logging Entity Changes
 * This processor logs all create, update, and delete operations
 * for all entities, tracking before/after states and masking sensitive fields.
 */
class LoggerStateProcessor implements ProcessorInterface
{
    private EntityManagerInterface $entityManager;
    private Security $security;

    /**
     * List of sensitive fields that should be masked in logs.
     */
    private array $sensitiveFields = ['hashedPassword'];

    public function __construct(EntityManagerInterface $entityManager, Security $security)
    {
        $this->entityManager = $entityManager;
        $this->security = $security;
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        $username = $this->getCurrentUserFullName();
        $operationName = strtolower($operation->getMethod());

        // Capture before state for updates and deletes
        $beforeChange = [];
        if (($operationName === 'put' || $operationName === 'patch' || $operationName === 'delete') && method_exists($data, 'getId')) {
            $originalData = $this->entityManager->getUnitOfWork()->getOriginalEntityData($data);
            $beforeChange = $this->maskSensitiveFields($originalData);
        }

        // Execute the primary operation first (saving/deleting entity)
        $data = $this->entityManager->merge($data);
        //$this->entityManager->flush();

        // Capture after state (should be extracted AFTER flush)
        $afterChange = ($operationName !== 'delete') ? $this->maskSensitiveFields($this->extractEntityData($data)) : [];

        // Compute differences
        $changes = $this->computeChanges($beforeChange, $afterChange);

        // Save the change log
        $logEntry = new ChangeLogging($username, $operationName, $beforeChange, $afterChange, $changes);
        $this->entityManager->persist($logEntry);
        $this->entityManager->flush();

        //return $data;
    }

    /**
     * Retrieves the full name of the authenticated user.
     */
    private function getCurrentUserFullName(): string
    {
        $user = $this->security->getUser();
        return $user ? ($user->getName()) : 'Unknown User';
    }

    /**
     * Extracts entity data into an array, ensuring only relevant fields are captured.
     */
    private function extractEntityData(object $entity): array
    {
        $reflectionClass = new \ReflectionClass($entity);
        $data = [];
        foreach ($reflectionClass->getProperties() as $property) {
            $property->setAccessible(true);

            // Check if the property is initialized before accessing it
            if ($property->isInitialized($entity)) {
                $data[$property->getName()] = $property->getValue($entity);
            } else {
                $data[$property->getName()] = null; // Set default value
            }
        }
        return $data;
    }


    /**
     * Masks sensitive fields in the given entity data.
     */
    private function maskSensitiveFields(array $data): array
    {
        foreach ($this->sensitiveFields as $field) {
            if (array_key_exists($field, $data)) {
                $data[$field] = '*****';
            }
        }
        return $data;
    }

    /**
     * Computes changes between before and after entity states.
     */
    private function computeChanges(array $before, array $after): array
    {
        $changes = [];


        foreach ($after as $key => $newValue) {
            $oldValue = $before[$key] ?? null;
            if ($oldValue !== $newValue) {
                $changes[$key] = ['before' => $oldValue, 'after' => $newValue];
            }
        }


        return $changes;
    }
}
