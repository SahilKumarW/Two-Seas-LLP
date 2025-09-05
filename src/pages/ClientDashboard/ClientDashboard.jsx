// src/pages/ClientDashboard/ClientDashboard.jsx
import { useContext, useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import EmployeeCard from "../EmployeeCard/EmployeeCard";
import { fetchEmployees } from "../../services/employeeService";
import CalendarScheduler from "../../components/CalendarScheduler";
import "./ClientDashboard.css";
import Logo from "../../assets/Two Seas Logo.png"

// React Icons
import { FiHome, FiUsers, FiHeart, FiCalendar, FiSun, FiMoon } from "react-icons/fi";

export default function ClientDashboard() {
  const { theme, toggleTheme } = useTheme();
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("employees");

  useEffect(() => {
    fetchEmployees().then(setEmployees);
  }, []);

  return (
    <div className={`client-dashboard theme-${theme}`}>
      {/* Sidebar */}
      <aside className="side">
        <div className="side-header">
          <div className="logo">
            <a href="/" style={{ display: "inline-block" }}>
              <img
                src={Logo}
                alt="Two Seas Logo"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                  cursor: "pointer",
                }}
              />
            </a>
            <h2>Two Seas | Client Portal</h2>
          </div>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>

        <nav className="sideNav">
          <ul>
            <li className={activeTab === "employees" ? "active" : ""}>
              <button onClick={() => setActiveTab("employees")}>
                <FiUsers size={18} />
                Employees
              </button>
            </li>
            <li className={activeTab === "wishlist" ? "active" : ""}>
              <button onClick={() => setActiveTab("wishlist")}>
                <FiHeart size={18} />
                Wishlist
              </button>
            </li>
            <li className={activeTab === "schedule" ? "active" : ""}>
              <button onClick={() => setActiveTab("schedule")}>
                <FiCalendar size={18} />
                Schedule Interview
              </button>
            </li>
          </ul>
        </nav>

        <div className="user-profile">
          <div className="user-avatar">
            <FiUsers size={20} />
          </div>
          <div className="user-info">
            <p className="user-name">Client Name</p>
            <p className="user-role">Client Account</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <header className="dashboard-header">
          <h1>
            {activeTab === "employees" && "Available Employees"}
            {activeTab === "wishlist" && "Your Wishlist"}
            {activeTab === "schedule" && "Schedule an Interview"}
          </h1>
          <div className="header-actions">
            <div className="search-bar">
              <input type="text" placeholder="Search..." />
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {activeTab === "employees" && (
            <div className="employee-grid">
              {employees.map(emp => (
                <EmployeeCard key={emp.id} employee={emp} />
              ))}
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="wishlist-section">
              <div className="empty-state">
                <FiHeart size={48} />
                <h3>Your wishlist is empty</h3>
                <p>Start adding employees to your wishlist to keep track of favorites</p>
              </div>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="scheduler-section">
              <CalendarScheduler />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}