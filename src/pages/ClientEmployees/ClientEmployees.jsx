// pages/Client/ClientEmployees.jsx
import React from "react";
import EmployeeCard from "../EmployeeCard/EmployeeCard"; // adjust path if needed
import "./ClientEmployees.css";

const ClientEmployees = () => {
  return (
    <div style={{ padding: "24px" }}>
      <h1>Available Employees</h1>
      <div
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "1fr", // ✅ keep single column for now
        }}
      >
        <EmployeeCard />
      </div>
    </div>
  );
};

export default ClientEmployees;
