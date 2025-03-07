<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
<<<<<<< Updated upstream
use ApiPlatform\Metadata\Post;
=======
>>>>>>> Stashed changes
use ApiPlatform\Metadata\Patch;
use Symfony\Component\Validator\Constraints as Assert;
use App\Repository\UserRepository;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping\JoinTable;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Contracts\Service\ServiceCollectionInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:write']],
)]
#[Get(security: "is_granted('view', object)")]
#[Post(
    description: "Creates a new user. Users can only create if they're a platform admin",
)]
#[Patch(security: "is_granted('edit', object)")]
#[ORM\Table(name: 'users')]
class User implements PasswordAuthenticatedUserInterface, UserInterface
{
    /**
     * @var int $id The user ID
     */
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(name: 'id', type: 'integer')]
<<<<<<< Updated upstream
    #[Groups(['user:read', 'user:write'])]
    public int $id;

    #[ORM\Column(length: 255, nullable: true)]
    // #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    #[Groups(['user:read', 'user:write'])]
    public ?string $name = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[Groups(['user:read', 'user:write'])]
    public ?string $email = null;

    #[ORM\Column(name: '"emailVerified"', type: 'datetime', nullable: true)]
    public \DateTimeInterface $emailVerified;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    public ?string $image = null;

    #[ORM\OneToOne(targetEntity: Account::class, mappedBy: 'user', cascade: ['all'])]
    private Account $account;

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $roles = [];

    #[ORM\ManyToMany(targetEntity: Flight::class, inversedBy: "users")]
    #[ORM\JoinTable(name: "users_flights")]
    private Collection $flights;

    #[ORM\ManyToMany(targetEntity: Organization::class, inversedBy: 'users')]
    #[ORM\JoinTable(name: 'organizations_members')]
    private Collection $OrgMembership;

    #[ORM\ManyToMany(targetEntity: Organization::class, inversedBy: 'admins')]
    #[ORM\JoinTable(name: 'organizations_admins')]
    #[Groups(['user:read', 'user:write'])]
    private Collection $AdminOfOrg;

    #[ORM\ManyToMany(targetEntity: Event::class, inversedBy: 'attendees')]
    #[Groups(['user:read', 'user:write'])]
    private Collection $events;

    #[ORM\ManyToMany(targetEntity: Event::class, inversedBy: 'eventAdmins')]
    #[ORM\JoinTable(name: 'eventAdmins_events')]
    // #[Groups(['user:read', 'user:write'])]
    private Collection $adminOfEvents;

    #[ORM\ManyToMany(targetEntity: Organization::class, inversedBy: 'financeAdmins')]
    #[JoinTable(name: 'organizations_finance_admins')]
    private Collection $financeAdminOfOrg;

    #[ORM\ManyToMany(targetEntity: Event::class, inversedBy: 'financeAdmins')]
    #[JoinTable(name: 'events_finance_admins')]
    private Collection $financeAdminOfEvents;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public ?\DateTimeInterface $lastModified = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    public ?\DateTimeInterface $createdDate = null;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $offerId = null;

    public function __construct()
    {
        $this->roles = [];
        $this->flights = new ArrayCollection();
        $this->OrgMembership = new ArrayCollection();
        $this->AdminOfOrg = new ArrayCollection();
        $this->events = new ArrayCollection();
        $this->lastModified = new \DateTime();
        $this->account = new Account($this);
        $this->createdDate = new \DateTime();
        $this->emailVerified = new \DateTime();
    }

    public function getRoles(): array
    {
        // guarantee every user at least has ROLE_USER
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
        // return $this->roles;
    }
    public function setRoles(array $roles): void
    {
        $this->roles = $roles;
    }
    public function eraseCredentials() {}
    public function getUserIdentifier(): string
    {
        return $this->id;
    }
    #[Groups(['user:write'])]
    public function getPassword(): string
    {
        return $this->account->providerAccountId;
    }
    public function getAccount(): Account
    {
        return $this->account;
    }
