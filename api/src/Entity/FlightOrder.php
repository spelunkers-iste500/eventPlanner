<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\State\DuffelOrderProvider;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;

#[ApiResource]
#[GetCollection(
    provider: DuffelOrderProvider::class,
    uriTemplate: '/flight_orders/{offer_id}/{passenger_id}/{first_name}/{family_name}/{title}/{gender}/{email}/{birthday}/{phone_number}.{_format}',
    uriVariables: ['offer_id', 'passenger_id', 'first_name', 'family_name', 'title', 'gender', 'email', 'birthday', 'phone_number', 'data'],
)]
#[GetCollection(
    provider: DuffelOrderProvider::class,
    uriTemplate: '/flight_orders/{offer_id}/{passenger_id}/{first_name}/{family_name}/{title}/{gender}/{email}/{birthday}/{phone_number}.{_format}',
    uriVariables: ['offer_id', 'passenger_id', 'first_name', 'family_name', 'title', 'gender', 'email', 'birthday', 'phone_number', 'data'],
)]
#[Get(
    provider: DuffelOrderProvider::class,
)]
class FlightOrder
{
    #[ApiResource(identifier: true)]
    public string $id;
    public string $offer_id;
    public string $passenger_id;
    public string $first_name;
    public string $family_name;
    public string $title;
    public string $gender;
    public string $email;
    public string $birthday;
    public string $phone_number;
    public string $data;
    

    public function __construct(string $order_id, string $offer_id, string $passenger_id, string $first_name, string $family_name, string $title, string $gender, string $email, string $birthday, string $phone_number)
    {
        $this->id = $order_id;
        $this->offer_id = $offer_id;
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

    public function setData(string $data){
        $this->data = $data;
    }
}

