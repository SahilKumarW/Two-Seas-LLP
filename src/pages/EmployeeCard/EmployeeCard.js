import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaClipboardCheck, FaHeart, FaCalendarAlt, FaRegHeart, FaStar, FaPlay } from 'react-icons/fa';
import './EmployeeCard.css';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { niches } from '../AdminDashboard/constants';

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'employees'));
        const employeesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEmployees(employeesData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return { employees, loading, error };
};

const EmployeeCard = () => {
  const { employees, loading, error } = useEmployees();
  const [wishlist, setWishlist] = useState({});
  const [expandedCards, setExpandedCards] = useState({});
  const [selectedNiche, setSelectedNiche] = useState('All');
  const [miniPlayerUrl, setMiniPlayerUrl] = useState(null);

  // Add 'All' option to the niches
  const allNiches = [{ id: 'All', name: 'All' }, ...niches];

  // Filter employees based on selected niche
  const filteredEmployees = employees.filter(emp => {
    if (selectedNiche === 'All') return emp.status !== 'hidden';

    // Convert selectedNiche (which is id from niches array like 1–8) to niche-0 to niche-7
    const nicheKey = `niche-${parseInt(selectedNiche) - 1}`;
    return emp.niche === nicheKey && emp.status !== 'hidden';
  });

  const toggleCardExpand = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleWishlist = (id) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const calculateRating = (rate) => {
    if (!rate) return '4.5';
    const normalizedRate = Math.min(100, Math.max(0, rate));
    const wholeNumber = Math.min(5, Math.max(1, Math.floor(normalizedRate / 20)));
    const decimal = Math.floor((normalizedRate % 20) / 2);
    return `${wholeNumber}.${decimal}`;
  };

  const handleScheduleInterview = (email, e) => {
    e.stopPropagation();
    if (!email) {
      alert('Email not available for this professional');
      return;
    }
    window.open(`mailto:${email}?subject=Interview Request&body=I would like to schedule an interview`, '_blank');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading professionals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading professionals: {error}</p>
      </div>
    );
  }

  return (
    <div className="employee-portal">
      <header className="portal-header">
        <div className="header-content">
          <h1 className="portal-title">Talent Nexus</h1>
          <p className="portal-subtitle">Discover Exceptional Tech Professionals</p>
        </div>
      </header>

      {/* Niche Filter */}
      <div className="niche-filter-container">
        <div className="niche-filter">
          {allNiches.map(niche => (
            <button
              key={niche.id}
              className={`niche-button ${selectedNiche === niche.id ? 'active' : ''}`}
              onClick={() => setSelectedNiche(niche.id)}
            >
              {niche.name}
            </button>
          ))}
        </div>
      </div>

      <div className="employee-grid">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee, index) => {
            const videoId = extractYouTubeId(employee.introductionVideoLink);

            return (
              <div
                key={employee.id}
                className={`employee-card ${expandedCards[employee.id] ? 'expanded' : ''}`}
                onClick={() => toggleCardExpand(employee.id)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-content">
                  <div className="card-background">
                    <div className="employee-profile">
                      <div className="avatar-container">
                        <div className="avatar-wrapper">
                          <img
                            src={employee.imageBase64 || 'https://via.placeholder.com/150'}
                            alt={employee.name}
                            className="employee-avatar"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150';
                            }}
                          />
                          {/* <div className="experience-badge">{employee.experience}</div> */}
                        </div>
                        {/* <button
                          className={`wishlist-button ${wishlist[employee.id] ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(employee.id);
                          }}
                        >
                          {wishlist[employee.id] ? <FaHeart /> : <FaRegHeart />}
                        </button> */}
                      </div>
                      <div className="profile-info">
                        <h3 className="employee-name">{employee.name}</h3>
                        <p className="employee-position">{employee.expertise}</p>
                        {/* <div className="rating">
                          <FaStar className="star" />
                          <span>{calculateRating(employee.rate)}</span>
                        </div> */}
                      </div>
                    </div>

                    <div className="employee-intro">
                      <p style={{ color: '#2A2D7C' }}>{employee.intro}</p>
                    </div>

                    <div className={`expandable-content ${expandedCards[employee.id] ? 'visible' : ''}`}>
                      {/* {videoId && (
                        <div className="video-preview">
                          <iframe
                            width="100%"
                            height="200"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={`${employee.name} introduction`}
                          ></iframe>
                        </div>
                      )} */}

                      <div className="expertise-section">
                        <h4 className="section-label">Core Expertise</h4>
                        <div className="expertise-tags-container">
                          {employee.expertise?.split(',').map((skill, index) => (
                            <span key={index} className="skill-tag">{skill.trim()}</span>
                          )) || <span className="skill-tag">No skills listed</span>}
                        </div>
                      </div>

                      <div className="details-grid">
                        <div className="detail-item">
                          <span className="detail-label">Rate</span>
                          <span className="detail-value centered-value">
                            {employee.currency || 'USD'} {employee.rate || 'N/A'}/hr
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Experience</span>
                          <span className="detail-value centered-value">{employee.experience || 'N/A'} years</span>
                        </div>
                      </div>

                      <div className="video-buttons-container">
                        {employee.introductionVideoLink && (
                          <button
                            className="video-button intro-video-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              const videoId = extractYouTubeId(employee.introductionVideoLink);
                              if (videoId) setMiniPlayerUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
                            }}
                          >
                            <FaPlay className="video-icon" /> Intro Video
                          </button>
                        )}
                        {employee.interviewVideoLink && (
                          <button
                            className="video-button interview-video-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              const videoId = extractYouTubeId(employee.interviewVideoLink);
                              if (videoId) setMiniPlayerUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
                            }}
                          >
                            <FaPlay className="video-icon" /> Interview
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* <button
                    className="primary-button book-interview"
                    onClick={(e) => handleScheduleInterview(employee.email, e)}
                  >
                    <FaCalendarAlt /> Schedule Interview
                  </button> */}
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-results">
            <p>No professionals found in this category.</p>
          </div>
        )}
      </div>

      {miniPlayerUrl && (
        <div className="mini-player-overlay" onClick={() => setMiniPlayerUrl(null)}>
          <div className="mini-player" onClick={(e) => e.stopPropagation()}>
            <iframe
              width="560"
              height="315"
              src={miniPlayerUrl}
              title="YouTube video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
            <button className="close-mini-player" onClick={() => setMiniPlayerUrl(null)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeCard;