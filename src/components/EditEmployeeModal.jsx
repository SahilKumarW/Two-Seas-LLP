// EditEmployeeModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { currencies } from '../pages/AdminDashboard/constants';
import { db, doc, updateDoc } from '../firebase';
import '../pages/AddEmployee/AddEmployee.css';
import defaultProfileImage from "../assets/no image found.png";
import { niches } from '../pages/AdminDashboard/constants';

const EditEmployeeModal = ({ employee, onClose, onUpdated }) => {
    const [formData, setFormData] = useState({
        name: employee.name || '',
        currency: employee.currency || currencies[0].code,
        experience: employee.experience || '',
        expertise: employee.expertise || '',
        intro: employee.intro || '',
        image: employee.imageBase64 || defaultProfileImage,
        interviewVideoLink: employee.interviewVideoLink || '',
        introductionVideoLink: employee.introductionVideoLink || '',
        resume: employee.resume || null,
        assessment: employee.assessment || null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [selectedNiche, setSelectedNiche] = useState(employee.niche || '');
    const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

    // const niches = [
    //     { id: 'niche-0', name: 'Software Development' },
    //     { id: 'niche-1', name: 'Data & Analytics' },
    //     { id: 'niche-2', name: 'Design & Creative' },
    //     { id: 'niche-3', name: 'Marketing' },
    //     { id: 'niche-4', name: 'Writing' },
    //     { id: 'niche-5', name: 'Support' },
    //     { id: 'niche-6', name: 'Administration' },
    //     { id: 'niche-7', name: 'Finance' }
    // ];

    const fileInputRef = useRef(null);
    const currencyDropdownRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 500000) {
            alert('Image must be smaller than 500KB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setFormData({ ...formData, image: event.target.result });
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
            if (!formData.name || !selectedNiche) {
                throw new Error('Please fill in all required fields');
            }

            if (!validateGoogleDriveLink(formData.resumeLink)) {
                throw new Error('Please provide a valid Google Drive link for the resume');
            }

            if (!validateGoogleDriveLink(formData.assessmentLink)) {
                throw new Error('Please provide a valid Google Drive link for the assessment');
            }

            const employeeData = {
                name: formData.name,
                currency: formData.currency,
                experience: formData.experience,
                expertise: formData.expertise,
                intro: formData.intro,
                imageBase64: formData.image,
                niche: selectedNiche,
                interviewVideoLink: formData.interviewVideoLink,
                introductionVideoLink: formData.introductionVideoLink,
                resume: formData.resume,
                assessment: formData.assessment
            };

            await updateDoc(doc(db, "employees", employee.id), employeeData);

            alert('Employee updated successfully!');
            onUpdated();
            onClose();
        } catch (error) {
            console.error('Error updating employee: ', error);
            setSubmitError(error.message || 'Failed to update employee. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCurrencySelect = (currency) => {
        setFormData({ ...formData, currency: currency.code });
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

    const extractYouTubeId = (url) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleFileUpload = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Please upload a PDF file");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setFormData({
                ...formData,
                [type]: {
                    base64: event.target.result,
                    fileName: file.name,
                    uploadedAt: Date.now(),  // or Timestamp.now()
                },
            });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="add-employee-container">
                    <div className="add-employee-header">
                        <div className="header-content">
                            <h1>Edit Talent Profile</h1>
                            <p>Update the profile for {employee.name}</p>
                        </div>
                        <button className="close-modal" onClick={onClose}>×</button>
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
                                        className={`image-upload-container ${formData.image ? 'has-image' : ''}`}
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        {formData.image ? (
                                            <img src={formData.image} alt="Profile" className="profile-image" />
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
                                            <span>{formData.image ? 'Change Photo' : 'Upload Photo'}</span>
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
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="John Doe"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Professional Introduction <span className="required">*</span></label>
                                        <div className="input-with-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM7 7H9V9H7V7ZM7 11H9V13H7V11ZM7 15H9V17H7V15ZM17 17H11V15H17V17ZM17 13H11V11H17V13ZM17 9H11V7H17V9Z" fill="#64748B" />
                                            </svg>
                                            <textarea
                                                name="intro"
                                                value={formData.intro}
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
                                                    value={formData.experience}
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
                                                    value={formData.expertise}
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
                                        value={formData.introductionVideoLink}
                                        onChange={handleInputChange}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                </div>
                                {formData.introductionVideoLink && extractYouTubeId(formData.introductionVideoLink) && (
                                    <div className="video-preview">
                                        <iframe
                                            width="100%"
                                            height="200"
                                            src={`https://www.youtube.com/embed/${extractYouTubeId(formData.introductionVideoLink)}`}
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
                                        value={formData.interviewVideoLink}
                                        onChange={handleInputChange}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                </div>
                                {formData.interviewVideoLink && extractYouTubeId(formData.interviewVideoLink) && (
                                    <div className="video-preview">
                                        <iframe
                                            width="100%"
                                            height="200"
                                            src={`https://www.youtube.com/embed/${extractYouTubeId(formData.interviewVideoLink)}`}
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
                                <label>Upload Resume (PDF)</label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => handleFileUpload(e, "resume")}
                                />
                                {formData.resume && (
                                    <p className="file-hint">Current file: {formData.resume.fileName}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Upload Assessment (PDF)</label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => handleFileUpload(e, "assessment")}
                                />
                                {formData.assessment && (
                                    <p className="file-hint">Current file: {formData.assessment.fileName}</p>
                                )}
                            </div>

                        </div>
                        <div className="form-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="submit-add-employee"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    'Updating...'
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3Z" fill="white" />
                                            <path d="M12 19C10.34 19 9 17.66 9 16C9 14.34 10.34 13 12 13C13.66 13 15 14.34 15 16C15 17.66 13.66 19 12 19Z" fill="#2A2D7C" />
                                            <path d="M12 16C12.552 16 13 15.552 13 15C13 14.448 12.552 14 12 14C11.448 14 11 14.448 11 15C11 15.552 11.448 16 12 16Z" fill="#2A2D7C" />
                                        </svg>
                                        Update Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditEmployeeModal;