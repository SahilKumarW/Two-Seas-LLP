// CandidateProfile.js
import React, { useRef, useState } from 'react';
import '../AdminDashboard/AdminDashboard.css';

// Import all required assets
import defaultProfileImage from '../../assets/admin.jpg';
import sampleResume from '../../assets/resume.pdf';
import sampleReport from '../../assets/report.pdf';

// Import flag images
import usFlag from '../../assets/flags/us.png';
import ukFlag from '../../assets/flags/uk.png';
import euFlag from '../../assets/flags/eu.jpg';
import pkFlag from '../../assets/flags/pk.svg';

const CandidateProfile = ({ candidate, onClose }) => {
    const interviewVideoInputRef = useRef(null);
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    // Currency options with imported flags
    const currencies = [
        { code: 'USD', symbol: '$', name: 'US Dollar', flag: usFlag },
        { code: 'GBP', symbol: '£', name: 'British Pound', flag: ukFlag },
        { code: 'EUR', symbol: '€', name: 'Euro', flag: euFlag },
        { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee', flag: pkFlag }
    ];

    const selectedCurrency = currencies.find(c => c.code === candidate.currency) || currencies[0];

    const handleDownload = (type) => {
        const fileUrl = type === 'resume' ? sampleResume : sampleReport;
        const fileName = type === 'resume' ? 'candidate-resume.pdf' : 'assessment-report.pdf';

        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Make sure the candidate has all required properties with defaults
    const profileData = {
        ...candidate,
        image: candidate.image || defaultProfileImage,
        intro: candidate.intro || 'No introduction available.',
        experience: candidate.experience || 'Experience not specified',
        expertise: candidate.expertise || 'Expertise not specified',
        showRate: candidate.showRate !== false, // default to true
        video: candidate.video || null,
        interviewVideo: candidate.interviewVideo || null
    };

    return (
        <div className="admin-dashboard">
            <div className="main-content">
                {/* Back button at the top */}
                <div className="back-to-wishlist">
                    <button onClick={onClose} className="upload-btn">
                        ← Back to Wishlist
                    </button>
                </div>

                {/* Profile Section */}
                <div className="profile-section">
                    <div className="profile-image-wrapper">
                        <div className="profile-image-container">
                            <img src={profileData.image} alt={profileData.name} className="profile-image" />
                        </div>
                    </div>

                    <div className="profile-content">
                        {/* Name + Currency + Rate */}
                        <div className="profile-header">
                            <div className="name-and-currency">
                                <h2>{profileData.name}</h2>
                                <div className="currency-selector">
                                    <button className="currency-btn">
                                        <img src={selectedCurrency.flag} alt={selectedCurrency.name} className="currency-flag" />
                                        <span>{selectedCurrency.code}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="rate-display">
                                {profileData.showRate ? (
                                    <div className="rate-badge">
                                        {selectedCurrency.symbol}{profileData.rate}/hr
                                    </div>
                                ) : (
                                    <span className="rate-hidden">Rate Hidden</span>
                                )}
                            </div>
                        </div>

                        {/* INTRODUCTION */}
                        <div className="intro-block">
                            <span className="detail-label">Introduction</span>
                            <div className="detail-value">
                                <p className="intro-text">{profileData.intro}</p>
                            </div>
                        </div>

                        {/* Experience, Expertise, Resume, Report */}
                        <div className="profile-details-container">
                            <div className="profile-details-column">
                                <div className="detail-item">
                                    <span className="detail-label">Experience</span>
                                    <div className="detail-value">
                                        {profileData.experience}
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Expertise</span>
                                    <div className="detail-value">
                                        {profileData.expertise}
                                    </div>
                                </div>
                            </div>

                            <div className="document-previews-column">
                                {/* Resume Preview */}
                                <div className="document-preview-item">
                                    <div className="preview-upload-row">
                                        <div
                                            className="document-preview-box"
                                            onClick={() => setShowResumeModal(true)}
                                        >
                                            <div className="document-preview-overlay">
                                                <span>Resume Preview</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Assessment Report */}
                                <div className="document-preview-item">
                                    <div className="preview-upload-row">
                                        <div
                                            className="document-preview-box"
                                            onClick={() => setShowReportModal(true)}
                                        >
                                            <div className="document-preview-overlay">
                                                <span>Assessment Report</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Video Section */}
                <div className="video-section">
                    <div className="video-header-section uncollapsed">
                        <div className="section-header">
                            <h3 className="section-title">Videos</h3>
                        </div>
                    </div>

                    {/* Introduction Video */}
                    <div className="video-subsection">
                        {profileData.video ? (
                            <>
                                <div className="subsection-header uncollapsed">
                                    <h4 className="subsection-title">Introduction Video</h4>
                                </div>
                                <div className="video-container">
                                    <div className="dummy-player">
                                        <video
                                            src={profileData.video}
                                            controls
                                            className="video-player"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="placeholder-row">
                                <p><i>No introduction video available.</i></p>
                            </div>
                        )}
                    </div>

                    {/* Interview Video */}
                    <div className="video-subsection">
                        {profileData.interviewVideo ? (
                            <>
                                <div className="subsection-header uncollapsed">
                                    <h4 className="subsection-title">Interview Video</h4>
                                </div>
                                <div className="video-container">
                                    <div className="dummy-player">
                                        <video
                                            src={profileData.interviewVideo}
                                            controls
                                            className="video-player"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="placeholder-row">
                                <p><i>No interview video available.</i></p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Resume Preview Modal */}
                {showResumeModal && (
                    <div className="pdf-modal-overlay">
                        <div className="pdf-modal-container">
                            <div className="pdf-modal-header">
                                <h3>Resume Preview</h3>
                                <button
                                    className="close-modal"
                                    onClick={() => setShowResumeModal(false)}
                                >
                                    &times;
                                </button>
                            </div>
                            <div className="pdf-modal-content">
                                <iframe
                                    src={sampleResume}
                                    width="100%"
                                    height="500px"
                                    style={{ border: 'none' }}
                                    title="Resume Preview"
                                />
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
                                <button
                                    className="close-modal"
                                    onClick={() => setShowReportModal(false)}
                                >
                                    &times;
                                </button>
                            </div>
                            <div className="pdf-modal-content">
                                <iframe
                                    src={sampleReport}
                                    width="100%"
                                    height="500px"
                                    style={{ border: 'none' }}
                                    title="Assessment Report"
                                />
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
            </div>
        </div>
    );
};

const DownloadIcon = () => <span>⭳</span>;

export default CandidateProfile;