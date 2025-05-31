import React, { useState, useRef } from 'react';
import './AdminDashboard.css';
import SideNav from '../AdminDashboard/components/SideNav';
import defaultProfileImage from '../../assets/admin.jpg';
import sampleResume from '../../assets/resume.pdf';
import sampleReport from '../../assets/report.pdf';
import defaultVideoThumbnail from '../../assets/video-thumbnail.png';

const AdminDashboard = () => {
  // State management
  const [admin, setAdmin] = useState({
    name: 'Shaista',
    rate: 2,
    experience: '2 years',
    expertise: 'Technical Recruitment',
    image: defaultProfileImage,
    video: null
  });

  const [editing, setEditing] = useState({
    rate: false,
    expertise: false
  });

  const [tempValues, setTempValues] = useState({
    rate: '',
    expertise: ''
  });

  const [selectedTimes, setSelectedTimes] = useState({
    day: '',
    date: '',
    time: ''
  });

  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [interviewRequested, setInterviewRequested] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const [resumeFile, setResumeFile] = useState(null);
  const [reportFile, setReportFile] = useState(null);

  // Refs for file inputs
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const reportInputRef = useRef(null);

  // Time slots data
  const timeSlots = [
    { day: 'Mon', date: 'Jun 5', time: '10:00 AM' },
    { day: 'Tue', date: 'Jun 6', time: '2:00 PM' },
    { day: 'Wed', date: 'Jun 7', time: '4:30 PM' },
    { day: 'Thu', date: 'Jun 8', time: '11:00 AM' },
    { day: 'Fri', date: 'Jun 9', time: '3:15 PM' }
  ];

  // Handler functions
  const handleTimeSelect = (slot) => {
    setSelectedTimes({
      day: slot.day,
      date: slot.date,
      time: slot.time
    });
    setShowTimeDropdown(false);
  };

  const handlePlayVideo = () => {
    if (admin.video) {
      setVideoPlaying(!videoPlaying);
    }
  };

  const handleRequestInterview = () => {
    if (selectedTimes.day && selectedTimes.date && selectedTimes.time) {
      setInterviewRequested(true);
    } else {
      alert('Please select day, date and time first');
    }
  };

  // Photo handling
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAdmin({ ...admin, image: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setAdmin({ ...admin, image: defaultProfileImage });
  };

  const toggleResumeModal = () => {
    setShowResumeModal(!showResumeModal);
  };

  const toggleReportModal = () => {
    setShowReportModal(!showReportModal);
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      // You might want to update the preview text with the filename
    }
  };

  const handleReportUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReportFile(file);
      // You might want to update the preview text with the filename
    }
  };

  // Video handling
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setAdmin({ ...admin, video: videoUrl });
    }
  };

  const removeVideo = () => {
    if (admin.video) {
      URL.revokeObjectURL(admin.video);
    }
    setAdmin({ ...admin, video: null });
    setVideoPlaying(false);
  };


  // Edit handlers
  const startEditing = (field) => {
    setEditing({ ...editing, [field]: true });
    setTempValues({ ...tempValues, [field]: admin[field] });
  };

  const saveEdit = (field) => {
    setAdmin({ ...admin, [field]: tempValues[field] });
    setEditing({ ...editing, [field]: false });
  };

  const cancelEdit = (field) => {
    setEditing({ ...editing, [field]: false });
  };

  const handleInputChange = (e, field) => {
    setTempValues({ ...tempValues, [field]: e.target.value });
  };

  // Download handler
  const handleDownload = (type) => {
    if (type === 'report' && reportFile) {
      const url = URL.createObjectURL(reportFile);
      const link = document.createElement('a');
      link.href = url;
      link.download = reportFile.name || 'assessment-report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const fileUrl = type === 'resume' ? sampleResume : '';
    const fileName = type === 'resume' ? 'candidate-resume.pdf' : 'assessment-report.pdf';

    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // JSX for editable fields
  const renderEditableField = (field, label) => {
    if (editing[field]) {
      return (
        <div className="editing-field">
          <input
            type={field === 'rate' ? 'number' : 'text'}
            value={tempValues[field]}
            onChange={(e) => handleInputChange(e, field)}
            className="edit-input"
          />
          <div className="edit-buttons">
            <button onClick={() => saveEdit(field)} className="save-btn">
              Save
            </button>
            <button onClick={() => cancelEdit(field)} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="static-field">
        <span>{admin[field]}{field === 'rate' ? '/hr' : ''}</span>
        <button onClick={() => startEditing(field)} className="edit-btn">
          <EditIcon />
        </button>
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <SideNav />

      <div className="main-content">
        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-image-wrapper">
            <div className="profile-image-container">
              <img src={admin.image} alt={admin.name} className="profile-image" />
              <div className="image-actions">
                <button
                  className="edit-icon"
                  onClick={() => fileInputRef.current.click()}
                  title="Change photo"
                >
                  ✏️
                </button>
                <button
                  className="delete-icon"
                  onClick={removePhoto}
                  disabled={admin.image === defaultProfileImage}
                  title="Remove photo"
                >
                  🗑️
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-header">
              <h2>{admin.name}</h2>
              <div className="rate-badge">
                {renderEditableField('rate', 'Rate')}
              </div>
            </div>

            <div className="profile-details-container">
              <div className="profile-details-column">
                <div className="detail-item">
                  <span className="detail-label">Experience</span>
                  <span className="detail-value">{admin.experience}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Expertise</span>
                  <div className="detail-value">
                    {renderEditableField('expertise', 'Expertise')}
                  </div>
                </div>
              </div>

              <div className="document-previews-column">
                {/* Resume Preview */}
                <div className="document-preview-item">
                  <div className="preview-upload-row">
                    <div className="document-preview-box" onClick={toggleResumeModal}>
                      <div className="document-preview-overlay">
                        <span>Resume Preview</span>
                      </div>
                    </div>
                    <button
                      className="upload-btn"
                      onClick={() => document.getElementById('resume-upload').click()}
                    >
                      Upload
                    </button>
                    <input
                      type="file"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                      onChange={(e) => handleResumeUpload(e)}
                    />
                  </div>
                </div>

                {/* Assessment Report */}
                <div className="document-preview-item">
                  <div className="preview-upload-row">
                    <div className="document-preview-box" onClick={toggleReportModal}>
                      <div className="document-preview-overlay">
                        <span>Assessment Report</span>
                      </div>
                    </div>
                    <button
                      className="upload-btn"
                      onClick={() => document.getElementById('report-upload').click()}
                    >
                      Upload
                    </button>
                    <input
                      type="file"
                      id="report-upload"
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                      onChange={(e) => handleReportUpload(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="video-section">
          <div className="section-header">
            <h3 className="section-title">Introduction Video</h3>
            <div className="video-actions">
              {admin.video ? (
                <>
                  <button onClick={removeVideo} className="action-btn remove-btn">
                    Remove Video
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => videoInputRef.current.click()}
                    className="action-btn upload-btn"
                  >
                    Add Video
                  </button>
                  <input
                    type="file"
                    ref={videoInputRef}
                    onChange={handleVideoUpload}
                    accept="video/*"
                    style={{ display: 'none' }}
                  />
                </>
              )}
            </div>
          </div>

          <div className="video-container">
            <div className="video-wrapper">
              <div className="dummy-video">
                <div className="video-thumbnail" onClick={handlePlayVideo}>
                  {admin.video ? (
                    videoPlaying ? (
                      <video
                        src={admin.video}
                        controls
                        autoPlay
                        className="video-player"
                      />
                    ) : (
                      <div className="thumbnail-placeholder">
                        <div className="play-overlay">
                          <PlayIcon />
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="no-video-placeholder">
                      <span>No video uploaded</span>
                    </div>
                  )}
                </div>

                {admin.video && (
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
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Resume Preview Modal */}
        {showResumeModal && (
          <div className="pdf-modal-overlay">
            <div className="pdf-modal-container">
              <div className="pdf-modal-header">
                <h3>Resume Preview</h3>
                <button className="close-modal" onClick={toggleResumeModal}>
                  &times;
                </button>
              </div>
              <div className="pdf-modal-content">
                <iframe
                  src={resumeFile ? URL.createObjectURL(resumeFile) : sampleResume}
                  width="100%"
                  height="500px"
                  style={{ border: 'none' }}
                  title="Resume Preview"
                >
                  Your browser does not support PDFs. Please download the PDF to view it.
                </iframe>
              </div>
              <div className="pdf-modal-footer">
                <button
                  className="download-btn"
                  onClick={() => handleDownload('resume')}
                >
                  <DownloadIcon /> Download Resume
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assessment Report Modal */}
        {showReportModal && (
          <div className="pdf-modal-overlay">
            <div className="pdf-modal-container">
              <div className="pdf-modal-header">
                <h3>Assessment Report</h3>
                <button className="close-modal" onClick={toggleReportModal}>
                  &times;
                </button>
              </div>
              <div className="pdf-modal-content">
                <iframe
                  src={reportFile ? URL.createObjectURL(reportFile) : sampleReport}
                  width="100%"
                  height="500px"
                  style={{ border: 'none' }}
                  title="Assessment Report"
                >
                  Your browser does not support PDFs. Please download the PDF to view it.
                </iframe>
              </div>
              <div className="pdf-modal-footer">
                <button
                  className="download-btn"
                  onClick={() => handleDownload('report')}
                  // disabled={!reportFile}
                >
                  <DownloadIcon /> Download Report
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Icon components
const PlayIcon = () => <span>▶</span>;
const DownloadIcon = () => <span>⭳</span>;
const EditIcon = () => <span>✎</span>;
const ChevronDown = () => <span>⌄</span>;
const MailIcon = () => <span>✉</span>;
const AutoReplyIcon = () => <span>↻</span>;
const CheckCircle = () => <span>✓</span>;
const ArrowDown = () => <span style={{ color: '#4CC9F0' }}>↓</span>;

export default AdminDashboard;