<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use Symfony\Component\Validator\Constraints as Assert;
use App\Repository\UserRepository;
use App\State\CurrentUserProvider;
use App\State\UserPasswordHasher;
use App\State\LoggerStateProcessor;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping\JoinTable;
use Ramsey\Uuid\Lazy\LazyUuidFromString;
use Ramsey\Uuid\Rfc4122\UuidInterface;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ApiResource]
//User.Get.Info
#[Get(
    security: "is_granted('view', object)",
    normalizationContext: ['groups' => ['user:read']]
)]
#[Get(
    uriTemplate: '/my/user.{_format}',
    security: "is_granted('view', object)",
    normalizationContext: ['groups' => ['user:read']],
    provider: CurrentUserProvider::class
)]
//User.Create --This is working how I expect so far
#[Post(
    description: "Creates a new user. Users can only create if they're a platform admin",
    processor: UserPasswordHasher::class,
    denormalizationContext: ['groups' => ['user:create']],
)]
//Org.Admin.View
#[GetCollection(
    uriTemplate: '/organizations/{orgId}/users/.{_format}',
    uriVariables: [
        'orgId' => new Link(
            fromClass: Organization::class,
            fromProperty: 'id',
            toClass: User::class,
            toProperty: 'OrgMembership',
            description: 'The ID of the organization that owns the users'
        )
    ],
    normalizationContext: ['groups' => ['user:org:read']]
)]
//User.Change --This is working how I expect so far
#[Patch(
    uriTemplate: '/users/{id}.{_format}',
    security: "is_granted('edit', object)", // Checks edit permission for the specific user
    denormalizationContext: ['groups' => ['edit:user:limited']],
    processor: LoggerStateProcessor::class
)]
//User.Admin.delete
#[Delete(
    security: "is_granted('ROLE_ADMIN')",
    description: "Deletes a User. Users can only delete if they're a platform admin",
    processor: LoggerStateProcessor::class
)]

//Event.User.Book
#[Get(
    security: "is_granted('view', object)",
    uriTemplate: '/my/event/{id}.{_format}',
    #requirements: ['id' => '\d+'],
    normalizationContext: ['groups' => ['read:event:booking']]
)]

//Event.User.Dashbaord will be handled when a User Object is collected and then calling eventsAttended() method to pull events attended

#[ORM\Table(name: 'users')]
class User implements PasswordAuthenticatedUserInterface, UserInterface
{
    /**
     * @var UuidInterface $id The user ID
     */
    #[ORM\Id]
    #[ORM\Column(name: 'id', type: 'uuid', unique: true)]
    #[Groups(['user:read', 'user:read:offers', 'user:org:read'])]
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
    /**
     * @return string $email The users email for logging in
     */
    public function getUserIdentifier(): string
    {
        return $this->getEmail();
    }
    public function getUsername(): string
    {
        return $this->getEmail();
    }
    public function setUuid(UuidInterface $id): void
    {
        $this->id = $id;
    }
    public function setId(UuidInterface $id): void
    {
        $this->id = $id;
    }

