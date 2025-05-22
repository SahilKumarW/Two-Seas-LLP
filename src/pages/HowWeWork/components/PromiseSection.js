import React from 'react';
import { FaChartLine, FaShieldAlt, FaUsers, FaHandshake } from 'react-icons/fa';

const PromiseSection = () => {
    return (
        <section className="promise-section">
            <div className="promise-header">
                <h2>The Two Seas Promise</h2>
                <div className="header-divider"></div>
                <p className="promise-intro">As a HR consulting firm we are at the forefront of ensuring health our employees and team client's success.</p>
            </div>

            <div className="promise-grid">
                {/* Row 1 */}
                <div className="promise-row">
                    {/* Activity Tracking */}
                    <div className="promise-card">
                        <div className="promise-icon">
                            <FaChartLine />
                        </div>
                        <h3>Activity Tracking</h3>
                        <div className="promise-content">
                            <p>How Do I Practice working software into the brand and use to implement it through the user's work. For these changes I gain automatic productivity insights, including team work hours, activity levels, task distribution, and other employees are most active.</p>
                        </div>
                    </div>

                    {/* Security of Data */}
                    <div className="promise-card">
                        <div className="promise-icon">
                            <FaShieldAlt />
                        </div>
                        <h3>Security of Data</h3>
                        <div className="promise-content">
                            <p>We ensure you can data security by enacting strict privacy policies based on control and the allocation of a virtual data source. Our strategy is provide sure access to your organizations private data.</p>
                        </div>
                    </div>
                </div>

                {/* Row 2 */}
                <div className="promise-row">
                    {/* Staff Engagement */}
                    <div className="promise-card">
                        <div className="promise-icon">
                            <FaUsers />
                        </div>
                        <h3>Staff Engagement</h3>
                        <div className="promise-content">
                            <p>We keep our staff ethical, motivated, and careful. Regular organizing of thematic donors, authors, and user-science employee well being is a priority for us. We believe keeping staff ethical engaged, and motivated leads to a high performance yielding team ability.</p>
                        </div>
                    </div>

                    {/* Client Team Check */}
                    <div className="promise-card">
                        <div className="promise-icon">
                            <FaHandshake />
                        </div>
                        <h3>Client Team Check</h3>
                        <div className="promise-content">
                            <ul>
                                <p>Our internal team assistance centers developed as a standardized operating procedure we regularly meet within our employees to assess any communications, issues they are going and give them to our clients to complete our intermediary promise.</p>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromiseSection;