// src/components/AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminWelcome.css';
import logo from '../../assets/Two Seas Logo.png';

const AdminWelcome = () => {
    const navigate = useNavigate();

    const menuItems = [
        { id: 1, title: 'View Dashboard', icon: '📊', path: '/admin-dashboard' },
        { id: 2, title: 'Add Employee', icon: '👤', path: '/admin-dashboard/add-employee' },
        { id: 3, title: 'View Employees', icon: '👥', path: '/employee-diary' },
        { id: 4, title: 'Client Management', icon: '🤝', path: '/client-diary' }
    ];

    return (
        <div className="admin-welcome-container">
            <div className="welcome-header">
                <div className="logo-container">
                    <img src={logo} alt="Two Seas Logo" className="welcome-logo" />
                </div>
                <h1>Welcome, Admin</h1>
                <p className="welcome-message">Manage your organization efficiently with these quick actions</p>
            </div>

            <div className="dashboard-grid">
                {menuItems.map((item) => (
                    <div 
                        key={item.id}
                        className="dashboard-card"
                        onClick={() => navigate(item.path)}
                    >
                        <div className="card-icon">{item.icon}</div>
                        <h3>{item.title}</h3>
                        <div className="card-hover-effect"></div>
                    </div>
                ))}
            </div>

            <div className="recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                    <div className="activity-item">
                        <span className="activity-icon">🔄</span>
                        <span>System updated to v2.4.1</span>
                        <span className="activity-time">10 mins ago</span>
                    </div>
                    <div className="activity-item">
                        <span className="activity-icon">👤</span>
                        <span>New employee registered</span>
                        <span className="activity-time">2 hours ago</span>
                    </div>
                    <div className="activity-item">
                        <span className="activity-icon">📝</span>
                        <span>Client report generated</span>
                        <span className="activity-time">Yesterday</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminWelcome;