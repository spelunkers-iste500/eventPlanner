<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use App\State\FlightOrderState;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource]
#[Get(
    provider: FlightOrderState::class,
    security: "is_granted('view', object)",
    description: 'Retrieves flight order details for users with view permissions.'
)]
#[Post(
    processor: FlightOrderState::class,
    denormalizationContext: ['groups' => ['write:flightOrder']],
    description: 'Creates a new flight order with passenger and event data, returning the FlightOrder resource.'
)]

class FlightOrder
{
    #[ApiResource(identifier: true)]
    public ?string $id;
    #[Groups(['read:flightOrder', 'write:flightOrder'])]
    public string $offerId;
    public ?string $passenger_id;
    public ?string $first_name;
    public ?string $family_name;
    public ?string $title;
    public ?string $gender;
    public ?string $email;
    public ?string $birthday;
    public ?string $phone_number;
    public ?array $data;
    #[Groups(['write:flightOrder'])]
    public ?UserEvent $userEvent = null;

    public function __construct(string $offerId, ?string $order_id = null, ?string $passenger_id = null, ?string $first_name = null, ?string $family_name = null, ?string $title = null, ?string $gender = null, ?string $email = null, ?string $birthday = null, ?string $phone_number = null)
    {
        $this->id = $order_id;
        $this->offerId = $offerId;
        $this->passenger_id = $passenger_id;
        $this->first_name = $first_name; // if return date is null, then not round trip
        $this->family_name = $family_name;
        $this->title = $title;
        $this->gender = $gender;
        $this->email = $email;
        $this->birthday = $birthday;
        $this->phone_number = $phone_number;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function setId(string $id)
    {
        $this->id = $id;
    }

    public function setData(array $data)
    {
        $this->data = $data;
    }
}
