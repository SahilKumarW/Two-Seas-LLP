// src/pages/ClientDashboard/ClientDashboard.jsx
import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import EmployeeCard from "../EmployeeCard/EmployeeCard";
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
import { doc, getDoc, getDocs, addDoc, collection, db, deleteDoc } from "../../firebase";

export default function ClientDashboard() {
  const { theme, changeTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("employees");
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("employees");

  // Store client info from localStorage
  const [clientUser, setClientUser] = useState({
    clientName: "",
    email: ""
  });

  const [wishlistEmployees, setWishlistEmployees] = useState([]);

  useEffect(() => {
    const fetchWishlistEmployees = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("clientUser"));
        const clientId = storedUser?.clientId;
        if (!clientId) return;

        // go inside clients/{clientId}/wishlist
        const wishlistRef = collection(db, "clients", clientId, "wishlist");
        const snapshot = await getDocs(wishlistRef);

        const employees = [];

        for (const docSnap of snapshot.docs) {
          const employeeId = docSnap.id; // 👈 employeeId is the document ID in wishlist

          // fetch actual employee from employees/{employeeId}
          const employeeRef = doc(db, "employees", employeeId);
          const employeeSnap = await getDoc(employeeRef);

          if (employeeSnap.exists()) {
            employees.push({ id: employeeSnap.id, ...employeeSnap.data() });
          }
        }

        setWishlistEmployees(employees);
      } catch (error) {
        console.error("❌ Error fetching wishlist employees:", error);
      }
    };

    fetchWishlistEmployees();
  }, []);

  useEffect(() => {
    // Fetch clientUser from localStorage
    const storedUser = JSON.parse(localStorage.getItem("clientUser"));
    if (storedUser) {
      setClientUser({
        clientName: storedUser.clientName || "Unknown Client",
        email: storedUser.email || "No Email"
      });
    }
  }, []);

  const themeOptions = [
    { value: "light", label: "Light", icon: "☀️" },
    { value: "dark", label: "Dark", icon: "🌙" },
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

  // Add this function to handle employee selection
  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    // You can add additional logic here if needed
    console.log("Selected employee:", employeeId);
  };

  // Add this function to handle menu item changes
  const handleMenuItemChange = (menuItem) => {
    setActiveMenuItem(menuItem);
    // You can add navigation logic here if needed
  };

  // Save employee to wishlist in Firestore
  const handleAddToWishlist = async (employee) => {
    try {
      if (!clientUser.email) {
        alert("You must be logged in to add to wishlist");
        return;
      }

      await addDoc(collection(db, "wishlists"), {
        clientEmail: clientUser.email,
        employee: employee, // full employee object
        createdAt: new Date()
      });

      console.log("✅ Employee added to wishlist:", employee);
      alert(`${employee.name} added to your wishlist!`);
    } catch (error) {
      console.error("❌ Error adding to wishlist:", error);
      alert("Something went wrong while adding to wishlist");
    }
  };

  // Remove employee from wishlist
  const handleRemoveFromWishlist = async (employeeId) => {
    try {
      // Optimistically update UI first
      setWishlistEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));

      const storedUser = JSON.parse(localStorage.getItem("clientUser"));
      const clientId = storedUser?.clientId;
      if (!clientId) return;

      // Delete from Firestore
      const employeeRef = doc(db, "clients", clientId, "wishlist", employeeId);
      await deleteDoc(employeeRef);

      console.log("✅ Removed from wishlist:", employeeId);
    } catch (error) {
      console.error("❌ Error removing from wishlist:", error);
      alert("Failed to remove employee from wishlist");
    }
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

        {/* User Profile Section */}
        <div className="user-profile">
          <div className="user-avatar">
            <FiUsers size={20} />
          </div>
          <div className="user-info">
            <p className="user-name">{clientUser.clientName}</p>
            <p className="user-role">{clientUser.email}</p>
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
        </header>

        <div className="dashboard-content">
          {activeTab === "employees" && (
            <div className="employees-list">
              <EmployeeCard
                archived={false}
                setSelectedEmployeeId={handleEmployeeSelect}
                setActiveMenuItem={handleMenuItemChange}
                visibilityFilter="client"
                onAddToWishlist={handleAddToWishlist}   // ✅ new prop
              />
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="wishlist-section">
              {wishlistEmployees.length > 0 ? (
                <div className="employees-list">
                  {wishlistEmployees.map((employee) => (
                    <EmployeeCard
                      key={employee.id}
                      employee={employee}
                      archived={false}
                      setSelectedEmployeeId={handleEmployeeSelect}
                      setActiveMenuItem={handleMenuItemChange}
                      visibilityFilter="client"
                      onRemoveFromWishlist={() => handleRemoveFromWishlist(employee.id)}  // ✅ new
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <FiHeart size={48} />
                  <h3>Your wishlist is empty</h3>
                  <p>Start adding employees to your wishlist to keep track of favorites</p>
                </div>
              )}
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