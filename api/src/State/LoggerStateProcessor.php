<?php

namespace App\State;

use ApiPlatform\State\ProcessorInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use App\Entity\ChangeManagement\ChangeLogging;
use ApiPlatform\Metadata\Operation;

/**
 * Global Doctrine State Processor for Logging Entity Changes
 */
class LoggerStateProcessor implements ProcessorInterface
{
    /**
     * Dependencies
     */
    private ProcessorInterface $processor;
    private EntityManagerInterface $entityManager;
    private Security $security;

    /**
     * Constructor
     */
    public function __construct(ProcessorInterface $processor, Security $security, EntityManagerInterface $entityManager)
    {
        $this->processor = $processor;
        $this->entityManager = $entityManager;
        $this->security = $security;
    }
    /**
     * Process the state of an entity and log changes
     * @param mixed $data The data to process (entity object)
     * @param Operation $operation The operation being executed
     * @param array $uriVariables URI variables for the operation
     * @param array $context Additional context for the operation
     * @return mixed The processed data (usually the persisted entity)
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        // Get the current user's full name
        $username = $this->getCurrentUserFullName();

        // Determine the operation name (e.g., 'put', 'patch', 'delete', 'post')
        $operationName = strtolower($operation->getMethod());

        // Capture before state (for put, patch, delete)
        $beforeChange = [];
        if (in_array($operationName, ['put', 'patch', 'delete'], true)) {
            $beforeChange = $this->maskSensitiveFields($this->extractEntityData($data));
        }

        // Process the operation (persist, update, delete)
        $result = $this->processor->process($data, $operation, $uriVariables, $context);

        // Capture after state (for all operations except delete)
        $afterChange = ($operationName !== 'delete')
            ? $this->maskSensitiveFields($this->extractEntityData($result))
            : [];

        // Compute changes between before and after and records it in $changes
        $changes = $this->computeChanges($beforeChange, $afterChange);

        // Only log if something actually changed
        // if (!empty($changes)) {
        //     $logEntry = new ChangeLogging($username, $operationName, $beforeChange, $afterChange, $changes);
        //     $this->entityManager->persist($logEntry);
        // }

        //Flush
        // $this->entityManager->flush();

        return $result;
    }




    // Helper methods

    /**
     * Get the full name of the current user
     * @return string The full name of the current user or 'Unknown User' if not available
     */
    private function getCurrentUserFullName(): string
    {
        $user = $this->security->getUser();
        return $user ? ($user->getName()) : 'Unknown User';
    }

    /**
     * Extracts the data from an entity into an associative array
     * @param object $entity The entity object to extract data from
     * @return array Associative array of entity data
     */
    private function extractEntityData(object $entity): array
    {
        $reflectionClass = new \ReflectionClass($entity);
        $data = [];
        foreach ($reflectionClass->getProperties() as $property) {
            $property->setAccessible(true);
            $data[$property->getName()] = $property->isInitialized($entity)
                ? $property->getValue($entity)
                : null;
        }
        return $data;
    }

    /**
     * Sensitive fields to mask in logs
     * @var $sensitiveFields array: Add any sensitive fields here
     */
    private array $sensitiveFields = ['hashedPassword'];

    /**
     * Mask sensitive fields in the data array
     * @param array $data The data array to mask
     * @return array The masked data array
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
     * Compute the changes between before and after states
     * @param array $before The before state data
     * @param array $after The after state data
     * @return array An array of changes with 'before' and 'after' values
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
// End of LoggerStateProcessor.php