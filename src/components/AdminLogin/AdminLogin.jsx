// src/components/AdminLogin.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminLogin.css';
import logo from '../../assets/Two Seas Logo.png';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login submitted:', { email, password });
    };

    return (
        <div className="admin-login-container">
            <div className="login-content-wrapper">
                {/* Logo in circular white shape */}
                <div className="logo-circle">
                    <img src={logo} alt="Two Seas Logo" className="logo-image" />
                </div>

                {/* Vertical divider line */}
                <div className="vertical-divider"></div>

                {/* Login form */}
                <div className="login-form-container">
                    <h2 className="login-title">Login to Admin Panel</h2>
                    <form onSubmit={handleSubmit} className="admin-login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="admin-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="admin-input"
                            />
                        </div>
                        <button type="submit" className="admin-login-button">Login</button>
                    </form>
                    <p className="admin-toggle-text">
                        Don't have an account? <Link to="/admin-signup" className="admin-toggle-link">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;