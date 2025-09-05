// pages/Client/ClientSchedule.jsx
import React from "react";
import CalendarScheduler from "../../components/CalendarScheduler";
import "./ClientSchedule.css";

const ClientSchedule = () => {
  const handleScheduleSubmit = (slot) => {
    console.log("Client scheduled:", slot);
    // Here you’ll POST to backend with the chosen slot
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>Schedule an Interview</h1>
      <CalendarScheduler
        onDateSelected={(date) => console.log("Date selected:", date)}
        onScheduleSubmit={handleScheduleSubmit}
      />
    </div>
  );
};

export default ClientSchedule;
