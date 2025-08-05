import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SEASProcessFlow from "../../pages/HowWeWork/components/SEASProcessFlow";
import "./ServiceDetails.css";

const ServiceDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { service } = state || {};

    // Scroll to top when service changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [service]);

    if (!service) {
        navigate('/services');
        return null;
    }

    const handleBookConsultation = () => {
        console.log("Booking consultation for", service.title);
    };

    return (
        <div className="service-detail-page">
            <h2 className="service-title">{service.displayTitle || service.title} Professionals</h2>
            <p>{service.details.description}</p>

            <SEASProcessFlow />
            <p>{service.details.hiringProcess}</p>
            
            <div className="action-buttons-container">
                <button 
                    className="consultation-button"
                    onClick={handleBookConsultation}
                >
                    Book Yourself a Free Consultation
                </button>
                
                <button 
                    className="back-button"
                    onClick={() => {
                        window.scrollTo(0, 0); // Scroll to top before navigating
                        navigate('/services');
                    }}
                >
                    Back to Services
                </button>
            </div>
        </div>
    );
};

export default ServiceDetails;