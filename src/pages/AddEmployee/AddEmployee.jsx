import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddEmployee.css';
import { currencies, navItems } from '../AdminDashboard/constants';
import { db, collection, addDoc } from '../../firebase';

const AddEmployee = ({ noPadding, setActiveMenuItem }) => {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState({
        name: '',
        currency: currencies[0].code,
        experience: '',
        expertise: '',
        intro: '',
        image: null,
        interviewVideoLink: '',
        introductionVideoLink: '',
        resumeLink: '', // Changed from resumeFile to resumeLink
        assessmentLink: '' // Changed from assessmentFile to assessmentLink
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [selectedNiche, setSelectedNiche] = useState('');
    const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState(''); // For tracking upload status

    const niches = navItems.map((item, index) => ({
        id: `niche-${index}`,
        name: item
    }));

    const fileInputRef = useRef(null);
    const currencyDropdownRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate image size (max 500KB)
        if (file.size > 500000) {
            alert('Image must be smaller than 500KB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setEmployee({ ...employee, image: event.target.result });
        };
        reader.readAsDataURL(file);
    };

    const validateGoogleDriveLink = (url) => {
        if (!url) return true;
        return url.includes('drive.google.com') || url.includes('docs.google.com');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Validate required fields
            if (!employee.name || !selectedNiche) {
                throw new Error('Please fill in all required fields');
            }

            // Validate Google Drive links
            if (!validateGoogleDriveLink(employee.resumeLink)) {
                throw new Error('Please provide a valid Google Drive link for the resume');
            }

            if (!validateGoogleDriveLink(employee.assessmentLink)) {
                throw new Error('Please provide a valid Google Drive link for the assessment');
            }

            // Prepare employee data
            const employeeData = {
                name: employee.name,
                // rate: parseFloat(employee.rate),
                currency: employee.currency,
                experience: employee.experience,
                expertise: employee.expertise,
                intro: employee.intro,
                imageBase64: employee.image,
                niche: selectedNiche,
                interviewVideoLink: employee.interviewVideoLink,
                introductionVideoLink: employee.introductionVideoLink,
                createdAt: new Date(),
                status: 'active',
                resume: {
                    type: 'google_drive',
                    link: employee.resumeLink,
                    accessedAt: new Date()
                },
                assessment: {
                    type: 'google_drive',
                    link: employee.assessmentLink,
                    accessedAt: new Date()
                }
            };

            // Add to Firestore
            await addDoc(collection(db, "employees"), employeeData);

            alert('Employee added successfully!');
            navigate('/employee-diary');
        } catch (error) {
            console.error('Error adding employee: ', error);
            setSubmitError(error.message || 'Failed to add employee. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCurrencySelect = (currency) => {
        setEmployee({ ...employee, currency: currency.code });
        setShowCurrencyDropdown(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (currencyDropdownRef.current &&
                !currencyDropdownRef.current.contains(event.target)) {
                setShowCurrencyDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Function to extract YouTube video ID from URL
    const extractYouTubeId = (url) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <div className={`add-employee-page ${noPadding ? "no-padding" : ""}`}>
            <div className="add-employee-container">
                <div className="add-employee-header">
                    <div className="header-content">
                        <h1>Onboard New Talent</h1>
                        <p>Create a comprehensive profile to showcase this professional</p>
                    </div>
                    <div className="header-accent"></div>
                </div>

                <form onSubmit={handleSubmit} className="add-employee-form">
                    <div className="form-card">
                        <div className="card-header">
                            <div className="form-card-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#2A2D7C" />
                                </svg>
                            </div>
                            <h2>Basic Information</h2>
                        </div>

                        <div className="employee-profile-section">
                            <div className="profile-image-upload">
                                <div
                                    className={`image-upload-container ${employee.image ? 'has-image' : ''}`}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    {employee.image ? (
                                        <img src={employee.image} alt="Profile" className="profile-image" />
                                    ) : (
                                        <div className="upload-placeholder">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 5H17V12H19V5C19 3.897 18.103 3 17 3H4C2.897 3 2 3.897 2 5V17C2 18.103 2.897 19 4 19H12V17H4V5Z" fill="#2A2D7C" fillOpacity="0.2" />
                                                <path d="M8 11L5 15H16L12 9L9 13L8 11Z" fill="#2A2D7C" fillOpacity="0.4" />
                                                <path d="M19 14H17V17H14V19H17V22H19V19H22V17H19V14Z" fill="#06a3c2" />
                                            </svg>
                                            <span>Upload Profile Photo</span>
                                        </div>
                                    )}
                                    <div className="image-upload-overlay">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 5H17V12H19V5C19 3.897 18.103 3 17 3H4C2.897 3 2 3.897 2 5V17C2 18.103 2.897 19 4 19H12V17H4V5Z" fill="white" />
                                            <path d="M8 11L5 15H16L12 9L9 13L8 11Z" fill="white" />
                                            <path d="M19 14H17V17H14V19H17V22H19V19H22V17H19V14Z" fill="white" />
                                        </svg>
                                        <span>{employee.image ? 'Change Photo' : 'Upload Photo'}</span>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                    />
                                </div>
                                <p className="image-upload-hint">Max 500KB, high resolution recommended (500x500px)</p>
                            </div>

                            <div className="profile-details">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Full Name <span className="required">*</span></label>
                                        <div className="input-with-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#64748B" />
                                            </svg>
                                            <input
                                                type="text"
                                                name="name"
                                                value={employee.name}
                                                onChange={handleInputChange}
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* <div className="form-group">
                                        <label>Hourly Rate <span className="required">*</span></label>
                                        <div className="rate-input-container">
                                            <div className="currency-selector" ref={currencyDropdownRef}>
                                                <button
                                                    type="button"
                                                    className="currency-btn"
                                                    onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                                                >
                                                    <img
                                                        src={currencies.find(c => c.code === employee.currency)?.flag}
                                                        alt="Currency"
                                                        className="currency-flag"
                                                    />
                                                    {employee.currency}
                                                    <span className="dropdown-arrow">▼</span>
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
                                            <div className="input-with-icon">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#64748B" />
                                                    <path d="M12.31 11.14C11.71 10.87 11.35 10.71 11.35 10.18C11.35 9.77 11.68 9.42 12.14 9.42C12.62 9.42 12.94 9.79 12.96 10.28H14.64C14.62 9.33 13.88 8.5 12.66 8.5C11.41 8.5 10.67 9.36 10.67 10.22C10.67 11.32 11.49 11.68 12.43 12.03C12.78 12.17 13.12 12.31 13.45 12.5C13.76 12.67 13.97 12.99 13.97 13.44C13.97 14.13 13.38 14.6 12.66 14.6C11.83 14.6 11.3 14.08 11.28 13.44H9.6C9.62 14.83 10.77 15.8 12.66 15.8C14.55 15.8 15.65 14.77 15.65 13.42C15.65 12.18 14.8 11.68 13.66 11.19C13.17 10.97 12.68 10.75 12.31 10.57V11.14Z" fill="#64748B" />
                                                </svg>
                                                <input
                                                    type="number"
                                                    name="rate"
                                                    value={employee.rate}
                                                    onChange={handleInputChange}
                                                    placeholder="0.00"
                                                    required
                                                />
                                                <span className="rate-suffix">/hr</span>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>

                                <div className="form-group">
                                    <label>Professional Introduction <span className="required">*</span></label>
                                    <div className="input-with-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM7 7H9V9H7V7ZM7 11H9V13H7V11ZM7 15H9V17H7V15ZM17 17H11V15H17V17ZM17 13H11V11H17V13ZM17 9H11V7H17V9Z" fill="#64748B" />
                                        </svg>
                                        <textarea
                                            name="intro"
                                            value={employee.intro}
                                            onChange={handleInputChange}
                                            placeholder="A brief professional introduction highlighting key skills and experience..."
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Years of Experience <span className="required">*</span></label>
                                        <div className="input-with-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#64748B" />
                                                <path d="M12 6V12L16.14 14.5L17 13.07L13.5 11V6H12Z" fill="#64748B" />
                                            </svg>
                                            <input
                                                type="text"
                                                name="experience"
                                                value={employee.experience}
                                                onChange={handleInputChange}
                                                placeholder="e.g. 5 years"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Area of Expertise <span className="required">*</span></label>
                                        <div className="input-with-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM12 4.47L18 6.7V11.09C18 15.28 15.33 19.29 12 20.55C8.67 19.29 6 15.28 6 11.09V6.7L12 4.47Z" fill="#64748B" />
                                                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="#64748B" />
                                            </svg>
                                            <input
                                                type="text"
                                                name="expertise"
                                                value={employee.expertise}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Technical Recruitment"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-card">
                        <div className="card-header">
                            <div className="form-card-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 3H20C21.1 3 22 3.9 22 5V19C22 20.1 21.1 21 20 21H4C2.9 21 2 20.1 2 19V5C2 3.9 3 3 4 3H7C7 1.34 8.34 0 10 0C11.66 0 13 1.34 13 3H17ZM10 2C9.45 2 9 2.45 9 3C9 3.55 9.45 4 10 4C10.55 4 11 3.55 11 3C11 2.45 10.55 2 10 2Z" fill="#2A2D7C" />
                                </svg>
                            </div>
                            <h2>Niche Assignment</h2>
                        </div>

                        <div className="form-group">
                            <label>Select Primary Niche <span className="required">*</span></label>
                            <div className="niche-select-container">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 3H20C21.1 3 22 3.9 22 5V19C22 20.1 21.1 21 20 21H4C2.9 21 2 20.1 2 19V5C2 3.9 3 3 4 3H7C7 1.34 8.34 0 10 0C11.66 0 13 1.34 13 3H17ZM10 2C9.45 2 9 2.45 9 3C9 3.55 9.45 4 10 4C10.55 4 11 3.55 11 3C11 2.45 10.55 2 10 2Z" fill="#64748B" />
                                </svg>
                                <select
                                    value={selectedNiche}
                                    onChange={(e) => setSelectedNiche(e.target.value)}
                                    required
                                >
                                    <option value="">Select a niche category</option>
                                    {niches.map(niche => (
                                        <option key={niche.id} value={niche.id}>{niche.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-card">
                        <div className="card-header">
                            <div className="form-card-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 10.5V7C17 5.9 16.1 5 15 5H5C3.9 5 3 5.9 3 7V17C3 18.1 3.9 19 5 19H15C16.1 19 17 18.1 17 17V13.5L21 17.5V6.5L17 10.5Z" fill="#2A2D7C" />
                                </svg>
                            </div>
                            <h2>Video Links</h2>
                        </div>

                        <div className="form-group">
                            <label>Introduction Video (YouTube Link)</label>
                            <div className="input-with-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 16.5L16 12L10 7.5V16.5ZM21 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3ZM21 19H3V5H21V19Z" fill="#64748B" />
                                </svg>
                                <input
                                    type="url"
                                    name="introductionVideoLink"
                                    value={employee.introductionVideoLink}
                                    onChange={handleInputChange}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                            </div>
                            {employee.introductionVideoLink && extractYouTubeId(employee.introductionVideoLink) && (
                                <div className="video-preview">
                                    <iframe
                                        width="100%"
                                        height="200"
                                        src={`https://www.youtube.com/embed/${extractYouTubeId(employee.introductionVideoLink)}`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="Introduction video preview"
                                    ></iframe>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Interview Video (YouTube Link)</label>
                            <div className="input-with-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 16.5L16 12L10 7.5V16.5ZM21 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3ZM21 19H3V5H21V19Z" fill="#64748B" />
                                </svg>
                                <input
                                    type="url"
                                    name="interviewVideoLink"
                                    value={employee.interviewVideoLink}
                                    onChange={handleInputChange}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                            </div>
                            {employee.interviewVideoLink && extractYouTubeId(employee.interviewVideoLink) && (
                                <div className="video-preview">
                                    <iframe
                                        width="100%"
                                        height="200"
                                        src={`https://www.youtube.com/embed/${extractYouTubeId(employee.interviewVideoLink)}`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="Interview video preview"
                                    ></iframe>
                                </div>
                            )}
                        </div>
                    </div>

                    {submitError && (
                        <div className="form-error">
                            {submitError}
                        </div>
                    )}

                    {/* Add this new form card for file uploads */}
                    {/* Updated Documents form card */}
                    <div className="form-card">
                        <div className="card-header">
                            <div className="form-card-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#2A2D7C" />
                                    <path d="M16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="#2A2D7C" />
                                </svg>
                            </div>
                            <h2>Documents</h2>
                        </div>

                        <div className="form-group">
                            <label>Resume (Google Drive Link)</label>
                            <div className="input-with-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#64748B" />
                                    <path d="M16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="#64748B" />
                                </svg>
                                <input
                                    type="url"
                                    name="resumeLink"
                                    value={employee.resumeLink}
                                    onChange={handleInputChange}
                                    placeholder="https://drive.google.com/..."
                                />
                            </div>
                            <p className="file-hint">Paste the shareable Google Drive link</p>
                        </div>

                        <div className="form-group">
                            <label>Assessment Report (Google Drive Link)</label>
                            <div className="input-with-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#64748B" />
                                    <path d="M16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="#64748B" />
                                </svg>
                                <input
                                    type="url"
                                    name="assessmentLink"
                                    value={employee.assessmentLink}
                                    onChange={handleInputChange}
                                    placeholder="https://drive.google.com/..."
                                />
                            </div>
                            <p className="file-hint">Paste the shareable Google Drive link</p>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate('/admin-dashboard')}
                            disabled={isSubmitting}
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            className="submit-add-employee"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                'Uploading...'
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3Z" fill="white" />
                                        <path d="M12 19C10.34 19 9 17.66 9 16C9 14.34 10.34 13 12 13C13.66 13 15 14.34 15 16C15 17.66 13.66 19 12 19Z" fill="#2A2D7C" />
                                        <path d="M12 16C12.552 16 13 15.552 13 15C13 14.448 12.552 14 12 14C11.448 14 11 14.448 11 15C11 15.552 11.448 16 12 16Z" fill="#2A2D7C" />
                                    </svg>
                                    Complete Onboarding
                                </>
                            )}
                        </button>
                    </div>
                </form>
                {/* Add this section to show upload status */}
                {uploadStatus && (
                    <div className="upload-status">
                        <div className="status-message">{uploadStatus}</div>
                        {uploadProgress > 0 && (
                            <div className="progress-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                                <span>{Math.round(uploadProgress)}%</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddEmployee;