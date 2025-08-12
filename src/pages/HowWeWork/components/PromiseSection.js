import React from 'react';
import { FaChartLine, FaShieldAlt, FaUsers, FaHandshake, FaAward, FaHeadset } from 'react-icons/fa';

const PromiseSection = () => {
    const promises = [
        {
            icon: <FaChartLine />,
            title: "Activity Tracking",
            description: "Automatic productivity insights, including team work hours, activity levels, task distribution, and screenshots are readily made available to our clients ensuring transparency and visibility for both us and you."
        },
        {
            icon: <FaShieldAlt />,
            title: "Security of Data",
            description: "We ensure data security by enacting strict privacy policies bound by legal contract so that your organization's data remains secure."
        },
        {
            icon: <FaUsers />,
            title: "Staff Engagement",
            description: "We own our employees and keep them motivated and engaged. Our team enjoys regular movie nights and outings. We believe in building a high-performance team, both on and off-site."
        },
        {
            icon: <FaHandshake />,
            title: "Check Ins",
            description: "We regularly meet with our employees to assess any communication gaps or issues and provide updates to our clients to fulfill our intermediary promise and seek timely solutions."
        },
        {
            icon: <FaAward />,
            title: "Employee Recognition",
            description: "Longevity is a core value of our company. We reward 6-month and 1-year tenure completions with financial bonuses/professional validation and/or gifts."
        },
        {
            icon: <FaHeadset />,
            title: "Operational Support",
            description: "Facing a teething issue you cannot seem to solve? Something has become a recurring problem? Give us a call or leave a text and we will sort it for you."
        }
    ];

    return (
        <section className="promise-section">
            <div className="promise-header">
                <h2>The Two Seas Promise</h2>
                <div className="header-divider"></div>
                <p className="promise-intro">
                    As an HR consulting firm, we are at the forefront of ensuring the well-being of our employees and our clients' success.
                </p>
            </div>

            <div className="promise-grid">
                {chunkArray(promises, 2).map((row, rowIndex) => (
                    <div className="promise-row" key={rowIndex}>
                        {row.map((promise, index) => (
                            <div className="promise-card" key={index}>
                                <div className="promise-icon">
                                    {promise.icon}
                                </div>
                                <h3>{promise.title}</h3>
                                <div className="promise-content">
                                    <p>{promise.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
};

// Helper function to split array into chunks
function chunkArray(arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
    );
}

export default PromiseSection;