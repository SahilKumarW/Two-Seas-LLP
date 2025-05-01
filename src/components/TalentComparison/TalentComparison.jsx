import React from 'react';
import './TalentComparison.css';

const TalentComparison = () => {
    return (
        <section className="talent-comparison">
            <div className="container">
                <h2>Top talent, better results</h2>
                <p className="subtitle">Elevate your outsourced teams to local standards.</p>

                <div className="comparison-table">
                    <div className="table-row header">
                        <div className="table-cell empty"></div>
                        <div className="table-cell" style={{ color: '#0099b9' }}><strong>Two Seas LLP</strong></div>
                        <div className="table-cell" style={{ color: '#0099b9' }}><strong>Traditional outsourcing</strong></div>
                    </div>

                    <div className="table-row">
                        <div className="table-cell"><strong>TALENT</strong></div>
                        <div className="table-cell better">Rigorously vetted top 1% talent</div>
                        <div className="table-cell">Focused on quantity over quality</div>
                    </div>

                    <div className="table-row">
                        <div className="table-cell"><strong>RETENTION</strong></div>
                        <div className="table-cell better">2-3 year average retention</div>
                        <div className="table-cell">High attrition rates</div>
                    </div>

                    <div className="table-row">
                        <div className="table-cell"><strong>DEPLOYMENT</strong></div>
                        <div className="table-cell better">Remote-first, deploy teams in days</div>
                        <div className="table-cell">Lengthy setup process</div>
                    </div>

                    <div className="table-row">
                        <div className="table-cell"><strong>SAVINGS</strong></div>
                        <div className="table-cell better">50%+ cost savings, low setup costs</div>
                        <div className="table-cell">Offers 60-70% cost savings with high setup costs</div>
                    </div>

                    <div className="table-row">
                        <div className="table-cell"><strong>ENGAGEMENT TERMS</strong></div>
                        <div className="table-cell better">Flexible team sizing</div>
                        <div className="table-cell">Minimum seat commitments</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TalentComparison;