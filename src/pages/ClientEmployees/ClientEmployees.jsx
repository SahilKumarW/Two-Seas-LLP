// pages/Client/ClientEmployees.jsx
import React, { useEffect, useState } from "react";
import EmployeeCard from "../EmployeeCard/EmployeeCard"; // adjust path if needed
import "./ClientEmployees.css";

const ClientEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch employees (except hidden ones)
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/employees"); // your backend endpoint
        const data = await res.json();
        const visible = data.filter(emp => !emp.hidden); // hide flagged employees
        setEmployees(visible);
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <p>Loading employees...</p>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>Available Employees</h1>
      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
        {employees.map(emp => (
          <EmployeeCard key={emp.id} employee={emp} />
        ))}
      </div>
    </div>
  );
};

export default ClientEmployees;
