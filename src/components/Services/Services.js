import React from "react";
import { useNavigate } from "react-router-dom";
import "./Services.css";

const Services = () => {
    const navigate = useNavigate();
    
    const services = [
        { 
            id: 'insurance',
            title: "Insurance", 
            icon: "🤝",
            desc: "Expert insurance professionals for all your coverage needs.",
            details: {
                description: "We provide specialized insurance professionals including underwriters, claims adjusters, risk managers, and actuaries. All candidates have minimum 2 years experience in the insurance sector.",
                hiringProcess: "Our rigorous 4-step process ensures we find insurance experts with the right technical knowledge and customer service skills."
            }
        },
        { 
            id: 'sales-marketing',
            title: "Sales & Marketing", 
            icon: "📈",
            desc: "Revenue-driving professionals for your growth needs.",
            details: {
                description: "Our sales and marketing team includes digital marketers, sales executives, business developers, and CRM specialists. We focus on both B2B and B2C expertise.",
                hiringProcess: "Candidates undergo practical sales simulations and marketing strategy assessments."
            }
        },
        { 
            id: 'accounting-finance',
            title: "Accounting & Finance", 
            icon: "💰",
            desc: "Financial experts to manage your fiscal operations.",
            details: {
                description: "We provide qualified accountants, financial analysts, auditors, and bookkeepers. All professionals are proficient in major accounting software.",
                hiringProcess: "Financial professionals complete technical accounting tests and scenario-based evaluations."
            }
        },
        { 
            id: 'virtual-professionals',
            title: "Virtual Professionals", 
            displayTitle: "Virtual",
            icon: "👥",
            desc: "Skilled remote support for your business needs.",
            details: {
                description: "Our virtual assistants, data entry specialists, and remote administrators are trained in productivity tools and communication platforms.",
                hiringProcess: "Virtual professionals are tested on time management, communication skills, and technical proficiency."
            }
        },
        { 
            id: 'it-telecom',
            title: "IT & Telecom", 
            icon: "💻",
            desc: "Technical experts for your digital infrastructure.",
            details: {
                description: "We provide software developers, network engineers, cybersecurity specialists, and telecom technicians across all major platforms and languages.",
                hiringProcess: "IT candidates complete coding challenges and infrastructure troubleshooting scenarios."
            }
        }
    ];

    const handleExploreClick = (service) => {
        navigate(`/services/${service.id}`, { state: { service } });
    };

    return (
        <section className="services-section">
            <div className="services-container">
                <div className="title-container">
                    <h2 className="business-title">Businesses We Serve</h2>
                    <div className="title-divider">
                        <span className="divider-line"></span>
                        <span className="divider-slash">/</span>
                        <span className="divider-line"></span>
                    </div>
                    <h2 className="professionals-title">Professionals We Provide</h2>
                </div>

                <div className="services-grid">
                    {services.slice(0, 3).map((service, index) => (
                        <ServiceCard 
                            key={service.id}
                            service={service} 
                            onExploreClick={() => handleExploreClick(service)}
                        />
                    ))}
                </div>
                <div className="services-grid second-row">
                    {services.slice(3, 5).map((service, index) => (
                        <ServiceCard 
                            key={service.id}
                            service={service} 
                            onExploreClick={() => handleExploreClick(service)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const ServiceCard = ({ service, onExploreClick }) => (
    <div className="service-card">
        <div className="card-icon">{service.icon}</div>
        <div className="card-content">
            <h3>{service.title}</h3>
            {/* <p className="card-desc">{service.desc}</p> */}
            <div className="card-hover-content">
                <button 
                    className="card-cta"
                    onClick={onExploreClick}
                >
                    Explore Solutions
                </button>
            </div>
        </div>
    </div>
);

export default Services;