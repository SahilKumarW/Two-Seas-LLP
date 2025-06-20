import React, { useState, useRef, useEffect } from 'react';
import './AdminDashboard.css';
import SideNav from '../AdminDashboard/components/SideNav';
import defaultProfileImage from '../../assets/admin.jpg';
import sampleResume from '../../assets/resume.pdf';
import sampleReport from '../../assets/report.pdf';
import defaultVideoThumbnail from '../../assets/video-thumbnail.png';
import CandidateProfile from '../CandidateProfile/CandidateProfile';
import { currencies, niches as importedNiches } from './constants';

const AdminDashboard = () => {
  const interviewVideoInputRef = useRef(null);

  // State management
  const [admin, setAdmin] = useState({
    name: 'Shaista ',
    rate: 2,
    currency: 'USD',
    experience: '2 years',
    expertise: 'Technical Recruitment',
    intro: 'Experienced recruiter with a focus on technical roles in the IT sector.',
    image: defaultProfileImage,
    video: null,
    interviewVideo: null,
    showIntroVideo: true,
    showInterviewVideo: true,
    showRate: true,
    showExpertise: true,
    showVideoSection: true,
    videoVisibility: {
      introduction: {
        hidden: false,
        collapsed: false
      },
      interview: {
        hidden: false,
        collapsed: false
      }
    }
  });

  const [editing, setEditing] = useState({
    name: false,
    rate: false,
    expertise: false,
    experience: false,
    intro: false
  });

  const [tempValues, setTempValues] = useState({
    name: '',
    rate: '',
    expertise: '',
    experience: '',
    intro: ''
  });

  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  // Add this useEffect hook near your other state declarations
  const currencyDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target)) {
        setShowCurrencyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const EmployeeSelectionModal = ({
    isOpen,
    employees,
    currentNiche,
    onClose,
    onConfirm
  }) => {
    const [selectedEmployees, setSelectedEmployees] = useState([]); // Changed to array for multiple selection

    const toggleEmployeeSelection = (employee) => {
      setSelectedEmployees(prev =>
        prev.some(e => e.id === employee.id)
          ? prev.filter(e => e.id !== employee.id)
          : [...prev, employee]
      );
    };

    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="employee-selection-modal">
          <div className="modal-header">
            <h3>Select Employees for {currentNiche?.name}</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <div className="employee-list">
            {employees.map(employee => (
              <div
                key={employee.id}
                className={`employee-item ${selectedEmployees.some(e => e.id === employee.id) ? 'selected' : ''}`}
                onClick={() => toggleEmployeeSelection(employee)}
              >
                <img src={employee.image} alt={employee.name} className="employee-image" />
                <div className="employee-details">
                  <h4>{employee.name}</h4>
                  <p>{employee.expertise}</p>
                </div>
                <div className="selection-checkbox">
                  {selectedEmployees.some(e => e.id === employee.id) && (
                    <span className="checkmark">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="modal-actions">
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
            <button
              className="confirm-btn"
              disabled={selectedEmployees.length === 0}
              onClick={() => {
                if (selectedEmployees.length > 0) {
                  if (window.confirm(`Add ${selectedEmployees.length} employee(s) to ${currentNiche.name}?`)) {
                    selectedEmployees.forEach(employee => onConfirm(employee));
                    onClose();
                  }
                }
              }}
            >
              Confirm Selection ({selectedEmployees.length})
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [employeeSelectionModal, setEmployeeSelectionModal] = useState({
    isOpen: false,
    currentNiche: null
  });

  const [viewingCandidate, setViewingCandidate] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [selectedTimes, setSelectedTimes] = useState({
    day: '',
    date: '',
    time: ''
  });

  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null); // Track which dropdown is open

  const toggleTimeDropdown = (candidateId) => {
    setOpenDropdownId(openDropdownId === candidateId ? null : candidateId);
  };

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

  const [niches, setNiches] = useState(() => {
    // Initialize with your company data
    const initialCompanies = [
      { id: 1, name: 'Dinotec', employees: [], visibleTo: [], visibleToNiches: [], hidden: false },
      { id: 2, name: '3Sip Services', employees: [], visibleTo: [], visibleToNiches: [], hidden: false },
      { id: 3, name: 'Masterways', employees: [], visibleTo: [], visibleToNiches: [], hidden: false },
      { id: 4, name: 'Akuls', employees: [], visibleTo: [], visibleToNiches: [], hidden: false }
    ];

    return initialCompanies;
  });

  const [selectedClient, setSelectedClient] = useState(null);

  const [clients] = useState([
    { id: 'client1', name: 'ABC Corporation' },
    { id: 'client2', name: 'XYZ Industries' },
    { id: 'client3', name: 'Acme Ltd' }
  ]);

  const DEFAULT_WISHLIST = [
    {
      id: 1,
      name: 'Muhammad Ibrahim',
      rate: 45,
      currency: 'PKR',
      experience: '5 years',
      expertise: 'Frontend Development',
      intro: 'Experienced React developer with a focus on UI/UX design.',
      image: defaultProfileImage,
      video: null,
      interviewVideo: null,
      showRate: true
    },
    {
      id: 2,
      name: 'Jane Smith',
      rate: 55,
      currency: 'EUR',
      experience: '7 years',
      expertise: 'Backend Development',
      intro: 'Senior Node.js developer with extensive database experience.',
      image: defaultProfileImage,
      video: null,
      interviewVideo: null,
      showRate: true
    },
    {
      id: 3,
      name: 'Alex Johnson',
      rate: 60,
      currency: 'GBP',
      experience: '8 years',
      expertise: 'Full Stack Development',
      intro: 'Skilled in both frontend and backend technologies.',
      image: defaultProfileImage,
      video: null,
      interviewVideo: null,
      showRate: false  // Testing hidden rate
    }
  ];

  const [visibilityModal, setVisibilityModal] = useState({
    isOpen: false,
    currentNiche: null
  });

  const NicheVisibilityModal = ({ clients, niche, onClose, onSave }) => {
    const [selectedClients, setSelectedClients] = useState(niche?.visibleTo || []);
    const [selectedNiches, setSelectedNiches] = useState(niche?.visibleToNiches || []);

    const toggleClient = (clientId) => {
      setSelectedClients(prev =>
        prev.includes(clientId)
          ? prev.filter(id => id !== clientId)
          : [...prev, clientId]
      );
    };

    const toggleNiche = (nicheId) => {
      setSelectedNiches(prev =>
        prev.includes(nicheId)
          ? prev.filter(id => id !== nicheId)
          : [...prev, nicheId]
      );
    };

    const handleSave = () => {
      onSave(selectedClients, selectedNiches);
      onClose();
    };

    return (
      <div className="modal-overlay">
        <div className="visibility-modal">
          <div className="modal-header">
            <h3>Manage Visibility for {niche?.name}</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <div className="modal-content-scrollable">
            {/* <div className="selection-section">
              <h4>Select Clients</h4>
              <div className="selection-list">
                {clients.map(client => (
                  <label key={client.id} className="selection-item">
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.id)}
                      onChange={() => toggleClient(client.id)}
                    />
                    <span>{client.name}</span>
                  </label>
                ))}
              </div>
            </div> */}

            <div className="selection-section">
              <h4>Select Niches</h4>
              <div className="selection-list">
                {importedNiches.map(nicheItem => (
                  <label key={nicheItem.id} className="selection-item">
                    <input
                      type="checkbox"
                      checked={selectedNiches.includes(nicheItem.id)}
                      onChange={() => toggleNiche(nicheItem.id)}
                    />
                    <span>{nicheItem.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
            <button className="save-btn" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </div>
    );
  };

  const [wishlist, setWishlist] = useState(DEFAULT_WISHLIST);
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

  const handleTimeSelect = (slot, candidate) => {  // Now passing the whole candidate object
    setSelectedTimes({
      day: slot.day,
      date: slot.date,
      time: slot.time
    });
    setOpenDropdownId(null); // Close dropdown after selection
    alert(`Interview scheduled for ${candidate.name} on ${slot.day}, ${slot.date} at ${slot.time}`);
  };

  const handlePlayVideo = () => {
    if (admin.video) {
      setVideoPlaying(!videoPlaying);
    }
  };

  const handleRequestInterview = (candidate) => {
    if (selectedTimes.day && selectedTimes.date && selectedTimes.time) {
      alert(`Interview scheduled for ${candidate.name} on ${selectedTimes.day}, ${selectedTimes.date} at ${selectedTimes.time}`);
      setSelectedTimes({ day: '', date: '', time: '' });
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

  // Modify the wishlist item click handler
  const handleViewCandidate = (candidate) => {
    setViewingCandidate(candidate);
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

  const openEmployeeSelection = (niche) => {
    setEmployeeSelectionModal({
      isOpen: true,
      currentNiche: niche
    });
  };

  // Niche and wishlist functions
  const addToNiche = (employee) => {
    setNiches(niches.map(niche =>
      niche.id === employeeSelectionModal.currentNiche.id
        ? { ...niche, employees: [...niche.employees, employee] }
        : niche
    ));
    alert(`${employee.name} was added to ${employeeSelectionModal.currentNiche.name}`);
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

  const toggleVideoSection = () => {
    setAdmin(prev => ({
      ...prev,
      showVideoSection: !prev.showVideoSection
    }));
  };

  const toggleVideoHidden = (section) => {
    setAdmin(prev => ({
      ...prev,
      videoVisibility: {
        ...prev.videoVisibility,
        [section]: {
          ...prev.videoVisibility[section],
          hidden: !prev.videoVisibility[section].hidden
        }
      }
    }));
  };

  const toggleVideoCollapsed = (section) => {
    setAdmin(prev => ({
      ...prev,
      videoVisibility: {
        ...prev.videoVisibility,
        [section]: {
          ...prev.videoVisibility[section],
          collapsed: !prev.videoVisibility[section].collapsed
        }
      }
    }));
  };

  const toggleRate = () => {
    setAdmin({ ...admin, showRate: !admin.showRate });
  };

  const toggleExpertise = () => {
    setAdmin({ ...admin, showExpertise: !admin.showExpertise });
  };

  // Add new handler for currency selection
  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
    setShowCurrencyDropdown(false);
    setAdmin({ ...admin, currency: currency.code });
  };

  // JSX for editable fields
  const renderEditableField = (field, label) => {
    if (editing[field]) {
      return (
        <div className="editing-field">
          {field === 'intro' ? (
            <textarea
              value={tempValues[field]}
              onChange={(e) => handleInputChange(e, field)}
              className="edit-textarea"
              rows={3}
            />
          ) : (
            <input
              type={field === 'rate' ? 'number' : 'text'}
              value={tempValues[field]}
              onChange={(e) => handleInputChange(e, field)}
              className="edit-input"
            />
          )}
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
        <span>
          {field === 'rate' ?
            `${selectedCurrency.symbol}${admin[field]}/hr` :
            field === 'expertise' && !admin.showExpertise ? 'Expertise Hidden' :
              admin[field]}
        </span>
        {field !== 'expertise' || admin.showExpertise ? (
          <button onClick={() => startEditing(field)} className="edit-btn">
            <EditIcon />
          </button>
        ) : null}
      </div>
    );
  };

  if (selectedCandidate) {
    return <CandidateProfile candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />;
  }

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

            {/* Add Wishlist Button Here */}
            <button
              onClick={toggleWishlist}
              className={`wishlist-btn ${isInWishlist() ? 'in-wishlist' : ''}`}
            >
              {isInWishlist() ? '❤️ Remove from Wishlist' : '♡ Add to Wishlist'}
            </button>
          </div>

          <div className="profile-content">
            {/* Name + Currency + Rate */}
            <div className="profile-header">
              <div className="name-and-currency">
                <h2>
                  {editing.name ? (
                    <div className="editing-field">
                      <input
                        type="text"
                        value={tempValues.name}
                        onChange={(e) => handleInputChange(e, 'name')}
                        className="edit-input name-input"
                      />
                      <div className="edit-buttons">
                        <button onClick={() => saveEdit('name')} className="save-btn">Save</button>
                        <button onClick={() => cancelEdit('name')} className="cancel-btn">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {admin.name}
                      <button onClick={() => startEditing('name')} className="edit-btn">
                        <EditIcon />
                      </button>
                    </>
                  )}
                </h2>
                <div className="currency-selector" ref={currencyDropdownRef}>
                  <button
                    className="currency-btn"
                    onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  >
                    <img src={selectedCurrency.flag} alt={selectedCurrency.name} className="currency-flag" />
                    <span>{selectedCurrency.code}</span>
                    <ChevronDown />
                  </button>
                  {showCurrencyDropdown && (
                    <div className="currency-dropdown">
                      {currencies.map(currency => (
                        <div
                          key={currency.code}
                          className="currency-option"
                          onClick={() => handleCurrencySelect(currency)}
                        >
                          <img src={currency.flag} alt={currency.name} className="currency-flag" />
                          <span>{currency.code} ({currency.symbol})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

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

            {/* INTRODUCTION: moved here */}
            <div className="intro-block">
              <span className="detail-label">Introduction</span>
              <div className="detail-value">
                {editing.intro ? (
                  <div className="editing-field">
                    <textarea
                      value={tempValues.intro}
                      onChange={(e) => handleInputChange(e, 'intro')}
                      className="edit-textarea"
                      rows={3}
                    />
                    <div className="edit-buttons">
                      <button onClick={() => saveEdit('intro')} className="save-btn">Save</button>
                      <button onClick={() => cancelEdit('intro')} className="cancel-btn">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="intro-text">{admin.intro}</p>
                    <button onClick={() => startEditing('intro')} className="edit-btn">
                      <EditIcon />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Experience, Expertise, Resume, Report */}
            <div className="profile-details-container">
              <div className="profile-details-column">
                <div className="detail-item">
                  <span className="detail-label">Experience</span>
                  <div className="detail-value">
                    {editing.experience ? (
                      <div className="editing-field">
                        <input
                          type="text"
                          value={tempValues.experience}
                          onChange={(e) => handleInputChange(e, 'experience')}
                          className="edit-input"
                        />
                        <div className="edit-buttons">
                          <button onClick={() => saveEdit('experience')} className="save-btn">Save</button>
                          <button onClick={() => cancelEdit('experience')} className="cancel-btn">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {admin.experience}
                        <button onClick={() => startEditing('experience')} className="edit-btn">
                          <EditIcon />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Expertise</span>
                  <div className="detail-value">
                    {admin.showExpertise ? (
                      renderEditableField('expertise', 'Expertise')
                    ) : (
                      <span className="expertise-hidden">Expertise Hidden</span>
                    )}
                    <button onClick={toggleExpertise} className="toggle-eye-btn hide-eye-btn">
                      <EyeIcon visible={admin.showExpertise} />
                    </button>
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
                    {(niche.visibleTo?.length > 0 || niche.visibleToNiches?.length > 0) ? (
                      <span>
                        Shown to {
                          [
                            ...(niche.visibleTo || []).map(clientId =>
                              clients.find(c => c.id === clientId)?.name
                            ),
                            ...(niche.visibleToNiches || []).map(nicheId =>
                              importedNiches.find(n => n.id === nicheId)?.name
                            )
                          ]
                            .filter(Boolean)
                            .join(', ')
                            .replace(/, ([^,]*)$/, ' and $1')
                        }
                      </span>
                    ) : (
                      <span>Hidden from all</span>
                    )}
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
                  onClick={() => openEmployeeSelection(niche)}
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
              onSave={(selectedClients, selectedNiches) => {
                setNiches(
                  niches.map(n =>
                    n.id === visibilityModal.currentNiche.id
                      ? { ...n, visibleTo: selectedClients, visibleToNiches: selectedNiches }
                      : n
                  )
                );
              }}
            />
          )}
        </div>

        {/* Video Section */}
        {admin.showVideoSection ? (
          <div className="video-section">
            <div className={`video-header-section ${!videosCollapsed ? 'uncollapsed' : ''}`}>
              <div className="section-header" onClick={() => setVideosCollapsed(!videosCollapsed)}>
                <h3 className="section-title">Videos</h3>
                <div className="section-header-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVideoSection();
                    }}
                    className="toggle-eye-btn hide-eye-btn">
                    <EyeIcon visible={admin.showVideoSection} />
                  </button>
                  <span className="collapse-icon-wrapper">
                    <CollapseIcon collapsed={videosCollapsed} />
                  </span>
                </div>
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
                  {admin.videoVisibility.introduction.hidden ? (
                    <div className="placeholder-row">
                      <p><i>The introduction video is hidden.</i></p>
                      <button
                        onClick={() => toggleVideoHidden('introduction')}
                        className="unhide-btn"
                      >
                        Unhide
                      </button>
                    </div>
                  ) : (
                    <>
                      <div
                        className={`subsection-header ${!admin.videoVisibility.introduction.collapsed ? 'uncollapsed' : ''}`}
                        onClick={() => toggleVideoCollapsed('introduction')}
                      >
                        <h4 className="subsection-title">
                          Introduction Video
                        </h4>
                        <div className="video-actions">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVideoHidden('introduction');
                            }}
                            className="toggle-eye-btn hide-eye-btn">
                            <EyeIcon visible={true} />
                          </button>
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
                          <CollapseIcon collapsed={admin.videoVisibility.introduction.collapsed} />
                        </span>
                      </div>

                      {!admin.videoVisibility.introduction.collapsed && (
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
                    </>
                  )}
                </div>

                {/* Interview Video */}
                <div className="video-subsection">
                  {admin.videoVisibility.interview.hidden ? (
                    <div className="placeholder-row">
                      <p><i>The interview video is hidden.</i></p>
                      <button
                        onClick={() => toggleVideoHidden('interview')}
                        className="unhide-btn"
                      >
                        Unhide
                      </button>
                    </div>
                  ) : (
                    <>
                      <div
                        className={`subsection-header ${!admin.videoVisibility.interview.collapsed ? 'uncollapsed' : ''}`}
                        onClick={() => toggleVideoCollapsed('interview')}
                      >
                        <h4 className="subsection-title">
                          Interview Video
                        </h4>
                        <div className="video-actions">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVideoHidden('interview');
                            }}
                            className="toggle-eye-btn hide-eye-btn">
                            <EyeIcon visible={true} />
                          </button>
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
                          <CollapseIcon collapsed={admin.videoVisibility.interview.collapsed} />
                        </span>
                      </div>

                      {!admin.videoVisibility.interview.collapsed && (
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
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="hidden-section-placeholder">
            <div className="placeholder-content">
              <p><i>The video section is currently hidden.</i></p>
              <button
                onClick={toggleVideoSection}
                className="unhide-btn"
              >
                Show Videos
              </button>
            </div>
          </div>
        )}

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
                  {wishlist.map((candidate) => (
                    <div key={candidate.id} className="wishlist-item">
                      <div className="candidate-info">
                        <img src={candidate.image} alt={candidate.name} />
                        <div className="candidate-details">
                          <h3
                            className="clickable-name"
                            onClick={() => setSelectedCandidate(candidate)}
                          >
                            {candidate.name}
                          </h3>
                          <p className="candidate-expertise">{candidate.expertise}</p>
                          <p className="candidate-rate">
                            {candidate.showRate ? (
                              <>
                                {candidate.currency === 'USD' ? '$' :
                                  candidate.currency === 'GBP' ? '£' :
                                    candidate.currency === 'EUR' ? '€' :
                                      candidate.currency === 'AED' ? 'د.إ' :
                                        candidate.currency === 'SAR' ? '﷼' :
                                          candidate.currency === 'AUD' ? 'A$' : 'Rs'}
                                {candidate.rate}/hr
                              </>
                            ) : 'Rate hidden'}
                          </p>
                        </div>
                      </div>
                      <div className="wishlist-actions">
                        <div className="schedule-interview-container">
                          <button
                            className="schedule-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTimeDropdown(candidate.id);
                            }}
                          >
                            Schedule Interview
                          </button>
                          {openDropdownId === candidate.id && (
                            <div className="time-slot-dropdown">
                              {timeSlots.map((slot) => (
                                <div
                                  key={`${slot.day}-${slot.time}`}
                                  className="time-slot-option"
                                  onClick={() => handleTimeSelect(slot, candidate)}  // Passing candidate object
                                >
                                  {slot.day}, {slot.date} at {slot.time}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          className="remove-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setWishlist(wishlist.filter(item => item.id !== candidate.id));
                          }}
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
        {employeeSelectionModal.isOpen && (
          <EmployeeSelectionModal
            isOpen={employeeSelectionModal.isOpen}
            employees={wishlist} // Or any other source of employees
            currentNiche={employeeSelectionModal.currentNiche}
            onClose={() => setEmployeeSelectionModal({ isOpen: false, currentNiche: null })}
            onConfirm={addToNiche}
          />
        )}
      </div>
    </div>
  );
};

// Icon components
const PlayIcon = () => <span>▶</span>;
const DownloadIcon = () => <span>⭳</span>;
const EditIcon = () => <span>✎</span>;
const ChevronDown = () => <span>▼</span>;
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