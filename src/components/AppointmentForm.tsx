// components/AppointmentForm.tsx

"use client"
import { useState } from "react";
import { Button } from "./ui/button";

const AppointmentForm = () => {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert(`Appointment requested for ${name} at ${time} in ${location}`);
    setName("");
    setTime("");
    setLocation("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 text-sm mt-2">
      <input
        type="text"
        placeholder="Your Name"
        className="w-full border px-2 py-1 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Preferred Time Slot"
        className="w-full border px-2 py-1 rounded"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <input
        type="text"
        placeholder="Location"
        className="w-full border px-2 py-1 rounded"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <Button className="w-full" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default AppointmentForm;
