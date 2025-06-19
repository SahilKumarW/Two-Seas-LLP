import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiX, FiLink, FiBriefcase, FiMapPin, FiClock, FiList, FiAward, FiDollarSign } from 'react-icons/fi';
import './AddNewOpening.css';

const AddNewOpening = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    position: '',
    mode: 'Remote',
    location: '',
    employmentType: 'Full Time',
    overview: '',
    responsibilities: [''],
    qualifications: [''],
    benefits: [''],
    linkedinUrl: '',
    indeedUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleListChange = (listName, index, value) => {
    setFormData(prev => {
      const newList = [...prev[listName]];
      newList[index] = value;
      return { ...prev, [listName]: newList };
    });
  };

  const addListItem = (listName) => {
    setFormData(prev => ({ ...prev, [listName]: [...prev[listName], ''] }));
  };

  const removeListItem = (listName, index) => {
    if (formData[listName].length > 1) {
      setFormData(prev => ({
        ...prev,
        [listName]: prev[listName].filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Job opening submitted successfully!');
    navigate('/');
  };

  return (
    <div className="add-opening-container">
      <div className="form-card">
        <div className="form-header">
          <div className="header-accent"></div>
          <h1>Create New Job Opening</h1>
          <p className="subtitle">Fill in the details to post a new position</p>
        </div>

        <form onSubmit={handleSubmit} className="job-opening-form">
          {/* Basic Information Section */}
          <div className="form-section">
            <div className="section-header">
              {/* <div className="section-icon-container">
                <FiBriefcase className="section-icon" />
              </div> */}
              <h2>Position Details</h2>
            </div>
            
            <div className="form-grid">
              <div className="input-group">
                <label>Job Title*</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    placeholder="Senior Frontend Developer"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Work Mode*</label>
                <div className="select-with-icon">
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>Location*</label>
                <div className="input-with-icon">
                  <FiMapPin className="input-icon" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="New York, NY or Remote"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Employment Type*</label>
                <div className="select-with-icon">
                  <FiClock className="input-icon" />
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Position Overview */}
          <div className="form-section">
            <div className="section-header">
              {/* <div className="section-icon-container">
                <FiList className="section-icon" />
              </div> */}
              <h2>Position Overview</h2>
            </div>
            <div className="input-group">
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                required
                placeholder="Describe the role and its importance in the company..."
                rows={5}
                className="input-field"
              />
            </div>
          </div>

          {/* Key Responsibilities */}
          <div className="form-section">
            <div className="section-header">
              {/* <div className="section-icon-container">
                <FiList className="section-icon" />
              </div> */}
              <h2>Key Responsibilities</h2>
            </div>
            {formData.responsibilities.map((item, index) => (
              <div key={index} className="list-item-group">
                <div className="list-item-input">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleListChange('responsibilities', index, e.target.value)}
                    placeholder="Describe a key responsibility..."
                    required
                    className="input-field"
                  />
                  {formData.responsibilities.length > 1 && (
                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => removeListItem('responsibilities', index)}
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              className="add-item-btn"
              onClick={() => addListItem('responsibilities')}
            >
              <FiPlus /> Add Responsibility
            </button>
          </div>

          {/* Qualifications */}
          <div className="form-section">
            <div className="section-header">
              {/* <div className="section-icon-container">
                <FiAward className="section-icon" />
              </div> */}
              <h2>Qualifications</h2>
            </div>
            {formData.qualifications.map((item, index) => (
              <div key={index} className="list-item-group">
                <div className="list-item-input">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleListChange('qualifications', index, e.target.value)}
                    placeholder="List a required qualification..."
                    required
                    className="input-field"
                  />
                  {formData.qualifications.length > 1 && (
                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => removeListItem('qualifications', index)}
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              className="add-item-btn"
              onClick={() => addListItem('qualifications')}
            >
              <FiPlus /> Add Qualification
            </button>
          </div>

          {/* What We Offer */}
          <div className="form-section">
            <div className="section-header">
              {/* <div className="section-icon-container">
                <FiDollarSign className="section-icon" />
              </div> */}
              <h2>What We Offer</h2>
            </div>
            {formData.benefits.map((item, index) => (
              <div key={index} className="list-item-group">
                <div className="list-item-input">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleListChange('benefits', index, e.target.value)}
                    placeholder="Describe a benefit or perk..."
                    className="input-field"
                  />
                  {formData.benefits.length > 1 && (
                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => removeListItem('benefits', index)}
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              className="add-item-btn"
              onClick={() => addListItem('benefits')}
            >
              <FiPlus /> Add Benefit
            </button>
          </div>

          {/* Job Posting URLs */}
          <div className="form-section">
            <div className="section-header">
              {/* <div className="section-icon-container">
                <FiLink className="section-icon" />
              </div> */}
              <h2>Job Posting URLs</h2>
            </div>
            <div className="form-grid">
              <div className="input-group">
                <label>LinkedIn URL</label>
                <div className="input-with-icon">
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/jobs/view/..."
                    className="input-field"
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Indeed URL</label>
                <div className="input-with-icon">
                  <input
                    type="url"
                    name="indeedUrl"
                    value={formData.indeedUrl}
                    onChange={handleChange}
                    placeholder="https://indeed.com/job/..."
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="post-job">
              Create Job Opening
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewOpening;