import React from 'react';
import './Stats.css';

const Stats = () => {
    return (
        <section className="stats">
            <div className="container">
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>700+</h3>
                        <p>Staff placed</p>
                    </div>
                    <div className="stat-card">
                        <h3>90%</h3>
                        <p>Placement success rate</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;