import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaUserTie, FaBriefcase, FaStar, FaLinkedin } from 'react-icons/fa';
import { FiGithub } from 'react-icons/fi';
import './EmployeeCard.css';

const EmployeeCard = () => {
  const defaultProfileImage = 'https://randomuser.me/api/portraits/lego/5.jpg'; // Default image if none provided

  // Enhanced employee data with all admin state properties
  const employees = [
    {
      id: 1,
      name: 'Ali Khan',
      rate: 75,
      currency: 'USD',
      experience: '8 years',
      expertise: 'Full-stack Development',
      intro: 'Full-stack developer specializing in scalable cloud applications with 8+ years of industry experience.',
      position: 'Senior Software Engineer',
      skills: ['React', 'Node.js', 'AWS', 'TypeScript'],
      contact: {
        phone: '+92 300 1234567',
        email: 'ali.khan@techsolutions.pk',
        linkedin: 'alikhan-dev',
        github: 'alikhan-code'
      },
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
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
    },
    {
      id: 2,
      name: 'Fatima Ahmed',
      rate: 65,
      currency: 'USD',
      experience: '5 years',
      expertise: 'UX/UI Design',
      intro: 'Award-winning designer passionate about creating intuitive user experiences with a human-centered approach.',
      position: 'Lead UX/UI Designer',
      skills: ['Figma', 'User Research', 'Prototyping', 'Adobe Suite'],
      contact: {
        phone: '+92 321 7654321',
        email: 'fatima.ahmed@creative.pk',
        linkedin: 'fatimaui',
        github: 'fatimadesigns'
      },
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
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
    },
    {
      id: 3,
      name: 'Usman Malik',
      rate: 80,
      currency: 'USD',
      experience: '6 years',
      expertise: 'DevOps Engineering',
      intro: 'DevOps specialist focused on building robust infrastructure and automation pipelines.',
      position: 'DevOps Architect',
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
      contact: {
        phone: '+92 345 6789012',
        email: 'usman.malik@cloudops.pk',
        linkedin: 'usman-devops',
        github: 'usmaniac'
      },
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
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
          collapsed: true
        }
      }
    },
    {
      id: 4,
      name: 'Ayesha Raza',
      rate: 70,
      currency: 'USD',
      experience: '4 years',
      expertise: 'Data Science',
      intro: 'Data scientist with expertise in predictive modeling and natural language processing applications.',
      position: 'Data Science Lead',
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'Big Data'],
      contact: {
        phone: '+92 333 4567890',
        email: 'ayesha.raza@datascience.pk',
        linkedin: 'ayesha-ds',
        github: 'raza-ai'
      },
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
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
    }
  ];

  const handleContact = (method, value) => {
    if (method === 'phone') {
      window.open(`tel:${value}`);
    } else if (method === 'email') {
      window.open(`mailto:${value}`);
    } else if (method === 'linkedin') {
      window.open(`https://linkedin.com/in/${value}`, '_blank');
    } else if (method === 'github') {
      window.open(`https://github.com/${value}`, '_blank');
    }
  };

  const renderVideoSection = (employee) => {
    if (!employee.showVideoSection) return null;

    return (
      <div className="video-sections">
        {employee.showIntroVideo && !employee.videoVisibility.introduction.hidden && (
          <div className={`video-section ${employee.videoVisibility.introduction.collapsed ? 'collapsed' : ''}`}>
            <h4 className="section-label">
              <FaUserTie className="icon" /> Introduction Video
            </h4>
            {employee.video ? (
              <div className="video-container">
                {/* Video player would go here */}
                <p>[Introduction Video Player]</p>
              </div>
            ) : (
              <p className="no-video">No introduction video available</p>
            )}
          </div>
        )}
        
        {employee.showInterviewVideo && !employee.videoVisibility.interview.hidden && (
          <div className={`video-section ${employee.videoVisibility.interview.collapsed ? 'collapsed' : ''}`}>
            <h4 className="section-label">
              <FaBriefcase className="icon" /> Interview Video
            </h4>
            {employee.interviewVideo ? (
              <div className="video-container">
                {/* Video player would go here */}
                <p>[Interview Video Player]</p>
              </div>
            ) : (
              <p className="no-video">No interview video available</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="employee-portal">
      <header className="portal-header">
        <h1 className="portal-title">Team Directory</h1>
        <p className="portal-subtitle">Meet our talented professionals</p>
      </header>

      <div className="employee-grid">
        {employees.map(employee => (
          <div key={employee.id} className="employee-card">
            <div className="card-gradient-border">
              <div className="card-content">
                <div className="employee-profile">
                  <div className="avatar-container">
                    <img 
                      src={employee.image || defaultProfileImage} 
                      alt={employee.name} 
                      className="employee-avatar" 
                    />
                    <div className="experience-badge">{employee.experience}</div>
                  </div>
                  <div className="profile-info">
                    <h3 className="employee-name">{employee.name}</h3>
                    <p className="employee-position">{employee.position}</p>
                    {employee.showRate && (
                      <p className="employee-rate">
                        Rate: {employee.currency} {employee.rate}/hr
                      </p>
                    )}
                    <div className="social-links">
                      <button 
                        className="social-btn linkedin"
                        onClick={() => handleContact('linkedin', employee.contact.linkedin)}
                      >
                        <FaLinkedin />
                      </button>
                      {/* <button 
                        className="social-btn github"
                        onClick={() => handleContact('github', employee.contact.github)}
                      >
                        <FiGithub />
                      </button> */}
                    </div>
                  </div>
                </div>

                <div className="employee-intro">
                  <p>{employee.intro}</p>
                </div>

                {employee.showExpertise && (
                  <div className="expertise-section">
                    <h4 className="section-label">
                      <FaStar className="icon" /> {employee.expertise}
                    </h4>
                    <div className="expertise-tags">
                      {employee.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {renderVideoSection(employee)}

                <div className="contact-section">
                  <div className="contact-method">
                    <FaPhone className="contact-icon" />
                    <span>{employee.contact.phone}</span>
                  </div>
                  <div className="contact-method">
                    <FaEnvelope className="contact-icon" />
                    <span>{employee.contact.email}</span>
                  </div>
                </div>

                <div className="action-buttons">
                  <button 
                    className="action-btn call"
                    onClick={() => handleContact('phone', employee.contact.phone)}
                  >
                    <FaPhone /> Call
                  </button>
                  <button 
                    className="action-btn email"
                    onClick={() => handleContact('email', employee.contact.email)}
                  >
                    <FaEnvelope /> Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeCard;