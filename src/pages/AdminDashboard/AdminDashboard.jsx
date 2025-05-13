import React, { useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // State for profile section
  const [admin, setAdmin] = useState({
    name: 'Shaista',
    rate: 2,
    experience: '2 years',
    expertise: 'Technical Recruitment',
    image: '/path-to-admin-image.jpg'
  });

  // State for time selection
  const [selectedTimes, setSelectedTimes] = useState({
    day: '',
    date: '',
    time: ''
  });

  // State for UI interactions
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [interviewRequested, setInterviewRequested] = useState(false);

  // Sample time slots data
  const timeSlots = [
    { day: 'Mon', date: 'Jun 5', time: '10:00 AM' },
    { day: 'Tue', date: 'Jun 6', time: '2:00 PM' },
    { day: 'Wed', date: 'Jun 7', time: '4:30 PM' }
  ];

  // Event handlers
  const handleTimeSelect = (slot) => {
    setSelectedTimes({
      day: slot.day,
      date: slot.date,
      time: slot.time
    });
    setShowTimeDropdown(false);
  };

  const handlePlayVideo = () => {
    setVideoPlaying(!videoPlaying);
    // In a real app, you would trigger video playback here
  };

  const handleRequestInterview = () => {
    if (selectedTimes.day && selectedTimes.date && selectedTimes.time) {
      setInterviewRequested(true);
      // In a real app, you would send this data to your backend
      console.log('Interview requested for:', selectedTimes);
    } else {
      alert('Please select day, date and time first');
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Side Navigation */}
      <div className="side-nav">
        <h3>Sales & Marketing</h3>
        <ul>
          <li>Untitled Professionals</li>
          <li>AI and Telecom</li>
          <li>Contact Centre</li>
          <li>Accounting & Finance</li>
          <li>Insurance</li>
          <li>Medical</li>
          <li>Dental</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Admin Profile Section */}
        <div className="profile-section">
          <div className="profile-pic">
            <img src={admin.image} alt="Admin" />
            <button className="edit-pic-btn">✎</button>
          </div>
          <div className="profile-info">
            <h2 contentEditable onBlur={(e) => setAdmin({ ...admin, name: e.target.textContent })}>
              {admin.name}
            </h2>
            <div className="rate">
              $<input
                type="number"
                value={admin.rate}
                onChange={(e) => setAdmin({ ...admin, rate: e.target.value })}
                min="0"
                step="0.5"
              />/hr
            </div>
            <div className="details">
              <p>
                <strong>Experience:</strong>
                <select
                  value={admin.experience}
                  onChange={(e) => setAdmin({ ...admin, experience: e.target.value })}
                >
                  <option value="1 year">1 year</option>
                  <option value="2 years">2 years</option>
                  <option value="3+ years">3+ years</option>
                </select>
              </p>
              <p>
                <strong>Expertise:</strong>
                <input
                  type="text"
                  value={admin.expertise}
                  onChange={(e) => setAdmin({ ...admin, expertise: e.target.value })}
                />
              </p>
              <button className="resume-btn" onClick={() => alert('Opening resume...')}>
                Resume
              </button>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="video-tile">
          {videoPlaying ? (
            <div className="video-player">
              {/* Video player placeholder */}
              <div className="video-placeholder"></div>
              <button className="video-control" onClick={handlePlayVideo}>
                ⏸️ Pause Video
              </button>
            </div>
          ) : (
            <button className="play-video-btn" onClick={handlePlayVideo}>
              ▶ PLAY VIDEO
            </button>
          )}
        </div>

        {/* Request Interview Section */}
        <div className="request-section">
          <button
            className={`request-btn ${interviewRequested ? 'requested' : ''}`}
            onClick={handleRequestInterview}
            disabled={interviewRequested}
          >
            {interviewRequested ? 'Interview Requested ✓' : 'Request Interview'}
          </button>

          <div className="time-selector">
            <div className="time-labels">
              <span className={selectedTimes.day ? 'selected' : ''}>
                {selectedTimes.day || 'Day'}
              </span>
              <span className={selectedTimes.date ? 'selected' : ''}>
                {selectedTimes.date || 'Date'}
              </span>
              <span className={selectedTimes.time ? 'selected' : ''}>
                {selectedTimes.time || 'Time'}
              </span>
            </div>
            <div
              className={`dropdown-icon ${showTimeDropdown ? 'open' : ''}`}
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
            >
              ↓
            </div>

            {showTimeDropdown && (
              <div className="time-dropdown">
                {timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="time-option"
                    onClick={() => handleTimeSelect(slot)}
                  >
                    <span>{slot.day}</span>
                    <span>{slot.date}</span>
                    <span>{slot.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirmation Flow - Only shows after request */}
          {interviewRequested && (
            <div className="confirmation-flow">
              <div className="flow-item">
                <div className="flow-icon">|</div>
                <div className="flow-text">Land at my inbox</div>
              </div>

              <div className="flow-item">
                <div className="flow-icon">↓</div>
                <div className="flow-text">Auto email reply</div>
              </div>

              <div className="flow-item">
                <div className="flow-icon">|</div>
                <div className="flow-text">
                  Sit back and relax, your interview request with {admin.name} has been submitted.
                  Our team will contact {admin.name} to confirm and match availability.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;