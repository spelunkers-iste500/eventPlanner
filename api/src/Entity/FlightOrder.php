<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\State\DuffelOrderProvider;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\State\DuffelOrderState;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource]
#[GetCollection(
    provider: DuffelOrderState::class,
    uriTemplate: '/flight_orders/search/{offerId}/{passenger_id}/{title}/{gender}/{email}/{birthday}/{phone_number}.{_format}',
    uriVariables: ['offerId', 'passenger_id', 'title', 'gender', 'birthday', 'phone_number'],
)]
#[GetCollection(
    provider: DuffelOrderState::class,
    uriTemplate: '/flight_orders/search/{offerId}/{passenger_id}/{title}/{gender}/{email}/{birthday}/{phone_number}.{_format}',
    uriVariables: ['offerId', 'passenger_id', 'title', 'gender', 'birthday', 'phone_number'],
)]
#[Post(
    processor: DuffelOrderState::class,
    normalizationContext: ['groups' => ['read:flightOrder']],
    denormalizationContext: ['groups' => ['write:flightOrder']]
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
    public ?string $data;


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

    public function setData(string $data)
    {
        $this->data = $data;
    }
}
