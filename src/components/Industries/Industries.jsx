import React from "react";
import "./Industries.css";
import energyIcon from "../../assets/energy.png";
import financeIcon from "../../assets/finances.png";
import realEstateIcon from "../../assets/real-estate.png";
import itTelecomIcon from "../../assets/it.png";

const Industries = () => {
    return (
        <div className="industries-container">
            <h2 className="industries-title">Industries we partner with</h2>
            <div className="industries-row">
                <div className="industry-item">
                    <img src={energyIcon} alt="Energy & Utilities" />
                    <p>Energy & Utilities</p>
                </div>
                <div className="industry-item">
                    <img src={financeIcon} alt="Finance" />
                    <p>Finance</p>
                </div>
                <div className="industry-item">
                    <img src={realEstateIcon} alt="Real Estate" />
                    <p>Real estate</p>
                </div>
                <div className="industry-item">
                    <img src={itTelecomIcon} alt="IT & Telecom" />
                    <p>IT & Telecom</p>
                </div>
            </div>
        </div>
    );
};

export default Industries;