=======
    #[Groups(['user:read', 'user:write', 'user:read:offers'])]
    private int $id;
>>>>>>> Stashed changes

    /**
     * @return int The user ID
     */
    public function getId(): int
    {
        return $this->id;
    }
    /**
     * @return int $id The user ID
     */
    public function getUserIdentifier(): string
    {
        return $this->getId();
    }

    /**
     * @var string $firstName The first name of the user
     */
    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Length(max: 255)]
    #[Assert\NotNull(message: 'First name cannot be null')]
    #[Groups(['user:read', 'user:write'])]
    private string $firstName;

    /**
     * @return string The first name of the user
     */
    public function getFirstName(): string
    {
        return $this->firstName;
    }
    /**
     * @param string $firstName The first name of the user
     */
    public function setFirstName(string $firstName): void
    {
        $this->firstName = $firstName;
    }

    /**
     * @var string $lastName The last name of the user
     */
    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Length(max: 255)]
    #[Assert\NotNull(message: 'Last name cannot be null')]
    #[Groups(['user:read', 'user:write'])]
    private string $lastName;

    /**
     * @return string The last name of the user
     */
    public function getLastName(): string
    {
        return $this->lastName;
    }
    /**
     * @param string $lastName The last name of the user
     */
    public function setLastName(string $lastName): void
    {
        $this->lastName = $lastName;
    }

    /**
     * @var string $email The email of the user, also functions as the user login. Unique.
     */
    #[ORM\Column(length: 255, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[Assert\NotNull(message: 'Email cannot be null')]
    #[Groups(['user:read', 'user:write'])]
    private string $email;

    /**
     * @return string The email of the user
     */
    public function getEmail(): string
    {
        return $this->email;
    }
    /**
     * @param string $email The email of the user
     * @return void
     * Sets the users email, and resets the emailVerified flag
     */
    public function setEmail(string $email): void
    {
        $this->email = $email;
        $this->emailVerified = false;
    }

    /**
     * @var bool $emailVerified The email verification status of the user
     */
    #[ORM\Column(type: 'boolean')]
    private bool $emailVerified;

    /**
     * @return bool The email verification status of the user
     */
    public function getEmailVerified(): bool
    {
        return $this->emailVerified;
    }
    /**
     * @param bool $emailVerified The email verification status of the user
     */
    public function setEmailVerified(bool $emailVerified): void
    {
        $this->emailVerified = $emailVerified;
    }

    /**
     * @var array $offerIds The offers the user has access to book currently. Set via POST to /flight_offers
     */
    #[ORM\Column(type: 'simple_array', nullable: true)]
    private array $offerIds;

<<<<<<< Updated upstream
    public function setImage(string $image): void
    {
        $this->image = $image;
    }

    public function getLastModified(): \DateTimeInterface
    {
        return $this->lastModified;
    }

    public function setLastModified(\DateTimeInterface $lastModified): void
    {
        $this->lastModified = $lastModified;
    }

    public function getCreatedDate(): \DateTimeInterface
    {
        return $this->createdDate;
    }

    public function setCreatedDate(\DateTimeInterface $createdDate): void
    {
        $this->createdDate = $createdDate;
    }

    public function getFlights(): Collection
    {
        return $this->flights;
    }

    public function setFlights(Collection $flights): void
    {
        $this->flights = $flights;
    }

    public function getOrganizations(): Collection
    {
        return $this->OrgMembership;
    }

    public function setOrganizations(Collection $organizations): void
    {
        $this->OrgMembership = $organizations;
    }

    public function getAdminOfOrg(): Collection
    {
        return $this->AdminOfOrg;
    }

    public function addAdminOfOrg(Organization $organization): void
    {
        if (!$this->AdminOfOrg->contains($organization)) {
            $this->AdminOfOrg[] = $organization;
        }
    }

    public function removeAdminOfOrg(Organization $organization): void
    {
        $this->AdminOfOrg->removeElement($organization);
    }

    public function getOfferId(): ?string
