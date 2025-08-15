import React, { useState, useRef, useEffect } from 'react';
import { FaFileUpload, FaLinkedin, FaCheck, FaTimes, FaVideo, FaCamera, FaMicrophone, FaUpload, FaStop } from 'react-icons/fa';
import ConfirmDialog from '../../components/ConfirmDialog';

const VideoRecorderOverlay = ({ onComplete, onClose }) => {
  const [countdown, setCountdown] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const MAX_RECORDING_TIME = 90; // 90 seconds maximum

  const startCountdown = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCountdown(5); // Start with 3 second countdown
    } catch (err) {
      console.error("Error accessing camera:", err);
      onClose();
      alert("Could not access camera. Please check permissions.");
    }
  };

  const startRecording = () => {
    if (!streamRef.current) {
      console.error("No stream available to record");
      return;
    }

    try {
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm'
      });

      const chunks = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        onComplete(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer to track recording duration
      timerRef.current = setInterval(() => {
        setRecordingTime(prevTime => {
          if (prevTime >= MAX_RECORDING_TIME) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return prevTime + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error starting recording:", err);
      onClose();
      alert("Failed to start recording. Please try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      clearInterval(timerRef.current);
      mediaRecorderRef.current.stop();
      cleanup();
    }
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    setCountdown(null);
    setRecordingTime(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (countdown === 0) {
      startRecording();
    } else if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    startCountdown();
    return cleanup;
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="recorder-overlay">
      <div className="recorder-container">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <video ref={videoRef} muted className="camera-preview" />

        {countdown !== null && countdown > 0 ? (
          <div className="countdown">
            <div className="countdown-number">{countdown}</div>
            <div className="countdown-text">Recording starts in...</div>
          </div>
        ) : null}

        {isRecording && (
          <div className="recording-info">
            <div className="recording-indicator">
              <div className="recording-dot"></div>
              <span>REC</span>
            </div>
            <div className="recording-timer">{formatTime(recordingTime)} / {formatTime(MAX_RECORDING_TIME)}</div>
          </div>
        )}

        {isRecording && (
          <div className="controls">
            <button className="stop-btn" onClick={stopRecording}>
              <FaStop /> Stop Recording
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .recorder-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .recorder-container {
          position: relative;
          width: 90%;
          max-width: 800px;
          background: #111;
          border-radius: 10px;
          overflow: hidden;
        }
        
        .close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s;
        }
        
        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .camera-preview {
          width: 100%;
          max-height: 70vh;
          display: block;
          background: #000;
        }
        
        .countdown {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: white;
        }
        
        .countdown-number {
          font-size: 72px;
          font-weight: bold;
          color: #ff4757;
          text-shadow: 0 0 10px rgba(255, 71, 87, 0.7);
        }
        
        .countdown-text {
          font-size: 18px;
          margin-top: 10px;
        }
        
        .recording-info {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .recording-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 0, 0, 0.3);
          padding: 5px 10px;
          border-radius: 4px;
          color: white;
          font-weight: bold;
        }
        
        .recording-dot {
          width: 10px;
          height: 10px;
          background: #ff4757;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
        
        .recording-timer {
          color: white;
          font-weight: bold;
          background: rgba(0, 0, 0, 0.5);
          padding: 5px 10px;
          border-radius: 4px;
        }
        
        .controls {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
        }
        
        .stop-btn {
          background: #ff4757;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          transition: all 0.2s;
        }
        
        .stop-btn:hover {
          background: #ff6b81;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

const ApplicationForm = ({ jobTitle, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    video: null,
    videoBlob: null,
    photo: null,
    coverLetter: '',
    resume: null,
    videoSource: 'upload'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCamera, setShowCamera] = useState(false);
  const [recordAttempts, setRecordAttempts] = useState(0); // Tracks recording count
  const [showConfirmReRecord, setShowConfirmReRecord] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleVideoSourceChange = (source) => {
    setFormData(prev => ({ ...prev, videoSource: source }));
    setErrors(prev => ({ ...prev, video: '' }));
  };

  const handleRecordingComplete = (blob) => {
    setFormData(prev => ({
      ...prev,
      videoBlob: blob,
      video: new File([blob], 'recorded-video.webm', { type: 'video/webm' })
    }));
    setShowCamera(false);
  };

  // Re-record click handler
  const handleReRecord = () => {
    if (recordAttempts >= 3) return; // limit reached
    setShowConfirmReRecord(true); // open our styled dialog
  };

  const confirmReRecordAction = () => {
    setFormData(prev => ({ ...prev, videoBlob: null, video: null }));
    setShowCamera(true);
    setRecordAttempts(prev => prev + 1);
    setShowConfirmReRecord(false);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    }
    if (formData.videoSource === 'upload' && !formData.video) {
      newErrors.video = 'Video introduction is required';
      isValid = false;
    }
    if (formData.videoSource === 'record' && !formData.videoBlob) {
      newErrors.video = 'Please record a video introduction';
      isValid = false;
    }
    if (!formData.photo) {
      newErrors.photo = 'Profile photo is required';
      isValid = false;
    }
    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Handle validation errors
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData object
      const formDataToSend = new FormData();

      // Append all form fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('linkedin', formData.linkedin);
      formDataToSend.append('coverLetter', formData.coverLetter);

      // Append files
      if (formData.video) {
        formDataToSend.append('video', formData.video);
      }
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }
      if (formData.resume) {
        formDataToSend.append('resume', formData.resume);
      }

      // Send to your backend API
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        body: formDataToSend,
        // Don't set Content-Type header - browser will set it automatically
        // with the correct boundary for multipart/form-data
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setIsSuccess(true);

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
                <div className={`form-group floating-label half-width ${errors.name ? 'has-error' : ''}`}>
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
                  {errors.name && <span className="error-message">{errors.name}</span>}
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
                <div className={`form-group floating-label half-width ${errors.email ? 'has-error' : ''}`}>
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
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className={`form-group floating-label half-width ${errors.phone ? 'has-error' : ''}`}>
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
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>

              {/* Video Introduction Section */}
              <div className="form-group">
                <label className="file-label">Video Introduction*</label>

                {/* Toggle between upload or record */}
                <div className="video-source-toggle">
                  <button
                    type="button"
                    className={`toggle-option ${formData.videoSource === 'upload' ? 'active' : ''}`}
                    onClick={() => handleVideoSourceChange('upload')}
                  >
                    Upload Video
                  </button>
                  <span className="toggle-separator">OR</span>
                  <button
                    type="button"
                    className={`toggle-option ${formData.videoSource === 'record' ? 'active' : ''}`}
                    onClick={() => handleVideoSourceChange('record')}
                  >
                    Record Video (Upto 90s)
                  </button>
                </div>

                {/* Upload mode */}
                {formData.videoSource === 'upload' && (
                  <div className={`file-upload ${errors.video ? 'has-error' : ''}`}>
                    <label className="upload-label">
                      <span className="upload-content">
                        <FaVideo className="upload-icon" />
                        {formData.video ? formData.video.name : 'Upload Video (Max 50MB)'}
                      </span>
                      <input
                        type="file"
                        name="video"
                        onChange={handleChange}
                        accept="video/*"
                      />
                    </label>
                    {errors.video && <span className="error-message">{errors.video}</span>}
                    <p className="file-hint">MP4, MOV, or AVI (Max 50MB)</p>
                  </div>
                )}

                {/* Record mode */}
                {formData.videoSource === 'record' && (
                  <div className={`video-recorder ${errors.video ? 'has-error' : ''}`}>

                    {/* If no recording yet */}
                    {!formData.videoBlob && !formData.video && (
                      <button
                        type="button"
                        className="start-recording-btn"
                        onClick={() => setShowCamera(true)}
                      >
                        <FaMicrophone /> Start Recording
                      </button>
                    )}

                    {/* Actions before saving */}
                    {formData.videoBlob && !formData.video && (
                      <div className="video-actions">
                        <button
                          type="button"
                          className="re-record-btn"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, videoBlob: null, video: null }));
                            setShowCamera(true);
                          }}
                        >
                          <FaMicrophone /> Re-record
                        </button>
                        <button
                          type="button"
                          className="upload-recorded-btn"
                          onClick={() => {
                            const extension = formData.videoBlob.type.split("/")[1] || "mp4";
                            const videoFile = new File(
                              [formData.videoBlob],
                              `recorded-video.${extension}`,
                              {
                                type: formData.videoBlob.type,
                                lastModified: Date.now()
                              }
                            );
                            setFormData(prev => ({ ...prev, video: videoFile }));
                            alert("Video Saved!");
                          }}
                        >
                          <FaUpload /> Use This Video
                        </button>
                      </div>
                    )}

                    {/* Show file name after saving + always show Re-record */}
                    {formData.video && (
                      <div className="video-saved-inline">
                        <span className="recorded-video-name">
                          <FaVideo /> {formData.video.name}
                        </span>
                        <button
                          type="button"
                          className="re-record-btn-small"
                          onClick={handleReRecord} // now opens ConfirmDialog
                          disabled={recordAttempts >= 3}
                        >
                          Re-record
                        </button>
                        {recordAttempts >= 3 && (
                          <small className="attempts-limit-msg">(Max re-records reached)</small>
                        )}

                        {/* Custom confirmation dialog */}
                        <ConfirmDialog
                          open={showConfirmReRecord}
                          message="You've just done fine with your previous video 😊. We'll ask you for a new video if required. Do you still wish to record a new video?"
                          onConfirm={confirmReRecordAction}
                          onCancel={() => setShowConfirmReRecord(false)}
                        />
                      </div>
                    )}

                    {errors.video && <span className="error-message">{errors.video}</span>}
                  </div>
                )}
              </div>

              {/* Profile Photo Upload */}
              <div className={`form-group file-upload ${errors.photo ? 'has-error' : ''}`}>
                <label className="file-label">Profile Photo*</label>
                <label className="upload-label">
                  <span className="upload-content">
                    <FaCamera className="upload-icon" />
                    {formData.photo ? formData.photo.name : 'Upload Photo (Max 5MB)'}
                  </span>
                  <input
                    type="file"
                    name="photo"
                    onChange={handleChange}
                    accept="image/*"
                  />
                </label>
                {errors.photo && <span className="error-message">{errors.photo}</span>}
                <p className="file-hint">JPG, PNG (Max 5MB)</p>
              </div>

              {/* Resume Upload */}
              <div className={`form-group file-upload ${errors.resume ? 'has-error' : ''}`}>
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
                {errors.resume && <span className="error-message">{errors.resume}</span>}
                <p className="file-hint">PDF, DOC, or DOCX (Max 5MB)</p>
              </div>

              {/* Cover Letter */}
              <div className="form-group floating-label">
                <label className="file-label">COVER LETTER</label>
                <textarea
                  name="coverLetter"
                  id="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  placeholder=" "
                ></textarea>
                <div className="char-count">{formData.coverLetter.length}/1000</div>
              </div>

              {showCamera && (
                <VideoRecorderOverlay
                  onComplete={handleRecordingComplete}
                  onClose={() => setShowCamera(false)}
                />
              )}

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
      .recorded-video-name {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
}

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

        .video-saved-inline {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.recorded-video-name {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

/* Small inline button */
.re-record-btn-small {
  padding: 3px 8px;
  font-size: 12px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.re-record-btn-small:hover {
  background-color: red;
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
          margin-bottom: 1.5rem;
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

        /* Video Source Toggle */
        .video-source-toggle {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .toggle-option {
          flex: 1;
          padding: 10px 15px;
          border: 1px solid ${colors.border};
          background: white;
          color: ${colors.textSecondary};
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .toggle-option.active {
          background: ${colors.primary};
          color: white;
          border-color: ${colors.primary};
        }

        /* Video Recorder */
        .video-recorder {
          margin-top: 10px;
        }

        .video-preview-container {
          width: 100%;
          background: #000;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 15px;
        }

        .video-preview {
          width: 100%;
          max-height: 300px;
          display: block;
          background: #222;
        }

        .recorder-controls {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .record-btn, .stop-btn, .retry-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .record-btn {
          background: ${colors.error};
          color: white;
        }

        .stop-btn {
          background: ${colors.error};
          color: white;
        }

        .retry-btn {
          background: ${colors.secondary};
          color: white;
        }

        .record-btn:hover, .stop-btn:hover, .retry-btn:hover {
          opacity: 0.9;
        }

        /* Form Footer */
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

        /* Error States */
        .has-error input,
        .has-error textarea,
        .has-error .upload-label,
        .has-error .video-preview-container {
          border-color: ${colors.error} !important;
          background-color: rgba(244, 67, 54, 0.05) !important;
        }
        
        .error-message {
          color: ${colors.error};
          font-size: 0.75rem;
          margin-top: 0.25rem;
          display: block;
        }
        
        .has-error label {
          color: ${colors.error} !important;
        }
        
        .has-error .file-label {
          color: ${colors.error} !important;
        }
        
        .has-error .upload-icon {
          color: ${colors.error} !important;
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

          .video-source-toggle {
            flex-direction: column;
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

         .video-source-toggle {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
  }

  .toggle-option {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid ${colors.border};
    background: white;
    color: ${colors.textSecondary};
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: center;
  }

  .toggle-option.active {
    background: ${colors.primary};
    color: white;
    border-color: ${colors.primary};
  }

  .toggle-separator {
    color: ${colors.textSecondary};
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0 5px;
  }

  /* Responsive adjustments */
  @media (max-width: 480px) {
    .video-source-toggle {
      flex-direction: column;
      gap: 8px;
    }
    
    .toggle-separator {
      padding: 5px 0;
    }
  }

  /* Toggle container */
.video-source-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.toggle-option {
  padding: 10px 18px;
  border-radius: 6px;
  border: 2px solid #ccc;
  background-color: #f8f8f8;
  color: #444;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.toggle-option:hover {
  background-color: #f0f0f0;
  border-color: #999;
}



/* Separator */
.toggle-separator {
  font-size: 14px;
  font-weight: 500;
  color: #777;
}

/* Action buttons under preview */
.video-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.re-record-btn,
.upload-recorded-btn,
.start-recording-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.25s ease, transform 0.2s ease;
}

/* Button colors */
.re-record-btn {
  background-color: red;
  color: white;
}

.re-record-btn:hover {
  background-color: red;
}

.upload-recorded-btn {
  background-color: #2a2d7c;
  color: white;
}

.upload-recorded-btn:hover {
  background-color: #43a047;
}

.start-recording-btn {
  background-color: #2196F3;
  color: white;
}

.start-recording-btn:hover {
  background-color: #1976D2;
}

/* Subtle hover lift */
.re-record-btn:hover,
.upload-recorded-btn:hover,
.start-recording-btn:hover {
  transform: translateY(-1px);
}
  .attempts-limit-msg {
  font-size: 12px;
  color: #d32f2f;
}

      `}</style>
    </div>
  );
};

export default ApplicationForm;