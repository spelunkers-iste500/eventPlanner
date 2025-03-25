<?php

namespace App\Entity\ChangeManagement;
use Ramsey\Uuid\Lazy\LazyUuidFromString;
use Ramsey\Uuid\Rfc4122\UuidInterface;
use Ramsey\Uuid\Uuid;

use Doctrine\ORM\Mapping as ORM;

/**
 * Entity for logging changes made to records.
 * Stores details about modifications, including the user who made the change,
 * the previous and new values, and what specifically changed.
 */
#[ORM\Entity]
#[ORM\Table(name: "change_logging")]
class ChangeLogging
{
    /**
     * @var UuidInterface $id The user ID
     */
    #[ORM\Id]
    #[ORM\Column(name: 'id', type: 'uuid', unique: true)]
    #[Groups(['user:read', 'user:read:offers', 'user:create', 'user:org:read'])]
    private $id;

     /**
     * @return UuidInterface The user ID
     */
    public function getId(): UuidInterface | LazyUuidFromString
    {
        return $this->id;
    }
    /**
     * @return uuid The user ID
     */
    public function getUuid(): UuidInterface | LazyUuidFromString
    {
        return $this->id;
    }
    public function __toString(): string
    {
        return $this->getId()->toString();
    }
    public function setUuid(UuidInterface $id): void
    {
        $this->id = $id;
    }
    public function setId(UuidInterface $id): void
    {
        $this->id = $id;
    }

    /** Timestamp of when the log entry was created.*/
    #[ORM\Column(type: "datetime")]
    private \DateTimeInterface $createdDate;

    /** Operation Type.*/
    #[ORM\Column(type: "string", length: 255)]
    private string $operationType;

    /** Name of the user who made the change.*/
    #[ORM\Column(type: "string", length: 255)]
    private string $modifiedBy;

    /** The state of the entity before the change, stored as a JSON array.*/
    #[ORM\Column(type: "json")]
    private array $beforeChange;

    /** The state of the entity after the change, stored as a JSON array.*/
    #[ORM\Column(type: "json")]
    private array $afterChange;

    /** A structured JSON array detailing what specific fields changed.*/
    #[ORM\Column(type: "json")]
    private array $changes;

    /** Constructor to initialize log entry with user, before/after states, and changes.*/
    public function __construct(string $modifiedBy, string $operationType, array $beforeChange, array $afterChange, array $changes)
    {
        $this->id = Uuid::uuid4();
        $this->createdDate = new \DateTime();
        $this->modifiedBy = $modifiedBy;
        $this->beforeChange = $beforeChange;
        $this->afterChange = $afterChange;
        $this->changes = $changes;
        $this->operationType = $operationType;
    }

    /** Get the unique ID of the change log entry.*/
    public function getChangeID(): ?int
    {
        return $this->changeID;
    }

    /** Get the timestamp of the last modification.*/
    public function getLastModified(): \DateTimeInterface
    {
        return $this->lastModified;
    }

    /** Set the last modification timestamp to the current time.*/
    public function setLastModified(): void
    {
        $this->lastModified = new \DateTime();
    }

    /**Get the creation timestamp of the log entry.*/
    public function getCreatedDate(): \DateTimeInterface
    {
        return $this->createdDate;
    }

    /** Get the name of the user who made the change.*/
    public function getModifiedBy(): string
    {
        return $this->modifiedBy;
    }

    /*** Get the state of the entity before the change. */
    public function getOperationType(): string
    {
        return $this->operationType;
    }

    /*** Get the state of the entity before the change. */
    public function getBeforeChange(): array
    {
        return $this->beforeChange;
    }

    /** Get the state of the entity after the change.*/
    public function getAfterChange(): array
    {
        return $this->afterChange;
    }

    /** Get the detailed changes made to the entity.*/
    public function getChanges(): array
    {
        return $this->changes;
    }
}
