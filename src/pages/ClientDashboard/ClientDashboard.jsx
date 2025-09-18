// src/pages/ClientDashboard/ClientDashboard.jsx
import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import EmployeeCard from "../EmployeeCard/EmployeeCard";
import { fetchEmployees } from "../../services/employeeService";
import CalendarScheduler from "../../components/CalendarScheduler";
import "./ClientDashboard.css";
import Logo from "../../assets/Two Seas Logo.png";

// Icons
import {
  FiUsers,
  FiHeart,
  FiCalendar,
  FiChevronDown,
  FiRefreshCcw
} from "react-icons/fi";

export default function ClientDashboard() {
  const { theme, changeTheme, resetTheme } = useTheme();
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("employees");
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  useEffect(() => {
    fetchEmployees().then(setEmployees);
  }, []);

  const themeOptions = [
    { value: "light", label: "Light", icon: "☀️" },
    { value: "dark", label: "Dark", icon: "🌙" },
    // { value: "candy", label: "Candy Theme", icon: "🎨" },
    { value: "candy-green", label: "Candy Green", icon: "🍃" },
    { value: "candy-lightgreen", label: "Candy Light Green", icon: "🌿" },
    { value: "candy-blue", label: "Candy Blue", icon: "💧" },
    { value: "candy-blend", label: "Candy Blend", icon: "🌈" }
  ];

  const getCurrentThemeLabel = () => {
    const currentTheme = themeOptions.find(option => option.value === theme);
    return currentTheme ? `${currentTheme.icon} ${currentTheme.label}` : "Select Theme";
  };

  const handleThemeChange = (themeValue) => {
    changeTheme(themeValue);
    setIsThemeDropdownOpen(false);
  };

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

          {/* Theme Controls */}
          <div className="theme-controls">
            <div className="theme-dropdown">
              <button
                className="theme-dropdown-toggle"
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              >
                <span>{getCurrentThemeLabel()}</span>
                <FiChevronDown size={16} />
              </button>

              {isThemeDropdownOpen && (
                <div className="theme-dropdown-menu">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`theme-dropdown-item ${theme === option.value ? 'active' : ''}`}
                      onClick={() => handleThemeChange(option.value)}
                    >
                      <span className="theme-icon">{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                  <div className="theme-dropdown-divider"></div>
                  <button
                    className="theme-dropdown-item reset"
                    onClick={() => {
                      resetTheme();
                      setIsThemeDropdownOpen(false);
                    }}
                  >
                    <FiRefreshCcw size={16} />
                    <span>Reset to Default</span>
                  </button>
                </div>
              )}
            </div>
          </div>
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
            <div className="employee-list">
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