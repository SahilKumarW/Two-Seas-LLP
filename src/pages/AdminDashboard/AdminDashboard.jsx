import React, { useState, useRef } from 'react';
import './AdminDashboard.css';
import SideNav from '../AdminDashboard/components/SideNav';
import defaultProfileImage from '../../assets/admin.jpg';
import sampleResume from '../../assets/resume.pdf';
import sampleReport from '../../assets/report.pdf';
import defaultVideoThumbnail from '../../assets/video-thumbnail.png';

const AdminDashboard = () => {
  const interviewVideoInputRef = useRef(null);

  // State management
  const [admin, setAdmin] = useState({
    name: 'Shaista',
    rate: 2,
    experience: '2 years',
    expertise: 'Technical Recruitment',
    image: defaultProfileImage,
    video: null,
    interviewVideo: null,
    showIntroVideo: true, // Separate toggle for intro video
    showInterviewVideo: true, // Separate toggle for interview video
    showRate: true // Toggle for rate display
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
  const [videosCollapsed, setVideosCollapsed] = useState(false);
  const [videoSectionsCollapsed, setVideoSectionsCollapsed] = useState({
    introduction: false,
    interview: false
  });

  const [interviewRequested, setInterviewRequested] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const [resumeFile, setResumeFile] = useState(null);
  const [reportFile, setReportFile] = useState(null);

  const [niches, setNiches] = useState([
    { id: 1, name: 'Dinotec', employees: [], visibleTo: [] },
    { id: 2, name: '3Sip Services', employees: [], visibleTo: [] },
    { id: 3, name: 'Masterways', employees: [], visibleTo: [] },
    { id: 4, name: 'Akuls', employees: [], visibleTo: [] }
  ]);

  const [selectedClient, setSelectedClient] = useState(null);

  const [clients] = useState([
    { id: 'client1', name: 'ABC Corporation' },
    { id: 'client2', name: 'XYZ Industries' },
    { id: 'client3', name: 'Acme Ltd' }
  ]);

  const [visibilityModal, setVisibilityModal] = useState({
    isOpen: false,
    currentNiche: null
  });

  const NicheVisibilityModal = ({ clients, niche, onClose, onSave }) => {
    const [selectedClients, setSelectedClients] = useState(niche?.visibleTo || []);

    const toggleClient = (clientId) => {
      setSelectedClients(prev =>
        prev.includes(clientId)
          ? prev.filter(id => id !== clientId)
          : [...prev, clientId]
      );
    };

    const handleSave = () => {
      onSave(selectedClients);
      onClose();
    };

    return (
      <div className="modal-overlay">
        <div className="visibility-modal">
          <div className="modal-header">
            <h3 style={{ color: '#2A2D7C' }}>Manage Visibility for {niche?.name}</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <div className="client-list">
            {clients.map(client => (
              <label key={client.id} className="client-item">
                <input
                  type="checkbox"
                  checked={selectedClients.includes(client.id)}
                  onChange={() => toggleClient(client.id)}
                />
                <span>{client.name}</span>
              </label>
            ))}
          </div>

          <div className="modal-actions">
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
            <button className="save-btn" style={{ backgroundColor: '#2A2D7C' }} onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </div>
    );
  };

  const [wishlist, setWishlist] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);

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
    }
  };

  const handleReportUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReportFile(file);
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

  // Niche and wishlist functions
  const addToNiche = (nicheId) => {
    setNiches(niches.map(niche =>
      niche.id === nicheId
        ? { ...niche, employees: [...niche.employees, admin] }
        : niche
    ));
    alert(`Employee ${admin.name} added to ${niches.find(n => n.id === nicheId).name}`);
  };

  const toggleWishlist = () => {
    if (wishlist.some(item => item.name === admin.name)) {
      setWishlist(wishlist.filter(item => item.name !== admin.name));
    } else {
      setWishlist([...wishlist, admin]);
    }
  };

  const isInWishlist = () => {
    return wishlist.some(item => item.name === admin.name);
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

  // New handler for interview video upload
  const handleInterviewVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setAdmin({ ...admin, interviewVideo: videoUrl });
    }
  };

  const removeInterviewVideo = () => {
    if (admin.interviewVideo) {
      URL.revokeObjectURL(admin.interviewVideo);
    }
    setAdmin({ ...admin, interviewVideo: null });
  };

  // Toggle functions
  const toggleIntroductionVideo = () => {
    setVideoSectionsCollapsed(prev => ({
      ...prev,
      introduction: !prev.introduction
    }));
  };

  const toggleInterviewVideo = () => {
    setVideoSectionsCollapsed(prev => ({
      ...prev,
      interview: !prev.interview
    }));
  };

  const toggleAllVideos = () => {
    const bothVisible = admin.showIntroVideo && admin.showInterviewVideo;
    setAdmin({
      ...admin,
      showIntroVideo: !bothVisible,
      showInterviewVideo: !bothVisible
    });
  };

  const toggleRate = () => {
    setAdmin({ ...admin, showRate: !admin.showRate });
  };

  return (
    <div className="admin-dashboard">
      <SideNav
        wishlist={wishlist}
        setShowWishlist={setShowWishlist}
      />
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
              <div className="rate-display">
                {admin.showRate ? (
                  <div className="rate-badge">
                    {renderEditableField('rate', 'Rate')}
                  </div>
                ) : (
                  <span className="rate-hidden">Rate Hidden</span>
                )}
                <button onClick={toggleRate} className="toggle-eye-btn">
                  <EyeIcon visible={admin.showRate} />
                </button>
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

        {/* Client Visibility Controls
        <div className="client-controls">
          <h3>Client Visibility</h3>
          <div className="client-selector">
            <label>Select Client:</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(Number(e.target.value))}
            >
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
        </div> */}

        {/* Niche Selection Section */}
        <div className="niche-section">
          <div className="section-header">
            <h3 className="section-title">Niche Management</h3>
          </div>

          <div className="niche-grid">
            {niches.map(niche => (
              <div key={niche.id} className="niche-card">
                <div className="niche-info">
                  <h4 className='niche-name'>{niche.name}</h4>
                  <div className="visibility-info">
                    <span>
                      {niche.visibleTo.length > 0
                        ? `Visible to ${niche.visibleTo.length} client(s)`
                        : 'Hidden from all clients'}
                    </span>
                    <button
                      className="manage-visibility-btn"
                      onClick={() => setVisibilityModal({
                        isOpen: true,
                        currentNiche: niche
                      })}
                    >
                      Manage
                    </button>
                  </div>
                </div>
                <button
                  className="add-to-niche-btn"
                  onClick={() => addToNiche(niche.id)}
                >
                  Add Employee
                </button>
              </div>
            ))}
          </div>

          {visibilityModal.isOpen && (
            <NicheVisibilityModal
              clients={clients}
              niche={visibilityModal.currentNiche}
              onClose={() => setVisibilityModal({ isOpen: false, currentNiche: null })}
              onSave={(selectedClients) => {
                setNiches(
                  niches.map(n =>
                    n.id === visibilityModal.currentNiche.id
                      ? { ...n, visibleTo: selectedClients }
                      : n
                  )
                );
              }}
            />
          )}
        </div>

        {/* Video Section */}
        <div className="video-section">
          <div className={`video-header-section ${!videosCollapsed ? 'uncollapsed' : ''}`}>
            <div className="section-header" onClick={() => setVideosCollapsed(!videosCollapsed)}>
              <h3 className="section-title">Videos</h3>
              <span className="collapse-icon-wrapper">
                <CollapseIcon collapsed={videosCollapsed} />
              </span>
            </div>
          </div>

          <input
            type="file"
            ref={videoInputRef}
            onChange={handleVideoUpload}
            accept="video/*"
            style={{ display: 'none' }}
          />
          <input
            type="file"
            ref={interviewVideoInputRef}
            onChange={handleInterviewVideoUpload}
            accept="video/*"
            style={{ display: 'none' }}
          />

          {!videosCollapsed && (
            <>
              {/* Introduction Video */}
              <div className="video-subsection">
                <div
                  className={`subsection-header ${!videoSectionsCollapsed.introduction ? 'uncollapsed' : ''}`}
                  onClick={toggleIntroductionVideo}
                >
                  <h4 className="subsection-title">
                    Introduction Video
                  </h4>
                  <div className="video-actions">
                    {admin.video ? (
                      <button onClick={(e) => {
                        e.stopPropagation();
                        removeVideo();
                      }} className="action-btn remove-btn">
                        Remove Video
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          videoInputRef.current.click();
                        }}
                        className="action-btn upload-btn"
                      >
                        Add Video
                      </button>
                    )}
                  </div>
                  <span className="collapse-icon-wrapper">
                    <CollapseIcon collapsed={videoSectionsCollapsed.introduction} />
                  </span>
                </div>

                {!videoSectionsCollapsed.introduction && (
                  <div className="video-container">
                    <div className="dummy-player">
                      {admin.video ? (
                        <video
                          src={admin.video}
                          controls
                          className="video-player"
                        />
                      ) : (
                        <div className="dummy-player-placeholder">
                          <div className="dummy-player-screen"></div>
                          <div className="dummy-player-controls">
                            <div className="play-button">
                              <svg width="16" height="16" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                            <div className="progress-bar"></div>
                            <div className="time-display">0:00 / 0:00</div>
                            <div className="volume-control">
                              <svg width="16" height="16" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                              </svg>
                            </div>
                            <div className="fullscreen">
                              <svg width="16" height="16" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Interview Video */}
              <div className="video-subsection">
                <div
                  className={`subsection-header ${!videoSectionsCollapsed.interview ? 'uncollapsed' : ''}`}
                  onClick={toggleInterviewVideo}
                >
                  <h4 className="subsection-title">
                    Interview Video
                  </h4>
                  <div className="video-actions">
                    {admin.interviewVideo ? (
                      <button onClick={(e) => {
                        e.stopPropagation();
                        removeInterviewVideo();
                      }} className="action-btn remove-btn">
                        Remove Video
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          interviewVideoInputRef.current.click();
                        }}
                        className="action-btn upload-btn"
                      >
                        Add Video
                      </button>
                    )}
                  </div>
                  <span className="collapse-icon-wrapper">
                    <CollapseIcon collapsed={videoSectionsCollapsed.interview} />
                  </span>
                </div>

                {!videoSectionsCollapsed.interview && (
                  <div className="video-container">
                    <div className="dummy-player">
                      {admin.interviewVideo ? (
                        <video
                          src={admin.interviewVideo}
                          controls
                          className="video-player"
                        />
                      ) : (
                        <div className="dummy-player-placeholder">
                          <div className="dummy-player-screen"></div>
                          <div className="dummy-player-controls">
                            <div className="play-button">
                              <svg width="16" height="16" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                            <div className="progress-bar"></div>
                            <div className="time-display">0:00 / 0:00</div>
                            <div className="volume-control">
                              <svg width="16" height="16" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                              </svg>
                            </div>
                            <div className="fullscreen">
                              <svg width="16" height="16" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
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
                >
                  <DownloadIcon /> Download Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Modal */}
        {showWishlist && (
          <div className="wishlist-modal">
            <div className="wishlist-content">
              <div className="wishlist-header">
                <h2 className="wishlist-title">Your Wishlist</h2>
                <button
                  className="close-btn"
                  onClick={() => setShowWishlist(false)}
                >
                  ×
                </button>
              </div>

              {wishlist.length === 0 ? (
                <p className='wishlist-empty-text'>Your wishlist is empty</p>
              ) : (
                <div className="wishlist-items">
                  {wishlist.map((candidate, index) => (
                    <div key={index} className="wishlist-item">
                      <div className="candidate-info">
                        <img src={candidate.image} alt={candidate.name} />
                        <div className="candidate-details">
                          <h3>{candidate.name}</h3>
                          <p className="candidate-expertise">{candidate.expertise}</p>
                          <p className="candidate-rate">${candidate.rate}/hr</p>
                        </div>
                      </div>
                      <div className="wishlist-actions">
                        <button
                          className="schedule-btn"
                          onClick={() => {
                            setShowWishlist(false);
                            // You might want to pre-fill interview scheduling here
                          }}
                        >
                          Schedule Interview
                        </button>
                        <button
                          className="remove-icon"
                          onClick={() => setWishlist(wishlist.filter(item => item.name !== candidate.name))}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div >
    </div >
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

// Add these new icon components at the bottom of your file
const CollapseIcon = ({ collapsed }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`collapse-icon ${collapsed ? 'collapsed' : ''}`}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const EyeIcon = ({ visible }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="eye-icon"
  >
    {visible ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </>
    )}
  </svg>
);

export default AdminDashboard;