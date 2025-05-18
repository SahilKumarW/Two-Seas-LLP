import React, { useState } from 'react';
import './AdminDashboard.css';
import SideNav from '../AdminDashboard/components/SideNav';
import adminImage from '../../assets/admin.jpg'

const AdminDashboard = () => {
  const [admin, setAdmin] = useState({
    name: 'Shaista',
    rate: 2,
    experience: '2 years',
    expertise: 'Technical Recruitment',
    image: adminImage
  });

  const [selectedTimes, setSelectedTimes] = useState({
    day: '',
    date: '',
    time: ''
  });

  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [interviewRequested, setInterviewRequested] = useState(false);

  const timeSlots = [
    { day: 'Mon', date: 'Jun 5', time: '10:00 AM' },
    { day: 'Tue', date: 'Jun 6', time: '2:00 PM' },
    { day: 'Wed', date: 'Jun 7', time: '4:30 PM' },
    { day: 'Thu', date: 'Jun 8', time: '11:00 AM' },
    { day: 'Fri', date: 'Jun 9', time: '3:15 PM' }
  ];

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
  };

  const handleRequestInterview = () => {
    if (selectedTimes.day && selectedTimes.date && selectedTimes.time) {
      setInterviewRequested(true);
    } else {
      alert('Please select day, date and time first');
    }
  };

  return (
    <div className="admin-dashboard">
      <SideNav />

      {/* Colorful Main Content */}
      <div className="main-content">
        {/* Updated Profile Section with full-height image */}
        <div className="profile-section">
          <div className="profile-image-container">
            <img src={admin.image} alt={admin.name} className="profile-image" />
          </div>

          <div className="profile-content">
            <div className="profile-header">
              <h2>{admin.name}</h2>
              <div className="rate-badge">${admin.rate}/hr</div>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Experience</span>
                <span className="detail-value">{admin.experience}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Expertise</span>
                <span className="detail-value">{admin.expertise}</span>
              </div>
            </div>

            <button className="resume-btn">
              <DownloadIcon /> Download Resume
            </button>
          </div>
        </div>

        {/* Video Section */}
        <div className="video-section">
          <h3 className="section-title">Introduction Video</h3>
          <div className="video-container">
            <div className="video-wrapper">
              {/* Dummy video player */}
              <div className="dummy-video">
                <div className="video-thumbnail">
                  <div className="play-overlay" onClick={handlePlayVideo}>
                    <PlayIcon />
                  </div>
                </div>

                {/* Video controls */}
                <div className="video-controls">
                  <button className="control-btn" onClick={handlePlayVideo}>
                    {videoPlaying ? '❚❚' : '▶'}
                  </button>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: '35%' }}></div>
                  </div>
                  <div className="time">1:24 / 3:45</div>
                  <button className="control-btn">🔊</button>
                  <button className="control-btn">⛶</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Selector with Separate Dropdowns */}
        <div className="time-selector-container">
          <h3 style={{ color: '#2A2D7C' }}>Request Interview</h3>

          <div className="time-selector-grid">
            {/* Day Dropdown */}
            <div className="time-selector-group">
              <div
                className={`time-value ${selectedTimes.day ? 'selected' : ''}`}
                onClick={() => setShowTimeDropdown(prev => prev === 'day' ? null : 'day')}
              >
                {selectedTimes.day || 'Day'}
                <ChevronDown />
              </div>
              {showTimeDropdown === 'day' && (
                <div className="time-dropdown">
                  {[...new Set(timeSlots.map(slot => slot.day))].map((day, i) => (
                    <div
                      key={i}
                      className="time-option"
                      onClick={() => {
                        setSelectedTimes(prev => ({ ...prev, day }));
                        setShowTimeDropdown(null);
                      }}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date Dropdown */}
            <div className="time-selector-group">
              <div
                className={`time-value ${selectedTimes.date ? 'selected' : ''}`}
                onClick={() => setShowTimeDropdown(prev => prev === 'date' ? null : 'date')}
              >
                {selectedTimes.date || 'Date'}
                <ChevronDown />
              </div>
              {showTimeDropdown === 'date' && (
                <div className="time-dropdown">
                  {[...new Set(timeSlots
                    .filter(slot => !selectedTimes.day || slot.day === selectedTimes.day)
                    .map(slot => slot.date))].map((date, i) => (
                      <div
                        key={i}
                        className="time-option"
                        onClick={() => {
                          setSelectedTimes(prev => ({ ...prev, date }));
                          setShowTimeDropdown(null);
                        }}
                      >
                        {date}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Time Dropdown */}
            <div className="time-selector-group">
              <div
                className={`time-value ${selectedTimes.time ? 'selected' : ''}`}
                onClick={() => setShowTimeDropdown(prev => prev === 'time' ? null : 'time')}
              >
                {selectedTimes.time || 'Time'}
                <ChevronDown />
              </div>
              {showTimeDropdown === 'time' && (
                <div className="time-dropdown">
                  {timeSlots
                    .filter(slot =>
                      (!selectedTimes.day || slot.day === selectedTimes.day) &&
                      (!selectedTimes.date || slot.date === selectedTimes.date)
                    )
                    .map((slot, i) => (
                      <div
                        key={i}
                        className="time-option"
                        onClick={() => {
                          setSelectedTimes(prev => ({
                            ...prev,
                            time: slot.time,
                            // Auto-fill day/date if not selected
                            day: prev.day || slot.day,
                            date: prev.date || slot.date
                          }));
                          setShowTimeDropdown(null);
                        }}
                      >
                        {slot.time}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <button
            className="request-btn"
            onClick={handleRequestInterview}
            style={{
              background: interviewRequested ? '#4CAF50' : '#2A2D7C'
            }}
          >
            {interviewRequested ? 'Request Sent!' : 'Schedule Interview'}
          </button>
        </div>

        {/* Colorful Confirmation Flow */}
        {interviewRequested && (
          <div className="confirmation-flow">
            <div className="flow-item">
              <div className="flow-icon" style={{ color: '#FF6B6B' }}>
                <MailIcon />
              </div>
              <div className="flow-text">
                <strong style={{ color: '#2A2D7C' }}>Land at my inbox</strong>
                <p>Confirmation sent to your email</p>
              </div>
            </div>

            <div className="flow-arrow">
              <ArrowDown />
            </div>

            <div className="flow-item">
              <div className="flow-icon" style={{ color: '#4CC9F0' }}>
                <AutoReplyIcon />
              </div>
              <div className="flow-text">
                <strong style={{ color: '#2A2D7C' }}>Auto response generated</strong>
                <p>Shaista has been notified</p>
              </div>
            </div>

            <div className="flow-arrow">
              <ArrowDown />
            </div>

            <div className="flow-item">
              <div className="flow-icon" style={{ color: '#4CAF50' }}>
                <CheckCircle />
              </div>
              <div className="flow-text">
                <strong style={{ color: '#2A2D7C' }}>All set!</strong>
                <p>Sit back and relax, your interview request with Shaista has been submitted.
                  Our team will contact Shaista to confirm and match availability.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Sample icon components (would import real icons in production)
const PlayIcon = () => <span>▶</span>;
const DownloadIcon = () => <span>⭳</span>;
const EditIcon = () => <span>✎</span>;
const ChevronDown = () => <span>⌄</span>;
const MailIcon = () => <span>✉</span>;
const AutoReplyIcon = () => <span>↻</span>;
const CheckCircle = () => <span>✓</span>;
const ArrowDown = () => <span style={{ color: '#4CC9F0' }}>↓</span>;

export default AdminDashboard;