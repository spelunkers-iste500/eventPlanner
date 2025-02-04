<?php
// src/App/EventListener/JWTCreatedListener.php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Psr\Log\LoggerAwareInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Psr\Log\LoggerInterface;

class JWTCreatedListener
{
    protected $cookies;
    protected LoggerInterface $logger;
    /**
     * @param JWTCreatedEvent $event
     *
     * @return void
     */
    public function __construct(protected RequestStack $requestStack, LoggerInterface $logger)
    {
        $this->logger = $logger;
    }
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        // need to get the users session token to add to the jwt token        
        $payload        = $event->getData();
        $this->logger->debug('JWTCreatedListener: onJWTCreated: payload: ' . json_encode($payload));
        $payload['sessionToken'] = $this->requestStack->getCurrentRequest()->cookies->get('__Secure-next-auth_session-token');
        $this->logger->debug('JWTCreatedListener: onJWTCreated: session_token: ' . $payload['sessionToken']);

        $event->setData($payload);
    }
}
