// pages/Client/ClientProfile.jsx
import React, { useState, useEffect } from "react";
import "./ClientProfile.css";

const ClientProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch client profile from backend
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/client/profile");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>My Profile</h1>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Company:</strong> {profile.company}</p>
      
      <h2>Preferences</h2>
      <ul>
        <li>Preferred Theme: {profile.theme || "default"}</li>
        <li>Notifications: {profile.notifications ? "Enabled" : "Disabled"}</li>
      </ul>
    </div>
  );
};

export default ClientProfile;
