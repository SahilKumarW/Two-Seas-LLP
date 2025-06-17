import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

const EmployeeSupportSection = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const availableDates = [
        { date: 'Monday, June 5', morning: '9:00 AM', afternoon: '2:00 PM', evening: null },
        { date: 'Tuesday, June 6', morning: '10:00 AM', afternoon: null, evening: '5:00 PM' },
        { date: 'Wednesday, June 7', morning: null, afternoon: '1:00 PM', evening: '6:00 PM' },
        { date: 'Thursday, June 8', morning: '11:00 AM', afternoon: '3:00 PM', evening: null },
    ];

    const handleScheduleClick = (date, time) => {
        setSelectedDate(date);
        setSelectedTime(time);
        setIsSuccess(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Here you would typically send the data to your backend
            // For demonstration, we'll simulate an API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Reset form and show success
            setUserDetails({ name: '', email: '', phone: '' });
            setIsSuccess(true);

            // In a real app, you might want to keep the selected date/time
            // or redirect to a confirmation page
        } catch (error) {
            console.error('Error submitting appointment:', error);
            alert('Failed to schedule appointment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewAllClick = () => {
        setSelectedDate('Any available date');
        setSelectedTime(null);
        setIsSuccess(false);
    };

    return (
        <section className="employee-support-section">
            <div className="support-header">
                <h2>Meet Us for a Strategy Call</h2>
                <div className="header-divider"></div>
            </div>
            <div className="meeting-cta">
                <div className="cta-card">
                    <div className="cta-icon">
                        <FaCalendarAlt />
                    </div>

                    {!selectedDate ? (
                        <>
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

                            <div className="button-container">
                                <button
                                    className="schedule-btn primary-btn"
                                    onClick={handleViewAllClick}
                                >
                                    View All Availability
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="appointment-form-container">
                            {isSuccess ? (
                                <div className="success-message">
                                    <h3>Appointment Scheduled!</h3>
                                    <p>Your appointment has been scheduled for:</p>
                                    <p className="confirmation-details">
                                        <strong>{selectedDate}</strong>
                                        {selectedTime && <>, <strong>{selectedTime}</strong></>}
                                    </p>
                                    <p>A confirmation has been sent to your email.</p>
                                    <div className="button-container">
                                        <button
                                            className="schedule-btn primary-btn"
                                            onClick={() => {
                                                setSelectedDate(null);
                                                setSelectedTime(null);
                                            }}
                                        >
                                            Schedule Another Appointment
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3>Confirm Your Appointment</h3>
                                    <p className="selected-slot">
                                        {selectedDate}
                                        {selectedTime && `, ${selectedTime}`}
                                    </p>

                                    <form onSubmit={handleSubmit} className="appointment-form">
                                        <div className="form-group">
                                            <label htmlFor="name">Full Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={userDetails.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={userDetails.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="phone">Phone Number</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={userDetails.phone}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-buttons">
                                            <button
                                                type="submit"
                                                className="schedule-btn confirm-btn"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Scheduling...' : 'Confirm Appointment'}
                                            </button>

                                            <button
                                                type="button"
                                                className="schedule-btn back-btn"
                                                onClick={() => {
                                                    setSelectedDate(null);
                                                    setSelectedTime(null);
                                                }}
                                                disabled={isSubmitting}
                                            >
                                                Back to Availability
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .button-container {
                        display: flex;
                        justify-content: center;
                        margin: 20px 0;
                    }
                .form-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-top: 20px;
                }
                
                .schedule-btn {
                    padding: 10px 20px;
                    background-color: #2A2D7C;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.3s;
                }
                
                
                
                .schedule-btn:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }
                
                .back-btn {
                    background-color: #06a3c2;
                    color: #ffffff;
                }
                
            `}</style>
        </section>
    );
};

export default EmployeeSupportSection;