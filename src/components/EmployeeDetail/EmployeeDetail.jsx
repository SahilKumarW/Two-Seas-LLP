import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFileAlt, FaTimes, FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import { getEmployeeById } from '../../services/employeeService';
import './EmployeeDetail.css';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDocument, setActiveDocument] = useState(null);
  const [documentType, setDocumentType] = useState(null);
  const [viewerState, setViewerState] = useState({
    isOpen: false,
    document: null,
    type: '',
    isLoading: true
  });

  const openDocument = (doc, type) => {
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

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employeeData = await getEmployeeById(id);
        if (employeeData) {
          setEmployee(employeeData);
        } else {
          setError('Professional not found');
        }
      } catch (err) {
        setError('Failed to load professional');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return date.toLocaleString();
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading professional...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> Back to Professionals
        </button>
      </div>
    );
  }

  return (
    <div className="employee-detail-container">
      <div className="detail-header">
        <div className="header-content">
          <h1>Professional Profile</h1>
          <p>Detailed information about {employee.name}</p>
        </div>
      </div>

      <div className="detail-card">
        <div className="profile-section">
          <div className="avatar-container">
            <img
              src={employee.imageBase64 || 'https://via.placeholder.com/300'}
              alt={employee.name}
              className="detail-avatar"
            />
          </div>

          <div className="profile-info">
            <h2 style={{ color: 'white' }}>{employee.name}</h2>
            <p className="position" style={{ color: 'white' }}>{employee.expertise}</p>
            <div className="meta-info">
              <span>{employee.experience} years experience</span>
              <span>{employee.currency} {employee.rate}/hr</span>
            </div>
          </div>
        </div>

        <div className="content-section">
          <div className="intro-section">
            <h3>Professional Introduction</h3>
            <p>{employee.intro}</p>
          </div>

          <div className="expertise-section">
            <h3>Core Expertise</h3>
            <div className="skills-container">
              {employee.expertise?.split(',').map((skill, index) => (
                <span key={index} className="skill-tag">{skill.trim()}</span>
              ))}
            </div>
          </div>

          <div className="media-section">
            {employee.introductionVideoLink && (
              <div className="video-container">
                <h3>Introduction Video</h3>
                <div className="video-wrapper">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(employee.introductionVideoLink)}`}
                    title="Introduction Video"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {employee.interviewVideoLink && (
              <div className="video-container">
                <h3>Interview Video</h3>
                <div className="video-wrapper">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(employee.interviewVideoLink)}`}
                    title="Interview Video"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          <div className="documents-section">
            {/* <h3>Documents</h3> */}

            {employee.resume && (
              <div className="document-card" onClick={() => openDocument(employee.resume, 'resume')}>
                <span className="doc-link">View Resume</span>
              </div>
            )}

            {employee.assessment && (
              <div className="document-card" onClick={() => openDocument(employee.assessment, 'assessment')}>
                <span className="doc-link">View Assessment</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Document Viewer Modal */}
      {viewerState.isOpen && (
        <div className="document-viewer">
          <div className="viewer-overlay" onClick={closeDocument}></div>

          <div className="viewer-container">
            <div className="viewer-header">
              <h3 style={{ color: "#2a2d7c" }}>{getDocumentTitle()}</h3>

              <div className="viewer-actions">
                <a
                  href={viewerState.document.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
                  title="Open in new tab"
                >
                  <FaExternalLinkAlt />
                </a>
                <button
                  onClick={closeDocument}
                  className="close-button"
                  aria-label="Close document viewer"
                >
                  <FaTimes />
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
    </div>
  );
};

export default EmployeeDetail;