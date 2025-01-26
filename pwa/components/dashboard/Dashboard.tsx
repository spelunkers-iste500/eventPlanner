import React from "react";
import { Card, CardContent, CardHeader } from "../common/Card";
import { Search, Filter } from "lucide-react";
import { SendHorizontal } from "lucide-react";

const events = [
  // Replace these with dynamic data
  { id: 1, name: "Event Name", org: "Organization Name", date: "Dec 5, 2024 • 9am", img: "image_url" },
  { id: 2, name: "Event Name", org: "Organization Name", date: "Dec 5 - 9, 2024 • 9am - 5pm", img: "image_url" },
  { id: 3, name: "Event Name", org: "Organization Name", date: "Dec 5, 2024 • 9am", img: "image_url" },
  { id: 4, name: "Event Name", org: "Organization Name", date: "Dec 5, 2024 • 9am", img: "image_url" },
  { id: 5, name: "Event Name", org: "Organization Name", date: "Dec 5, 2024 • 9am", img: "image_url" },
];

const EventRow = ({ title, events, buttonText }: { title: string; events: any[]; buttonText: string }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 cursor-pointer" />
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {events.map((event) => (
          <Card key={event.id} className="w-64 flex-shrink-0">
            <img src={event.img} alt={event.name} className="h-40 w-full object-cover rounded-t-xl" />
            <CardContent>
              <CardHeader className="text-lg font-semibold mb-2">{event.name}</CardHeader>
              <p className="text-sm text-gray-500 mb-1">{event.org}</p>
              <p className="text-sm text-gray-500 flex items-center mb-4">
                <span className="mr-1">📅</span> {event.date}
              </p>
              <SendHorizontal className="w-full bg-blue-500 text-white hover:bg-blue-600">{buttonText}</SendHorizontal>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const EventList = () => {
  return (
    <div className="p-6">
      <EventRow title="Event Invitations" events={events} buttonText="Book Now" />
      <EventRow title="Your Events" events={events} buttonText="View More" />
    </div>
  );
};

export default EventList;