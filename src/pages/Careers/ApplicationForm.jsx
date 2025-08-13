import React, { useState } from 'react';
import { FaFileUpload, FaLinkedin, FaCheck, FaTimes, FaVideo, FaCamera } from 'react-icons/fa';

const ApplicationForm = ({ jobTitle, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    video: null,
    photo: null,
    coverLetter: '',
    resume: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  // Color theme variables
  const colors = {
    primary: '#2A2D7C',
    secondary: '#06A3C2',
    accent: '#4CAF50',
    background: '#F9FAFF',
    border: '#E0E3F1',
    textPrimary: '#2A2D7C',
    textSecondary: '#6A6D9E',
    textHint: '#A7AACB',
    success: '#4CAF50',
    error: '#F44336'
  };

  return (
    <div className="application-modal">
      <div className="application-container">
        {/* Header Section */}
        <div className="application-header">
          <button
            className="close-btn"
            onClick={onClose}
            onTouchEnd={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            <FaTimes />
          </button>
          <div className="header-content">
            <h2 className="application-title">
              Apply for <span className="highlight">{jobTitle}</span>
            </h2>
            <p className="application-subtitle">Join our team and start your next adventure</p>
            <div className="header-divider">
              <div className="divider-line"></div>
              <div className="divider-dot"></div>
              <div className="divider-line"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="application-content">
          {isSuccess ? (
            <div className="success-state">
              <div className="success-icon">
                <div className="success-circle">
                  <FaCheck />
                </div>
              </div>
              <h3>Application Submitted</h3>
              <p className="success-message">Thank you for applying to {jobTitle}.</p>
              <p className="success-message">We'll review your application and be in touch soon.</p>
              <button className="return-btn" onClick={onClose}>
                Return to Jobs
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="application-form">
              {/* First Row - Full Name and LinkedIn */}
              <div className="form-row">
                <div className="form-group floating-label half-width">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder=" "
                  />
                  <label htmlFor="name">Full Name*</label>
                </div>

                <div className="form-group floating-label with-icon half-width">
                  <div className="input-container">
                    <FaLinkedin className="input-icon" />
                    <input
                      type="url"
                      name="linkedin"
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder=" "
                    />
                    <label htmlFor="linkedin">LinkedIn Profile</label>
                  </div>
                </div>
              </div>

              {/* Second Row - Email and Phone */}
              <div className="form-row">
                <div className="form-group floating-label half-width">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder=" "
                  />
                  <label htmlFor="email">Email*</label>
                </div>

                <div className="form-group floating-label half-width">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder=" "
                  />
                  <label htmlFor="phone">Phone*</label>
                </div>
              </div>

              {/* Third Row - Video and Photo Upload */}
              <div className="form-row">
                <div className="form-group file-upload half-width">
                  <label className="file-label">Video Introduction</label>
                  <label className="upload-label">
                    <FaVideo className="upload-icon" />
                    <span>{formData.video ? formData.video.name : 'Upload Video (Max 50MB)'}</span>
                    <input
                      type="file"
                      name="video"
                      onChange={handleChange}
                      accept="video/*"
                    />
                  </label>
                  <p className="file-hint">MP4, MOV, or AVI (Max 50MB)</p>
                </div>

                <div className="form-group file-upload half-width">
                  <label className="file-label">Profile Photo</label>
                  <label className="upload-label">
                    <FaCamera className="upload-icon" />
                    <span>{formData.photo ? formData.photo.name : 'Upload Photo (Max 5MB)'}</span>
                    <input
                      type="file"
                      name="photo"
                      onChange={handleChange}
                      accept="image/*"
                    />
                  </label>
                  <p className="file-hint">JPG, PNG (Max 5MB)</p>
                </div>
              </div>

              {/* Resume Upload - Full Width */}
              <div className="form-group file-upload full-width">
                <label className="file-label">RESUME / CV*</label>
                <label className="upload-label">
                  <FaFileUpload className="upload-icon" />
                  <span>{formData.resume ? formData.resume.name : 'Choose File'}</span>
                  <input
                    type="file"
                    name="resume"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx"
                    required
                  />
                </label>
                <p className="file-hint">PDF, DOC, or DOCX (Max 5MB)</p>
              </div>

              {/* Cover Letter - Full Width */}
              <div className="form-group floating-label full-width">
                <label className="file-label">COVER LETTER</label>
                <textarea
                  name="coverLetter"
                  id="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  required
                  placeholder=" "
                ></textarea>
                <div className="char-count">{formData.coverLetter.length}/1000</div>
              </div>

              {/* Form Footer */}
              <div className="form-footer">
                <button type="submit" disabled={isSubmitting} className="submit-btn">
                  {isSubmitting ? (
                    <span className="submit-spinner"></span>
                  ) : (
                    'Submit Application'
                  )}
                </button>
                <p className="disclaimer">
                  By submitting, you agree to our <a href="#">privacy policy</a> and <a href="#">terms</a>.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        .application-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(42, 45, 124, 0.96);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 2rem;
          backdrop-filter: blur(10px);
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .application-container {
          background: white;
          border-radius: 20px;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
          position: relative;
        }

        .application-header {
          padding: 2.5rem 3rem 1.5rem;
          position: relative;
          background: linear-gradient(135deg, ${colors.background} 0%, #f0f3ff 100%);
          border-radius: 20px 20px 0 0;
        }

        .header-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: #fff;
          border: 1px solid ${colors.border};
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: ${colors.primary};
          transition: all 0.3s;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          z-index: 10;
        }

        .close-btn:hover {
          background: #f5f7ff;
          transform: rotate(90deg);
          color: ${colors.secondary};
        }

        .application-title {
          color: ${colors.primary};
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
          line-height: 1.3;
        }

        .application-subtitle {
          color: ${colors.textSecondary};
          font-size: 1rem;
          margin: 0 0 1.5rem;
          font-weight: 500;
        }

        .highlight {
          color: ${colors.secondary};
          font-weight: 700;
        }

        .header-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          width: 200px;
        }

        .divider-line {
          height: 2px;
          background: linear-gradient(to right, transparent, ${colors.secondary}, transparent);
          flex: 1;
        }

        .divider-dot {
          width: 6px;
          height: 6px;
          background: ${colors.secondary};
          border-radius: 50%;
          margin: 0 10px;
        }

        .application-content {
          padding: 2rem 3rem 3rem;
        }

        .form-row {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .half-width {
          width: 50%;
        }

        .full-width {
          width: 100%;
        }

        .form-group {
          position: relative;
        }

        /* Floating Label Styles */
        .floating-label {
          position: relative;
        }

        .floating-label label {
          position: absolute;
          top: 18px;
          left: 20px;
          font-size: 0.9375rem;
          color: ${colors.textSecondary};
          font-weight: 500;
          pointer-events: none;
          transition: all 0.2s ease;
          background: ${colors.background};
          padding: 0 5px;
          border-radius: 4px;
        }

        .with-icon .floating-label label {
          left: 45px;
        }

        .floating-label input,
        .floating-label textarea {
          width: 100%;
          padding: 1.25rem 1.5rem;
          border: 1px solid ${colors.border};
          border-radius: 10px;
          font-size: 0.9375rem;
          transition: all 0.3s;
          background: ${colors.background};
          color: ${colors.textPrimary};
        }

        .with-icon input {
          padding-left: 3.5rem;
        }

        .floating-label input:focus,
        .floating-label textarea:focus,
        .floating-label input:not(:placeholder-shown),
        .floating-label textarea:not(:placeholder-shown) {
          border-color: ${colors.secondary};
          box-shadow: 0 0 0 3px rgba(6, 163, 194, 0.1);
        }

        .floating-label input:focus + label,
        .floating-label textarea:focus + label,
        .floating-label input:not(:placeholder-shown) + label,
        .floating-label textarea:not(:placeholder-shown) + label {
          top: -10px;
          left: 15px;
          font-size: 0.75rem;
          color: ${colors.secondary};
          background: white;
        }

        .with-icon input:focus + label,
        .with-icon input:not(:placeholder-shown) + label {
          left: 40px;
        }

        textarea {
          min-height: 160px;
          resize: vertical;
          margin-top: 0.5rem;
        }

        .char-count {
          text-align: right;
          font-size: 0.75rem;
          color: ${colors.textHint};
          margin-top: 0.25rem;
        }

        .with-icon .input-container {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: ${colors.textSecondary};
          font-size: 1rem;
        }

        .file-upload {
          margin-top: 0.5rem;
        }

        .file-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: ${colors.textPrimary};
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .upload-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border: 1px dashed ${colors.border};
          border-radius: 10px;
          background: ${colors.background};
          cursor: pointer;
          transition: all 0.3s;
        }

        .upload-label:hover {
          border-color: ${colors.secondary};
          background: rgba(6, 163, 194, 0.05);
        }

        .upload-icon {
          color: ${colors.secondary};
          font-size: 1.25rem;
        }

        .upload-label span {
          color: ${colors.textPrimary};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.9375rem;
        }

        .file-upload input[type="file"] {
          display: none;
        }

        .file-hint {
          font-size: 0.75rem;
          color: ${colors.textHint};
          margin-top: 0.5rem;
        }

        .form-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 2rem;
        }

        .submit-btn {
          background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
          color: white;
          border: none;
          padding: 1.125rem 2.5rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%;
          max-width: 300px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(42, 45, 124, 0.3);
        }

        .submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(42, 45, 124, 0.4);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          background: ${colors.border};
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .submit-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .disclaimer {
          font-size: 0.75rem;
          color: ${colors.textHint};
          margin-top: 1.5rem;
          text-align: center;
          max-width: 400px;
          line-height: 1.5;
        }

        .disclaimer a {
          color: ${colors.secondary};
          text-decoration: none;
          transition: all 0.2s;
        }

        .disclaimer a:hover {
          text-decoration: underline;
        }

        /* Success State */
        .success-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem 0 3rem;
        }

        .success-icon {
          margin-bottom: 2rem;
        }

        .success-circle {
          width: 100px;
          height: 100px;
          background: rgba(76, 175, 80, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${colors.accent};
          font-size: 2.5rem;
          animation: scaleIn 0.5s ease-out;
        }

        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .success-state h3 {
          color: ${colors.textPrimary};
          font-size: 1.75rem;
          margin-bottom: 1.5rem;
          font-weight: 700;
        }

        .success-message {
          color: ${colors.textSecondary};
          margin-bottom: 0.75rem;
          line-height: 1.6;
          max-width: 400px;
        }

        .return-btn {
          background: ${colors.secondary};
          color: white;
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 2rem;
          box-shadow: 0 4px 15px rgba(6, 163, 194, 0.3);
        }

        .return-btn:hover {
          background: #0589a3;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(6, 163, 194, 0.4);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .application-container {
            max-height: 95vh;
          }
          
          .application-header, .application-content {
            padding: 1.5rem;
          }
          
          .form-row {
            flex-direction: column;
            gap: 1rem;
          }
          
          .half-width {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .application-modal {
            padding: 1rem;
          }
          
          .application-title {
            font-size: 1.5rem;
          }
          
          .application-subtitle {
            font-size: 0.875rem;
          }
          
          .floating-label input,
          .floating-label textarea {
            padding: 1rem 1.25rem;
          }
          
          .with-icon input {
            padding-left: 3rem;
          }
          
          .input-icon {
            left: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ApplicationForm;