=======
    /**
     * @return array The offers the user has access to book currently
     */
    public function getOfferIds(): array
>>>>>>> Stashed changes
    {
        return $this->offerId;
    }
<<<<<<< Updated upstream

    public function setOfferId(?string $offerId): void
=======
    /**
     * @param array $offerIds The offers the user has access to book currently
     * @return void
     */
    public function addOfferIds($offerId): void
>>>>>>> Stashed changes
    {
        $this->offerId = $offerId;
    }

    public function getEvents(): Collection
    {
        return $this->events;
    }

    public function addEvents(Event $event): void
    {
        if (!$this->events->contains($event)) {
            $this->events[] = $event;
        }
    }
<<<<<<< Updated upstream
    public function removeEvents(Event $event): void
    {
        $this->events->removeElement($event);
=======
    /**
     * @param array $offerIds The offers the user has access to book currently
     * @return void
     */
    public function removeOfferIds($offerId): void
    {
        $this->offerIds = array_diff($this->offerIds, [$offerId]);
    }
    /**
     * Resets the offerIds array when a new offer request is made
     * @return void
     */
    public function resetOffers(): void
    {
        $this->offerIds = [];
>>>>>>> Stashed changes
    }

    /**
     * @var string $phoneNumber The users phone number, in international format
     */
    #[ORM\Column(type: 'string', length: 13)]
    #[Assert\Regex(pattern: '\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$')]
    #[Groups(['user:read', 'user:write'])]
    private string $phoneNumber;

    /**
     * @return string The users phone number, in international format
     */
    public function getPhoneNumber(): string
    {
        return $this->phoneNumber;
    }
    /**
     * @param string $phoneNumber The users phone number, in international format
     * @return void
     */
    public function setPhoneNumber(string $phoneNumber): void
    {
        $this->phoneNumber = $phoneNumber;
    }

    /**
     * @var string $hashedPassword The hashed password of the user
     */
    #[ORM\Column(type: 'string', length: 255)]
    private string $hashedPassword;

    /**
     * @return string the hashed password of the user
     */
    public function getPassword(): string
    {
        return $this->getHashedPassword();
    }
    /**
     * @param string $hashedPassword the hashed password of the user
     * @return void
     * Sets the users password
     */
    public function setPassword(string $hashedPassword): void
    {
        $this->setHashedPassword($hashedPassword);
    }
    /**
     * @return string the hashed password of the user
     */
    public function getHashedPassword(): string
    {
        return $this->hashedPassword;
    }
    /**
     * @param string $hashedPassword the hashed password of the user
     * @return void
     * Sets the users password
     */
    public function setHashedPassword(string $hashedPassword): void
    {
        $this->hashedPassword = $hashedPassword;
    }

    /**
     * @var \DateTimeInterface $birthday The users birthday
     */
    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $birthday;

    /**
     * @return \DateTimeInterface The users birthday
     */
    public function getBirthday(): \DateTimeInterface
    {
        return $this->birthday;
    }
    /**
     * @param \DateTimeInterface $birthday The users birthday
     * @return void
     */
    public function setBirthday(\DateTimeInterface $birthday): void
    {
        $this->birthday = $birthday;
    }

    /**
     * @var string $title The users title, one of [mr, mrs, ms, dr, miss]
     */
    #[ORM\Column(type: 'string', length: 4)]
    #[Groups(['user:read', 'user:write'])]
    #[Assert\Choice(choices: ['mr', 'mrs', 'ms', 'dr', 'miss'], message: 'Choose a valid title, one of [mr, mrs, ms, dr, miss]. Enforced by the airlines.')]
    private string $title;

    /**
     * @return string The users title
     */
    public function getTitle(): string
    {
        return $this->title;
    }
    /**
     * @param string $title The users title
     * @return void
     */
    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    /**
     * @var string $gender The users gender, required by the airlines. One of [m, f]
     */
    #[ORM\Column(type: 'string', length: 5)]
    #[Groups(['user:read', 'user:write'])]
    #[Assert\Choice(choices: ['m', 'f'], message: 'Gender must be one of [m,f]. Enforced by the airlines.')]
    private string $gender;

    /**
     * @return string the users gender
     */
    public function getGender(): ?string
    {
        return $this->gender;
    }
    /**
     * @param string the users gender
     */
    public function setGender(string $gender): void
    {
        $this->gender = $gender;
    }

    /**
     * @var Collection $OrgMembership The organization memberships of the user
     * Only the organization admin can add users, so no setters are needed on this side.
     */
    #[ORM\ManyToMany(targetEntity: Organization::class, inversedBy: 'users', cascade: ['all'])]
    #[ORM\JoinTable(name: 'organizations_members')]
    #[Groups(['user:read', 'user:write'])]
    private Collection $OrgMembership;

    /**
     * @return Collection The organization memberships of the user
     */
    public function getOrgMembership(): Collection
    {
        return $this->OrgMembership;
    }

    /**
     * @var Collection $AdminOfOrg The organizations the user is an admin of
     * Added on the organization side. No setters needed here.
     */
    #[ORM\ManyToMany(targetEntity: Organization::class, inversedBy: 'admins')]
    #[ORM\JoinTable(name: 'organizations_admins')]
    #[Groups(['user:read', 'user:write'])]
    private Collection $AdminOfOrg;

    /**
     * @return Collection The organizations the user is an admin of
     */
    public function getAdminOfOrg(): Collection
    {
        return $this->AdminOfOrg;
    }

    /**
     * @var Collection $flights The flights the user has booked/held
     * @todo change to ManyToOne, since a flight can only be related to one user
     */
    #[ORM\ManyToMany(targetEntity: Flight::class, inversedBy: "users")]
    #[ORM\JoinTable(name: "users_flights")]
    private Collection $flights;

    /**
     * @return Collection The flights the user has booked/held
     */
    public function getFlights(): Collection
    {
        return $this->flights;
    }
    /**
     * @param Collection $flights The flights the user has booked/held
     * @return void
     */
    public function setFlights(Collection $flights): void
    {
        $this->flights = $flights;
    }

    /**
     * @var Collection $adminOfEvents The events the user is attending
     * Added on the event side. No setters needed here.
     */
    #[ORM\ManyToMany(targetEntity: Event::class, mappedBy: 'attendees', cascade: ['all'])]
    #[Groups(['user:read', 'user:write'])]
    private Collection $eventsAttending;

    /**
     * @return Collection The events the user is attending
     */
    public function geteventsAttending(): Collection
    {
        return $this->eventsAttending;
    }
    public function setEventsAttending(Collection $eventsAttending): void
    {
        $this->eventsAttending = $eventsAttending;
    }

    /**
     * @var Collection $adminOfEvents The events the user is a finance admin of
     */
    #[ORM\ManyToMany(targetEntity: Organization::class, inversedBy: 'financeAdmins')]
    #[JoinTable(name: 'organizations_finance_admins')]
    private Collection $financeAdminOfOrg;

    /**
     * @return Collection The events the user is a finance admin of
     */
    public function getFinanceAdminOfOrg(): Collection
    {
        return $this->financeAdminOfOrg;
    }

    /**
     * @var \DateTimeInterface The date the user was created
     */
    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $createdOn;
    /**
     * @return \DateTimeInterface The date the user was created
     */
    public function getRegisterDate(): \DateTimeInterface
    {
        return $this->createdOn;
    }

    /**
     * @var bool $superAdmin The super admin status of the user
     */
    #[ORM\Column(type: 'boolean')]
    private bool $superAdmin;

    /**
     * @var array $roles The roles of the user
     */
    public function getRoles(): array
    {
        // guarantee every user at least has ROLE_USER
        if ($this->superAdmin) {
            return ['ROLE_ADMIN'];
        }
        return [];
    }
    /**
     * @return bool The super admin status of the user
     */
    public function getSuperAdmin(): bool
    {
        return $this->superAdmin;
    }
    /**
     * @return void The super admin status of the user
     */
    public function setSuperAdmin(bool $superAdmin): void
    {
        $this->superAdmin = $superAdmin;
    }

    /**
     * @var string $passengerId The passenger ID of the user, from the last flight_offer post
     */
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $passengerId = null;

    /**
     * @return string The passenger ID of the user
     */
    public function getPassengerId(): ?string
    {
        return $this->passengerId;
    }
    /**
     * @param string $passengerId The passenger ID of the user
     * @return void
     */
    public function setPassengerId(string $passengerId): void
    {
        $this->passengerId = $passengerId;
    }

    /**
     * @param string plainPassword not an ORM field, used to set the password
     */
    private ?string $plainPassword = null;

    /**
     * @return string The plain password of the user
     */
    public function getPlainPassword(): string
    {
        return $this->plainPassword;
    }
    /**
     * @param string $plainPassword The plain password of the user
     * @return void
     */
    public function setPlainPassword(string $plainPassword): void
    {
        $this->plainPassword = $plainPassword;
    }

    /**
     * @param string $firstName The first name of the user
     * @param string $lastName The last name of the user
     * @param string $email The email of the user
     * @param string $phoneNumber The phone number of the user
     * @param string $hashedPassword The hashed password of the user
     * @param \DateTimeInterface $birthday The birthday of the user
     * @param \DateTimeInterface $createdOn The date the user was created
     * @param string $title The title of the user
     * @param string $gender The gender of the user
     * @param bool $emailVerified The email verification status of the user
     * @param bool $superAdmin The super admin status of the user
     * @param string|null $plainPassword The plain password of the user
     * @param Collection|null $OrgMembership The organization memberships of the user
     * @param Collection|null $AdminOfOrg The organizations the user is an admin of
     * @param Collection|null $flights The flights the user has booked/held
     * @param Collection|null $eventsAttending The events the user is attending
     * @param Collection|null $financeAdminOfOrg The events the user is a finance admin of
     */
    public function __construct(
        string $firstName,
        string $lastName,
        string $email,
        string $phoneNumber,
        string $hashedPassword,
        \DateTimeInterface $birthday,
        \DateTimeInterface $createdOn,
        string $title,
        string $gender,
        bool $emailVerified = false,
        bool $superAdmin = false,
        ?string $plainPassword = null,
        ?Collection $OrgMembership = new ArrayCollection(),
        ?Collection $AdminOfOrg = new ArrayCollection(),
        ?Collection $flights = new ArrayCollection(),
        ?Collection $eventsAttending = new ArrayCollection(),
        ?Collection $financeAdminOfOrg = new ArrayCollection()
    ) {
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->email = $email;
        $this->phoneNumber = $phoneNumber;
        $this->hashedPassword = $hashedPassword;
        $this->birthday = $birthday;
        $this->title = $title;
        $this->gender = $gender;
        $this->emailVerified = $emailVerified;
        $this->superAdmin = $superAdmin;
        $this->createdOn = ($createdOn) ? $createdOn : new \DateTime(); // set create date to now if not provided
        $this->plainPassword = $plainPassword;
        // set the collections to empty if not provided
        $this->OrgMembership = $OrgMembership;
        $this->AdminOfOrg = $AdminOfOrg;
        $this->flights = $flights;
        $this->eventsAttending = $eventsAttending;
        $this->financeAdminOfOrg = $financeAdminOfOrg;
    }
    public function eraseCredentials(): void
    {
        $this->plainPassword = null;
    }
}
