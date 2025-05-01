import React from "react";
import "./Solutions.css";

const solutions = [
    {
        title: "Sales & customer success",
        description: "Top-tier sales and customer success teams to turbocharge growth and retention",
        buttonColor: "#18c4cb", // Light blue
        image: "../../assets/customer-support.jpg",
    },
    {
        title: "Accounting",
        description: "Job-ready, handpicked accounting talent trained in Australian standards",
        buttonColor: "#003d4c", // Dark blue
        image: "../../assets/accountant.png",
    },
];

const Solutions = () => {
    return (
        <div className="solutions-container">
            <h2 className="solutions-title">Solutions</h2>
            <div className="solutions-grid">
                {solutions.map((solution, index) => (
                    <div key={index} className="solution-card">
                        <div className="solution-text">
                            <h3>{solution.title}</h3>
                            <p>{solution.description}</p>
                            <button
                                className="explore-button"
                                style={{ backgroundColor: solution.buttonColor }}
                            >
                                <strong>Explore →</strong>
                            </button>
                        </div>
                        <div className="solution-image">
                            <img src={solution.image} alt={solution.title} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Solutions;
