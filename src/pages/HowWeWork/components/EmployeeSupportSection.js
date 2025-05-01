import React, { useEffect } from 'react';
import { FaHeadset, FaAward, FaCalendarAlt } from 'react-icons/fa';

const EmployeeSupportSection = () => {
    // Load Calendly widget script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Sample available dates and times
    const availableDates = [
        { date: 'Monday, June 5', morning: '9:00 AM', afternoon: '2:00 PM', evening: null },
        { date: 'Tuesday, June 6', morning: '10:00 AM', afternoon: null, evening: '5:00 PM' },
        { date: 'Wednesday, June 7', morning: null, afternoon: '1:00 PM', evening: '6:00 PM' },
        { date: 'Thursday, June 8', morning: '11:00 AM', afternoon: '3:00 PM', evening: null },
    ];

    const handleScheduleClick = (date, time) => {
        // Replace with your Calendly URL
        window.Calendly?.initPopupWidget({
            url: 'https://calendly.com/your-username/30min',
            prefill: {
                date: `${date} at ${time}`
            }
        });
    };

    return (
        <section className="employee-support-section">
            <div className="support-header">
                <h2>Employee Support System</h2>
                <div className="header-divider"></div>
            </div>

            <div className="support-grid">
                {/* Operational Support */}
                <div className="support-card">
                    <div className="support-icon">
                        <FaHeadset />
                    </div>
                    <h3>Operational Support</h3>
                    <div className="support-content">
                        <p>When operational challenges arise within your remote unit, you can show that this yourself is the barrier. Your employer offers awards as your designated amount isn't about 6-cohm long directly with yourself and every remote operating service has been completed. They remain active during the days of a week, ensuring strategic support and security assistance at all times.</p>
                    </div>
                </div>

                {/* Employee Recognition */}
                <div className="support-card">
                    <div className="support-icon">
                        <FaAward />
                    </div>
                    <h3>Employee Recognition</h3>
                    <div className="support-content">
                        <p>Longevity is a core value of our company. This we selected as worth 1 year increase and increments to our employees. As well as holding a gift as a gesture of our appreciation to foster a positive engaged workplace.</p>
                    </div>
                </div>
            </div>

            {/* Meeting CTA */}
            <div className="meeting-cta">
                <div className="cta-card">
                    <div className="cta-icon">
                        <FaCalendarAlt />
                    </div>
                    <h3>Meet with us for a strategy call</h3>

                    <div className="calendar-table-container">
                        <table className="availability-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Morning</th>
                                    <th>Afternoon</th>
                                    <th>Evening</th>
                                </tr>
                            </thead>
                            <tbody>
                                {availableDates.map((day, index) => (
                                    <tr key={index}>
                                        <td>{day.date}</td>
                                        <td>
                                            {day.morning ? (
                                                <button
                                                    className="time-slot"
                                                    onClick={() => handleScheduleClick(day.date, day.morning)}
                                                >
                                                    {day.morning}
                                                </button>
                                            ) : '-'}
                                        </td>
                                        <td>
                                            {day.afternoon ? (
                                                <button
                                                    className="time-slot"
                                                    onClick={() => handleScheduleClick(day.date, day.afternoon)}
                                                >
                                                    {day.afternoon}
                                                </button>
                                            ) : '-'}
                                        </td>
                                        <td>
                                            {day.evening ? (
                                                <button
                                                    className="time-slot"
                                                    onClick={() => handleScheduleClick(day.date, day.evening)}
                                                >
                                                    {day.evening}
                                                </button>
                                            ) : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="or-divider">- OR -</p>

                    {/* Direct Calendly Button */}
                    <button
                        className="schedule-btn"
                        onClick={() => window.Calendly?.initPopupWidget({
                            url: 'https://calendly.com/your-username/30min'
                        })}
                    >
                        View Full Availability
                    </button>
                </div>
            </div>
        </section>
    );
};

export default EmployeeSupportSection;