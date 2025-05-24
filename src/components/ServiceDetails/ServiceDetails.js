import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SEASProcessFlow from "../../pages/HowWeWork/components/SEASProcessFlow";
import "./ServiceDetails.css";

const ServiceDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { service } = state || {};

    if (!service) {
        navigate('/services');
        return null;
    }

    return (
        <div className="service-detail-page">
            <h2 className="service-title">{service.displayTitle || service.title} Professionals</h2>
            <p>{service.details.description}</p>

            <SEASProcessFlow />
            <p>{service.details.hiringProcess}</p>
            
            <div className="back-button-container">
                <button 
                    className="back-button"
                    onClick={() => navigate('/services')}
                >
                    Back to Services
                </button>
            </div>
        </div>
    );
};

export default ServiceDetails;