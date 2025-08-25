import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaClipboardCheck, FaHeart, FaCalendarAlt, FaRegHeart, FaStar, FaPlay, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import { FiArchive, FiEdit, FiTrash2 } from "react-icons/fi";
import { useLocation, Link } from 'react-router-dom';
import './EmployeeCard.css';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { niches } from '../AdminDashboard/constants';
import { doc, getDoc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import EditEmployeeModal from '../../components/EditEmployeeModal';

export const useEmployees = (archived = false) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const collectionName = archived ? 'archivedEmployees' : 'employees';
        const querySnapshot = await getDocs(collection(db, collectionName));
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
  }, [archived]);

  return { employees, loading, error };
};

const EmployeeCard = ({ archived = false }) => {
  const { employees, loading, error } = useEmployees(archived);
  const location = useLocation();
  const isAdminPanel = location.pathname === "/admin-panel";

  const [wishlist, setWishlist] = useState({});
  const [expandedCards, setExpandedCards] = useState({});
  const [selectedNiche, setSelectedNiche] = useState('All');
  const [miniPlayerUrl, setMiniPlayerUrl] = useState(null);
  const [viewerState, setViewerState] = useState({
    isOpen: false,
    document: null,
    type: '',
    isLoading: true
  });

  const [editModalId, setEditModalId] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  // Add these missing state variables
  const [editEmployee, setEditEmployee] = useState(null);
  const [editData, setEditData] = useState({});
  const [editingEmployee, setEditingEmployee] = useState(null);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // function to refresh employees after update
  const refreshEmployees = () => {
    setRefresh(!refresh);
  };

  // Add 'All' option to the niches
  const allNiches = [{ id: 'All', name: 'All' }, ...niches];

  // Filter employees based on selected niche
  const filteredEmployees = employees.filter(emp => {
    const matchesNiche =
      selectedNiche === 'All'
        ? emp.status !== 'hidden'
        : emp.niche === `niche-${parseInt(selectedNiche) - 1}` && emp.status !== 'hidden';

    const matchesSearch =
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.expertise?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.intro?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesNiche && matchesSearch;
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

  const getEmbedUrl = (url) => {
    if (!url) return null;
    // Convert Google Drive view URL to embed URL
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/\/d\/([^\/]+)/)?.[1] || url.match(/id=([^&]+)/)?.[1];
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    return url;
  };

  const openDocument = (doc, type, e) => {
    e.stopPropagation();
    setViewerState({
      isOpen: true,
      document: doc,
      type,
      isLoading: true
    });
  };

  const closeDocument = () => {
    setViewerState(prev => ({ ...prev, isOpen: false }));
  };

  const handleIframeLoad = () => {
    setViewerState(prev => ({ ...prev, isLoading: false }));
  };

  const getDocumentTitle = () => {
    switch (viewerState.type) {
      case 'resume': return 'Resume Document';
      case 'assessment': return 'Assessment Report';
      default: return 'Document Viewer';
    }
  };

  // Archive employee
  const handleArchive = async (employee) => {
    try {
      // add to archivedEmployees
      await setDoc(doc(db, "archivedEmployees", employee.id), employee);
      // delete from employees
      await deleteDoc(doc(db, "employees", employee.id));
      alert(`${employee.name} archived successfully.`);
    } catch (err) {
      console.error("Error archiving:", err);
      alert("Failed to archive employee.");
    }
  };

  const handleUnarchive = async (employee) => {
    try {
      // move back to employees
      await setDoc(doc(db, "employees", employee.id), employee);
      // delete from archivedEmployees
      await deleteDoc(doc(db, "archivedEmployees", employee.id));
      alert(`${employee.name} unarchived successfully.`);
    } catch (err) {
      console.error("Error unarchiving:", err);
      alert("Failed to unarchive employee.");
    }
  };

  // Delete employee
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await deleteDoc(doc(db, "employees", id));
      alert("Employee deleted successfully.");
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Failed to delete employee.");
    }
  };

  // ✅ Open Edit Modal and fetch fresh data
  const openEditModal = async (employeeId) => {
    try {
      const snap = await getDoc(doc(db, "employees", employeeId));
      if (snap.exists()) {
        setEditingEmployee({
          id: employeeId,
          ...snap.data()
        });
      } else {
        alert("Employee not found.");
      }
    } catch (err) {
      console.error("Error fetching employee:", err);
      alert("Failed to fetch employee details.");
    }
  };

  // Update employee in Firestore
  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "employees", editEmployee), editData);
      alert("Employee updated successfully.");
      setEditEmployee(null);
      setEditData({});
    } catch (err) {
      console.error("Error updating:", err);
      alert("Failed to update employee.");
    }
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

      {/* 🔍 Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search professionals..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>


      <div className="employee-grid">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee, index) => {
            const videoId = extractYouTubeId(employee.introductionVideoLink);

            return (
              <div
                key={employee.id}
                className={`employee-card ${expandedCards[employee.id] ? 'expanded' : ''} ${isAdminPanel ? 'admin-card' : ''}`}
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
                        </div>

                      </div>
                      <div className="profile-info">
                        <h3 className="employee-name">
                          <Link to={`/employee/${employee.id}`} className="employee-link">
                            {employee.name}
                          </Link>
                        </h3>
                        <p className="employee-position">{employee.expertise}</p>
                      </div>
                    </div>

                    <div className="employee-intro">
                      <p style={{ color: '#2A2D7C' }}>{employee.intro}</p>
                    </div>

                    {/* Document Buttons - Always Visible (Moved outside expandable-content) */}
                    <div className="document-buttons-container">
                      {employee.resume && (
                        <button
                          className="document-button resume-button"
                          onClick={(e) => openDocument(employee.resume, 'resume', e)}
                        >
                          <FaFileAlt className="document-icon" /> View Resume
                        </button>
                      )}
                      {employee.assessment && (
                        <button
                          className="document-button assessment-btn"
                          onClick={(e) => openDocument(employee.assessment, 'assessment', e)}
                        >
                          <FaClipboardCheck className="document-icon" /> View Assessment
                        </button>
                      )}
                    </div>
                    {/* ✅ Show icons only in /admin-panel */}
                    {isAdminPanel && (
                      <div className="admin-actions">
                        {archived ? (
                          <FiArchive
                            className="admin-icon"
                            title="Unarchive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnarchive(employee);
                            }}
                          />
                        ) : (
                          <FiArchive
                            className="admin-icon"
                            title="Archive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchive(employee);
                            }}
                          />
                        )}
                        {!archived && (
                          <FiEdit
                            className="admin-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(employee.id);
                            }}
                          />
                        )}
                        <FiTrash2
                          className="admin-icon"
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(employee.id);
                          }}
                        />
                      </div>
                    )}
                    <div className={`expandable-content ${expandedCards[employee.id] ? 'visible' : ''}`}>
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

      {/* Document Viewer Modal */}
      {viewerState.isOpen && (
        <div className="document-viewer">
          <div className="viewer-overlay" onClick={closeDocument}></div>

          <div className="viewer-container">
            <div className="viewer-header" style={{ backgroundColor: '#2a2d7c' }}>
              <h3 style={{ color: 'white' }}>{getDocumentTitle()}</h3>

              <div className="viewer-actions">
                <a
                  href={viewerState.document.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
                  title="Open in new tab"
                >
                  <FaExternalLinkAlt color="white" />
                </a>
                <button
                  onClick={closeDocument}
                  className="close-button"
                  aria-label="Close document viewer"
                >
                  <FaTimes color="white" />
                </button>
              </div>
            </div>

            <div className="viewer-content">
              {viewerState.isLoading && (
                <div className="viewer-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading document...</p>
                </div>
              )}

              <iframe
                src={getEmbedUrl(viewerState.document.link)}
                title={getDocumentTitle()}
                className={`document-iframe ${viewerState.isLoading ? 'loading' : ''}`}
                allow="fullscreen"
                onLoad={handleIframeLoad}
              />
            </div>
          </div>
        </div>
      )}

      {editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onUpdated={() => {
            setEditingEmployee(null);
            refreshEmployees(); // Refresh the employee list
          }}
        />
      )}

      {editModalId && (
        <EditEmployeeModal
          employeeId={editModalId}
          onClose={() => setEditModalId(null)}
          onUpdated={refreshEmployees}
        />
      )}

      {editEmployee && (
        <div className="edit-modal-overlay" onClick={() => setEditEmployee(null)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Employee</h3>

            {Object.keys(editData).map((key) => (
              <div key={key} className="modal-field">
                <label>{key}</label>
                <input
                  type="text"
                  value={editData[key] || ""}
                  onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                />
              </div>
            ))}

            <div className="modal-actions">
              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => setEditEmployee(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeCard;