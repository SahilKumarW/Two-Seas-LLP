import React from 'react';
import { FaPhone, FaEnvelope, FaUserTie, FaBriefcase, FaStar, FaLinkedin } from 'react-icons/fa';
import { FiGithub } from 'react-icons/fi';
import './EmployeeCard.css';

const EmployeeCard = () => {
  // Enhanced dummy Pakistani employee data
  const employees = [
    {
      id: 1,
      name: 'Ali Khan',
      position: 'Senior Software Engineer',
      experience: '8 years',
      expertise: ['React', 'Node.js', 'AWS', 'TypeScript'],
      contact: {
        phone: '+92 300 1234567',
        email: 'ali.khan@techsolutions.pk',
        linkedin: 'alikhan-dev',
        github: 'alikhan-code'
      },
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Full-stack developer specializing in scalable cloud applications with 8+ years of industry experience.'
    },
    {
      id: 2,
      name: 'Fatima Ahmed',
      position: 'Lead UX/UI Designer',
      experience: '5 years',
      expertise: ['Figma', 'User Research', 'Prototyping', 'Adobe Suite'],
      contact: {
        phone: '+92 321 7654321',
        email: 'fatima.ahmed@creative.pk',
        linkedin: 'fatimaui',
        github: 'fatimadesigns'
      },
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'Award-winning designer passionate about creating intuitive user experiences with a human-centered approach.'
    },
    {
      id: 3,
      name: 'Fatima Ahmed',
      position: 'Lead UX/UI Designer',
      experience: '5 years',
      expertise: ['Figma', 'User Research', 'Prototyping', 'Adobe Suite'],
      contact: {
        phone: '+92 321 7654321',
        email: 'fatima.ahmed@creative.pk',
        linkedin: 'fatimaui',
        github: 'fatimadesigns'
      },
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'Award-winning designer passionate about creating intuitive user experiences with a human-centered approach.'
    },
    {
      id: 4,
      name: 'Fatima Ahmed',
      position: 'Lead UX/UI Designer',
      experience: '5 years',
      expertise: ['Figma', 'User Research', 'Prototyping', 'Adobe Suite'],
      contact: {
        phone: '+92 321 7654321',
        email: 'fatima.ahmed@creative.pk',
        linkedin: 'fatimaui',
        github: 'fatimadesigns'
      },
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'Award-winning designer passionate about creating intuitive user experiences with a human-centered approach.'
    },
    {
      id: 5,
      name: 'Usman Malik',
      position: 'DevOps Architect',
      experience: '6 years',
      expertise: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
      contact: {
        phone: '+92 345 6789012',
        email: 'usman.malik@cloudops.pk',
        linkedin: 'usman-devops',
        github: 'usmaniac'
      },
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      bio: 'DevOps specialist focused on building robust infrastructure and automation pipelines.'
    },
    {
      id: 6,
      name: 'Ayesha Raza',
      position: 'Data Science Lead',
      experience: '4 years',
      expertise: ['Python', 'Machine Learning', 'TensorFlow', 'Big Data'],
      contact: {
        phone: '+92 333 4567890',
        email: 'ayesha.raza@datascience.pk',
        linkedin: 'ayesha-ds',
        github: 'raza-ai'
      },
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      bio: 'Data scientist with expertise in predictive modeling and natural language processing applications.'
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

  return (
    <div className="employee-portal">
      <header className="portal-header">
        <h1 className="portal-title">Team Directory</h1>
        <p className="portal-subtitle">Meet our talented professionals</p>
        {/* <div className="header-accent"></div> */}
      </header>

      <div className="employee-grid">
        {employees.map(employee => (
          <div key={employee.id} className="employee-card">
            <div className="card-gradient-border">
              <div className="card-content">
                <div className="employee-profile">
                  <div className="avatar-container">
                    <img src={employee.image} alt={employee.name} className="employee-avatar" />
                    <div className="experience-badge">{employee.experience}</div>
                  </div>
                  <div className="profile-info">
                    <h3 className="employee-name">{employee.name}</h3>
                    <p className="employee-position">{employee.position}</p>
                    <div className="social-links">
                      <button 
                        className="social-btn linkedin"
                        onClick={() => handleContact('linkedin', employee.contact.linkedin)}
                      >
                        <FaLinkedin />
                      </button>
                      <button 
                        className="social-btn github"
                        onClick={() => handleContact('github', employee.contact.github)}
                      >
                        <FiGithub />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="employee-bio">
                  <p>{employee.bio}</p>
                </div>

                <div className="expertise-section">
                  <h4 className="section-label">
                    <FaStar className="icon" /> Core Expertise
                  </h4>
                  <div className="expertise-tags">
                    {employee.expertise.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>

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