import React, { useState } from 'react';
import { FaFileAlt, FaClipboardCheck, FaHeart, FaCalendarAlt, FaRegHeart, FaStar } from 'react-icons/fa';
import './EmployeeCard.css';

export const employees = [
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
    email: 'ali.khan@techsolutions.pk',
    resumeUrl: 'https://example.com/resumes/ali-khan.pdf',
    assessmentUrl: 'https://example.com/assessments/ali-khan.pdf',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    nicheId: 1, // Assigned to Web Development niche
    status: 'active'
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
    email: 'fatima.ahmed@creative.pk',
    resumeUrl: 'https://example.com/resumes/fatima-ahmed.pdf',
    assessmentUrl: 'https://example.com/assessments/fatima-ahmed.pdf',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    nicheId: 2, // Assigned to Design niche
    status: 'active'
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
    email: 'usman.malik@cloudops.pk',
    resumeUrl: 'https://example.com/resumes/usman-malik.pdf',
    assessmentUrl: 'https://example.com/assessments/usman-malik.pdf',
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
    nicheId: 3, // Assigned to DevOps niche
    status: 'active'
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
    email: 'ayesha.raza@datascience.pk',
    resumeUrl: 'https://example.com/resumes/ayesha-raza.pdf',
    assessmentUrl: 'https://example.com/assessments/ayesha-raza.pdf',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    nicheId: 4, // Assigned to Data Science niche
    status: 'active'
  },
  {
    id: 5,
    name: 'Bilal Hussain',
    rate: 60,
    currency: 'USD',
    experience: '3 years',
    expertise: 'Mobile Development',
    intro: 'Cross-platform mobile developer with experience building performant apps for both iOS and Android.',
    position: 'Mobile Developer',
    skills: ['Flutter', 'React Native', 'Firebase', 'Swift'],
    email: 'bilal.hussain@mobile.pk',
    resumeUrl: 'https://example.com/resumes/bilal-hussain.pdf',
    assessmentUrl: 'https://example.com/assessments/bilal-hussain.pdf',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    nicheId: null, // Unassigned
    status: 'active'
  },
  {
    id: 6,
    name: 'Sana Farooq',
    rate: 55,
    currency: 'USD',
    experience: '2 years',
    expertise: 'Frontend Development',
    intro: 'Creative frontend developer passionate about building beautiful, accessible user interfaces.',
    position: 'Frontend Developer',
    skills: ['JavaScript', 'Vue.js', 'CSS3', 'Web Accessibility'],
    email: 'sana.farooq@web.pk',
    resumeUrl: 'https://example.com/resumes/sana-farooq.pdf',
    assessmentUrl: 'https://example.com/assessments/sana-farooq.pdf',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    nicheId: 1, // Assigned to Web Development niche
    status: 'active'
  },
  {
    id: 7,
    name: 'Omar Sheikh',
    rate: 90,
    currency: 'USD',
    experience: '10 years',
    expertise: 'Cloud Architecture',
    intro: 'Seasoned cloud architect with extensive experience designing scalable enterprise solutions.',
    position: 'Cloud Solutions Architect',
    skills: ['AWS', 'Azure', 'Microservices', 'Serverless'],
    email: 'omar.sheikh@cloud.pk',
    resumeUrl: 'https://example.com/resumes/omar-sheikh.pdf',
    assessmentUrl: 'https://example.com/assessments/omar-sheikh.pdf',
    image: 'https://randomuser.me/api/portraits/men/55.jpg',
    nicheId: 3, // Assigned to DevOps niche
    status: 'hidden'
  },
  {
    id: 8,
    name: 'Zara Iqbal',
    rate: 50,
    currency: 'USD',
    experience: '1 year',
    expertise: 'Quality Assurance',
    intro: 'Detail-oriented QA engineer specializing in automated testing and quality processes.',
    position: 'QA Engineer',
    skills: ['Selenium', 'Jest', 'Cypress', 'Test Automation'],
    email: 'zara.iqbal@qa.pk',
    resumeUrl: 'https://example.com/resumes/zara-iqbal.pdf',
    assessmentUrl: 'https://example.com/assessments/zara-iqbal.pdf',
    image: 'https://randomuser.me/api/portraits/women/25.jpg',
    nicheId: null, // Unassigned
    status: 'active'
  }
];

const EmployeeCard = () => {
  const [wishlist, setWishlist] = useState({});
  const [expandedCards, setExpandedCards] = useState({});

  const toggleCardExpand = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleWishlist = (id) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleViewDocument = (url) => {
    window.open(url, '_blank');
  };

  const bookInterview = (email) => {
    window.open(`mailto:${email}?subject=Interview Request&body=I would like to schedule an interview`, '_blank');
  };

  return (
    <div className="employee-portal">
      <header className="portal-header">
        <div className="header-content">
          <h1 className="portal-title">Talent Nexus</h1>
          <p className="portal-subtitle">Discover Exceptional Tech Professionals</p>
          {/* <div className="stats-bar">
            <div className="stat">
              <span className="stat-number">{employees.length}</span>
              <span className="stat-label">Professionals</span>
            </div>
          </div> */}
        </div>
      </header>

      <div className="employee-grid">
        {employees.map((employee, index) => (
          <div
            key={employee.id}
            className={`employee-card ${expandedCards[employee.id] ? 'expanded' : ''}`}
            onClick={() => toggleCardExpand(employee.id)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="card-content">
              <div className="card-background">
                <div className="employee-profile">
                  <div className="avatar-container">
                    <div className="avatar-wrapper">
                      <img
                        src={employee.image}
                        alt={employee.name}
                        className="employee-avatar"
                      />
                      <div className="experience-badge">{employee.experience}</div>
                    </div>
                    <button
                      className={`wishlist-button ${wishlist[employee.id] ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(employee.id);
                      }}
                    >
                      {wishlist[employee.id] ? <FaHeart /> : <FaRegHeart />}
                    </button>
                  </div>
                  <div className="profile-info">
                    <h3 className="employee-name">{employee.name}</h3>
                    <p className="employee-position">{employee.position}</p>
                    <div className="rating">
                      <FaStar className="star" />
                      <span>
                        {`${Math.min(5, Math.max(4, Math.floor(employee.rate / 20)))}`}.{employee.rate % 20}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="employee-intro">
                  <p style={{ color: '#2A2D7C' }}>{employee.intro}</p>
                </div>

                <div className={`expandable-content ${expandedCards[employee.id] ? 'visible' : ''}`}>
                  <div className="expertise-section">
                    <h4 className="section-label">Core Expertise</h4>
                    <div className="expertise-tags">
                      {employee.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Rate</span>
                      <span className="detail-value">{employee.currency} {employee.rate}/hr</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Experience</span>
                      <span className="detail-value">{employee.experience}</span>
                    </div>
                  </div>

                  <div className="document-buttons">
                    <button
                      className="doc-button resume"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDocument(employee.resumeUrl);
                      }}
                    >
                      <FaFileAlt /> Resume
                    </button>
                    <button
                      className="doc-button assessment"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDocument(employee.assessmentUrl);
                      }}
                    >
                      <FaClipboardCheck /> Assessment
                    </button>
                  </div>
                </div>
              </div>

              <button
                className="primary-button book-interview"
                onClick={(e) => {
                  e.stopPropagation();
                  bookInterview(employee.email);
                }}
              >
                <FaCalendarAlt /> Schedule Interview
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeCard;