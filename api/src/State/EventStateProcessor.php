<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Repository\EventRepository;
use App\State\LoggerStateProcessor;


/**
 * This class exists to add users to an event instead of setting users to an event
 */
class EventStateProcessor implements ProcessorInterface
{
    public function __construct(
        private EventRepository $eventRepository, 
        private LoggerStateProcessor $changeLogger,
    ){}
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        // get the attendees from the event object that was passed in
        $attendees = $data->getAttendees()->toArray();
        // get the current state from the database using the repository
        $event = $this->eventRepository->getEventById($data->getId());
        // add the attendees to the event
        $event->addAttendeeCollection($attendees);
        //record the change for logging
        $this->changeLogger->process($event, $operation, $uriVariables, $context);
    }
}
