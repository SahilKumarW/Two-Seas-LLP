import React, { useEffect } from 'react';
import './components/styles.css';
import ProcessSection from './components/ProcessSection';
import PromiseSection from './components/PromiseSection';
import SEASProcessFlow from './components/SEASProcessFlow';
import EmployeeSupportSection from './components/EmployeeSupportSection';
import { FaBullhorn, FaFilter, FaUserFriends, FaDatabase, FaUsers } from 'react-icons/fa';

const HowWeWork = () => {
    useEffect(() => {
    window.scrollTo(0, 0);
    })

    return (
        <div className="how-we-work-page">
            <header className="how-we-work-header">
                <h1>How We Work</h1>
                <p>At Two Seas, we're committed to delivering exceptional HR solutions through our 5-step methodology</p>
            </header>
            <SEASProcessFlow />
            <ProcessSection />
            <PromiseSection />
            <EmployeeSupportSection />
        </div>
    );
};

export default HowWeWork;