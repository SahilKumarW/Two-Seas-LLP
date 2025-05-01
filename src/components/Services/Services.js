import React from "react";
import "./Services.css";

const Services = () => {
    const services = [
        { title: "Insurance", icon: "🛡️" },
        { title: "Sales & Marketing", icon: "📈" },
        { title: "Accounting & Finance", icon: "💰" },
        { title: "Virtual Professionals", icon: "👥" },
        { title: "Information Technology", icon: "💻" }
    ];

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
                        <ServiceCard key={index} service={service} />
                    ))}
                </div>
                <div className="services-grid second-row">
                    {services.slice(3, 5).map((service, index) => (
                        <ServiceCard key={index + 3} service={service} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const ServiceCard = ({ service }) => (
    <div className="service-card">
        <div className="card-icon">{service.icon}</div>
        <div className="card-content">
            <h3>{service.title}</h3>
            <p className="card-desc">{service.desc}</p>
            <div className="card-hover-content">
                <button className="card-cta">Explore Solutions</button>
            </div>
        </div>
    </div>
);

export default Services;