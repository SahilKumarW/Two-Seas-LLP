// src/pages/ClientLogin/ClientLogin.jsx
import { useState } from "react";
import "./ClientLogin.css";

export default function ClientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: connect to backend/Firebase
    window.location.href = "/client-dashboard";
  };

  return (
    <div className="client-login">
      <div className="login-card">
        <h2 className="login-title">Two Seas <br/>Client Portal</h2>
        <p className="login-subtitle">Please sign in to continue</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="login-footer">
          <a href="#">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}