    /**
     * @var string $firstName The first name of the user
     */
    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Length(max: 255)]
    #[Assert\NotNull(message: 'First name cannot be null')]
    #[Groups(['user:write', 'user:create', 'edit:user:limited', 'user:org:read'])]
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
    #[Groups(['user:write', 'user:create', 'edit:user:limited', 'user:org:read'])]
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
     * @var string $name The full name of the user
     */
    #[Groups(['user:read'])]
    private string $name;
    public function getName(): string
    {
        return $this->firstName . ' ' . $this->lastName;
    }

    /**
     * @var string $email The email of the user, also functions as the user login. Unique.
     */
    #[ORM\Column(length: 255, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[Assert\NotNull(message: 'Email cannot be null')]
    #[Groups(['user:read', 'user:write', 'user:create', 'edit:user:limited', 'user:org:read'])]
    public string $email;

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
    #[Groups(['user:read'])]
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

    /**
     * @return array The offers the user has access to book currently
     */
    public function getOfferIds(): array
    {
        return $this->offerIds;
    }
    /**
     * @param array $offerIds The offers the user has access to book currently
     * @return void
     */
    public function addOfferIds($offerId): void
    {
        if (!in_array($offerId, $this->offerIds)) {
            $this->offerIds[] = $offerId;
        }
    }
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
    }

    /**
     * @var string $phoneNumber The users phone number, in international format
     */
    #[ORM\Column(type: 'string', length: 13)]
    // #[Assert\Regex(pattern: '\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$')]
    #[Groups(['user:read', 'user:write', 'user:create', 'edit:user:limited', 'user:org:read'])]
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
    private ?string $hashedPassword;

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
    public function setPassword(string $hashedPassword): self
    {
        $this->setHashedPassword($hashedPassword);
        return $this;
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
    #[Groups(['user:read', 'user:write', 'user:create'])]
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
    #[Groups(['user:read', 'user:write', 'user:create', 'edit:user:limited'])]
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
    #[Groups(['user:read', 'user:write', 'user:create', 'edit:user:limited'])]
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
     * @var Collection $AdminOfOrg The organizations the user is an admin of
     * Added on the organization side. No setters needed here.
     */
    #[ORM\ManyToMany(targetEntity: Organization::class, inversedBy: 'admins', cascade: ['all'])]
    #[ORM\JoinTable(name: 'organizations_admins')]
    #[Groups(['user:write'])] //remove edit:user:limited for prod
    private Collection $AdminOfOrg;

    /**
     * @return Collection The organizations the user is an admin of
     */
    public function getAdminOfOrg(): Collection
    {
        return $this->AdminOfOrg;
    }
    public function setAdminOfOrg(Collection $AdminOfOrg): void
    {
        $this->AdminOfOrg = $AdminOfOrg;
    }
    public function addAdminOfOrg(Organization $org): void
    {
        if (!$this->AdminOfOrg->contains($org)) {
            $this->AdminOfOrg[] = $org;
            //$org->addAdmin($this);
        }
    }

    /**
     * @var Collection $flights The flights the user has booked/held
     * @todo change to ManyToOne, since a flight can only be related to one user
     */
    #[ORM\OneToMany(targetEntity: Flight::class, mappedBy: 'user')]
    #[Groups([
        'read:myEvents',
        'user:read'
    ])]
    private Collection $flights;
    /**
     * @param Collection $flights The flights the user has booked/held
     * @return Collection
     */

    public function getFlights(): Collection
    {
        return $this->flights;
    }

    public function setFlights(Collection $flights): void
    {
        $this->flights = $flights;
    }

    /**
     * @var Collection $eventsAttending The events the user is attending
     */
    #[ORM\OneToMany(targetEntity: UserEvent::class, mappedBy: 'user')]
    #[Groups(['user:read', 'user:write', 'read:event:booking', 'read:event', 'edit:user:limited'])]
    protected Collection $eventsAttending;

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
    public function addEventAttending(Event $event): void
    {
        if (!$this->eventsAttending->contains($event)) {
            $this->eventsAttending[] = $event;
            //$event->addAttendee($this);
        }
    }

    /**
     * @var Collection $adminOfEvents The events the user is a finance admin of
     */
    #[ORM\ManyToMany(targetEntity: Organization::class, inversedBy: 'financeAdmins', cascade: ['all'])]
    #[JoinTable(name: 'organizations_finance_admins')]
    private Collection $financeAdminOfOrg;

    /**
     * @return Collection The events the user is a finance admin of
     */
    public function getFinanceAdminOfOrg(): Collection
    {
        return $this->financeAdminOfOrg;
    }
    public function setFinanceAdminOfOrg(Collection $financeAdminOfOrg): void
    {
        $this->financeAdminOfOrg = $financeAdminOfOrg;
    }
    public function addFinanceAdminOfOrg(Organization $org): void
    {
        if (!$this->financeAdminOfOrg->contains($org)) {
            $this->financeAdminOfOrg[] = $org;
            //$org->addFinanceAdmin($this);
        }
    }
    #[ORM\ManyToMany(targetEntity: Organization::class, inversedBy: 'eventadmins', cascade: ['all'])]
    #[JoinTable(name: 'organizations_event_admins')]
    #[Groups(['user:read'])]
    private Collection $eventAdminOfOrg;

    /**
     * @return Collection The events the user is a event admin of
     */
    public function getEventAdminOfOrg(): Collection
    {
        return $this->eventAdminOfOrg;
    }
    public function setEventAdminOfOrg(Collection $eventAdminOfOrg): void
    {
        $this->eventAdminOfOrg = $eventAdminOfOrg;
    }
    public function addEventAdminOfOrg(Organization $org): void
    {
        if (!$this->eventAdminOfOrg->contains($org)) {
            $this->eventAdminOfOrg[] = $org;
            //$org->addEventAdmin($this);
        }
    }

    /**
     * @var \DateTimeInterface The date the user was created
     */
    #[ORM\Column(type: 'datetime')]
    #[Groups(['user:read'])]
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
    #[Groups(['user:read', 'user:create', 'user:write'])] //remove create and create for prod
    private bool $superAdmin;

    /**
     * @var array $roles The roles of the user
     */
    public function getRoles(): array
    {
        //guarantee every user at least has ROLE_USER
        if (
            $this->superAdmin // sysadmins
        ) {
            return ['ROLE_ADMIN'];
        }
        return [null];
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
     * @var string $otpSecret the secret for the two factor authentication
     */
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $otpSecret = null;

    /**
     * @return string The secret for the two factor authentication
     */
    public function getOtpSecret(): ?string
    {
        return $this->otpSecret;
    }
    /**
     * @param string $otpSecret The secret for the two factor authentication
     * @return void
     */
    public function setOtpSecret(string $otpSecret): void
    {
        $this->otpSecret = $otpSecret;
    }

    /**
     * @var string $passengerId The passenger ID of the user, from the last flight_offer post
     */
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups(['user:read'])]
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
    #[Groups(['user:create', 'edit:user:limited'])]
    private ?string $plainPassword = null;

    /**
     * @return string The plain password of the user
     */
    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }
    /**
     * @param string $plainPassword The plain password of the user
     * @return void
     */
    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;
        return $this;
    }

    #[Groups(['user:create'])]
    private ?string $eventCode = null;

    #[Groups(['user:create'])]
    private ?string $userOrgInviteId = null;

    public function getUserOrgInviteId(): ?string
    {
        return $this->userOrgInviteId;
    }
    public function setUserOrgInviteId(string $userOrgInviteId): void
    {
        $this->userOrgInviteId = $userOrgInviteId;
    }
    /**
     * @var Collection<int, OrganizationInvite>
     */
    #[ORM\OneToMany(mappedBy: 'invitedUser', targetEntity: OrganizationInvite::class)]
    // #[Groups('user:create')]
    private Collection $organizationInvites;

    public function getEventCode(): ?string
    {
        return $this->eventCode;
    }
    public function setEventCode(string $eventCode): void
    {
        $this->eventCode = $eventCode;
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
        \DateTimeInterface $birthday,
        string $title,
        string $gender,
        bool $emailVerified = false,
        bool $superAdmin = false,
        ?string $hashedPassword = null,
        ?string $plainPassword = null,
        ?\DateTimeInterface $createdOn = null,
        ?Collection $OrgMembership = new ArrayCollection(),
        ?Collection $AdminOfOrg = new ArrayCollection(),
        ?Collection $flights = new ArrayCollection(),
        ?Collection $eventsAttending = new ArrayCollection(),
        ?Collection $financeAdminOfOrg = new ArrayCollection()
    ) {
        $this->id = Uuid::uuid4();
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
        $this->AdminOfOrg = $AdminOfOrg;
        $this->flights = $flights;
        $this->eventsAttending = $eventsAttending;
        $this->financeAdminOfOrg = $financeAdminOfOrg;
        $this->organizationInvites = new ArrayCollection();
    }
    public function eraseCredentials(): void
    {
        $this->plainPassword = null;
    }

    /**
     * @return Collection<int, OrganizationInvite>
     */
    public function getOrganizationInvites(): Collection
    {
        return $this->organizationInvites;
    }

    public function addOrganizationInvite(OrganizationInvite $organizationInvite): static
    {
        if (!$this->organizationInvites->contains($organizationInvite)) {
            $this->organizationInvites->add($organizationInvite);
            $organizationInvite->setInvitedUser($this);
        }

        return $this;
    }

    public function removeOrganizationInvite(OrganizationInvite $organizationInvite): static
    {
        if ($this->organizationInvites->removeElement($organizationInvite)) {
            // set the owning side to null (unless already changed)
            if ($organizationInvite->getInvitedUser() === $this) {
                $organizationInvite->setInvitedUser(null);
            }
        }

        return $this;
    }
}
