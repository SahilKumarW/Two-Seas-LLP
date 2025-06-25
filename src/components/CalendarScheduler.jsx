import React, { useState } from 'react';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { niches } from '../pages/AdminDashboard/constants';

const CalendarScheduler = ({
    onScheduleSubmit,
    availableTimeSlots = [],
    initialMonth = new Date().getMonth(),
    initialYear = new Date().getFullYear(),
    title = "Schedule a Meeting",
    submitButtonText = "Send Appointment Request",
    successMessage = "We'll contact you shortly to confirm your appointment."
}) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        details: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(initialMonth);
    const [currentYear, setCurrentYear] = useState(initialYear);

    // Generate available dates for the current month
    const generateAvailableDates = (month, year) => {
        if (availableTimeSlots.length > 0) {
            return availableTimeSlots;
        }

        // Fallback to generating sample data if no time slots provided
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dates = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();

            if (dayOfWeek > 0 && dayOfWeek < 6) {
                const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
                const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month];

                const times = [];
                if (Math.random() > 0.3) times.push('9:00 AM');
                if (Math.random() > 0.4) times.push('11:00 AM');
                if (Math.random() > 0.3) times.push('2:00 PM');
                if (Math.random() > 0.5) times.push('4:00 PM');

                if (times.length > 0) {
                    dates.push({
                        date: date,
                        displayDate: `${weekday}, ${monthName} ${day}`,
                        times: times
                    });
                }
            }
        }

        return dates;
    };

    const [availableDates, setAvailableDates] = useState(() => {
        return generateAvailableDates(currentMonth, currentYear);
    });

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
            if (onScheduleSubmit) {
                await onScheduleSubmit({
                    ...userDetails,
                    appointmentDate: selectedDate,
                    appointmentTime: selectedTime
                });
            } else {
                // Default behavior if no callback provided
                const subject = `Appointment Request - ${userDetails.company || userDetails.name}`;
                const body = `Company: ${userDetails.company}%0D%0AName: ${userDetails.name}%0D%0AEmail: ${userDetails.email}%0D%0APhone: ${userDetails.phone}%0D%0A%0D%0ARequested Appointment Time:%0D%0A${selectedDate}${selectedTime ? ` at ${selectedTime}` : ''}%0D%0A%0D%0AAdditional Details:%0D%0A${userDetails.details}%0D%0A%0D%0A`;
                window.open(`mailto:?subject=${subject}&body=${body}`);
            }

            setUserDetails({
                name: '',
                email: '',
                phone: '',
                company: '',
                niche: '',
                details: ''
            });
            setIsSuccess(true);
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

    const changeMonth = (increment) => {
        let newMonth = currentMonth + increment;
        let newYear = currentYear;

        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        setAvailableDates(generateAvailableDates(newMonth, newYear));
    };

    const monthName = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'][currentMonth];

    return (
        <div className="calendar-scheduler">
            <div className="scheduler-header">
                <h2 style={{ color: '#06a3c2' }}>{title}</h2>
                <div className="header-divider"></div>
            </div>

            <div className="scheduler-container">
                <div className="scheduler-card">
                    <div className="scheduler-icon">
                        <FaCalendarAlt />
                    </div>

                    {!selectedDate ? (
                        <>
                            <div className="calendar-header">
                                <button
                                    className="month-nav-btn"
                                    onClick={() => changeMonth(-1)}
                                    aria-label="Previous month"
                                >
                                    <FaChevronLeft />
                                </button>
                                <h3>{monthName} {currentYear}</h3>
                                <button
                                    className="month-nav-btn"
                                    onClick={() => changeMonth(1)}
                                    aria-label="Next month"
                                >
                                    <FaChevronRight />
                                </button>
                            </div>

                            <div className="calendar-table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {availableDates.length > 0 ? (
                                    <table className="availability-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Available Times</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {availableDates.map((day, index) => (
                                                <tr key={index}>
                                                    <td>{day.displayDate}</td>
                                                    <td>
                                                        <div className="time-slots-container">
                                                            {day.times.map((time, timeIndex) => (
                                                                <button
                                                                    key={timeIndex}
                                                                    className="time-slot"
                                                                    onClick={() => handleScheduleClick(day.displayDate, time)}
                                                                >
                                                                    {time}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="no-availability">No availability for {monthName}. Please try another month.</p>
                                )}
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
                                    <h3>Appointment Request Sent!</h3>
                                    <p>Your appointment request has been sent for:</p>
                                    <p className="confirmation-details">
                                        <strong>{selectedDate}</strong>
                                        {selectedTime && <>, <strong>{selectedTime}</strong></>}
                                    </p>
                                    <p>{successMessage}</p>
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
                                    <h3 style={{ textAlign: 'center', color: '#2A2D7C' }}>Confirm Your Appointment</h3>
                                    <p className="selected-slot">
                                        {selectedDate}
                                        {selectedTime && `, ${selectedTime}`}
                                    </p>

                                    <form onSubmit={handleSubmit} className="appointment-form">
                                        <div className="form-group">
                                            <label htmlFor="name">Full Name *</label>
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
                                            <label htmlFor="email">Email *</label>
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
                                            <label htmlFor="phone">Phone Number *</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={userDetails.phone}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="company">Company Name</label>
                                            <input
                                                type="text"
                                                id="company"
                                                name="company"
                                                value={userDetails.company}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="niche">Niche of Hiring *</label>
                                            <select
                                                id="niche"
                                                name="niche"
                                                value={userDetails.niche}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select a niche</option>
                                                {niches.map(niche => (
                                                    <option key={niche.id} value={niche.name}>
                                                        {niche.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="details">Any further details you would like to add</label>
                                            <textarea
                                                id="details"
                                                name="details"
                                                value={userDetails.details}
                                                onChange={handleInputChange}
                                                rows="4"
                                                placeholder="Please share any specific requirements..."
                                            />
                                        </div>

                                        {/* <div className="form-group">
                                            <label htmlFor="details">Additional Details</label>
                                            <textarea
                                                id="details"
                                                name="details"
                                                value={userDetails.details}
                                                onChange={handleInputChange}
                                                rows="4"
                                                placeholder="Please share any specific requirements..."
                                            />
                                        </div> */}

                                        <div className="form-buttons">
                                            <button
                                                type="submit"
                                                className="schedule-btn confirm-apt-btn"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Sending...' : submitButtonText}
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
                .calendar-scheduler {
                    max-width: 1000px;
                    margin: 0 auto;
                    // padding: 1rem;
                    font-family: 'Arial', sans-serif;
                }
                
                .scheduler-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                
                .header-divider {
                    width: 100px;
                    height: 3px;
                    background-color: #06a3c2;
                    margin: 10px auto;
                }
                
                .scheduler-container {
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    padding: 2rem;
                    max-height: 110vh;           /* Fits within most screens */
                    overflow-y: auto;
                    padding-right: 8px;         /* Prevent scrollbar overlap */
                }
                
                .scheduler-card {
                    text-align: center;
                }
                
                .scheduler-icon {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                }
                
                .calendar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                
                .calendar-header h3 {
                    margin: 0;
                    color: #2A2D7C;
                }
                
                .month-nav-btn {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    color: #2A2D7C;
                    padding: 0.5rem;
                }
                
                .month-nav-btn:hover {
                    color: #06a3c2;
                }
                
                .calendar-table-container {
                    overflow-x: auto;
                    margin-bottom: 1.5rem;
                }
                
                .availability-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 0 auto;
                }
                
                .availability-table th, 
                .availability-table td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                
                .availability-table th {
                    background-color: #2A2D7C;
                    color: white;
                }
                
                .availability-table tr:nth-child(even) {
                    background-color: #f2f2f2;
                }
                
                .time-slots-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                
                .time-slot {
                    padding: 8px 12px;
                    background-color: #06a3c2;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                .time-slot:hover {
                    background-color: #2A2D7C;
                }
                
                .no-availability {
                    text-align: center;
                    padding: 1rem;
                    color: #666;
                }
                
                .or-divider {
                    text-align: center;
                    margin: 1rem 0;
                    color: #666;
                }
                
                .button-container {
                    display: flex;
                    justify-content: center;
                    margin: 20px 0;
                }
                
                .appointment-form-container {
                    text-align: left;
                    max-width: 600px;
                    margin: 0 auto;
                }
                
                .selected-slot {
                    font-size: 1.1rem;
                    color: #2A2D7C;
                    margin-bottom: 1.5rem;
                    text-align: center;
                }
                
                .appointment-form {
                    display: flex;
                    flex-direction: column;
                }

                select {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 1rem;
                    width: 100%;
                    background-color: white;
                }

                textarea {
                    resize: vertical;
                    min-height: 100px;
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 1rem;
                }
                
                .form-group {
                    margin-bottom: 1rem;
                }
                
                .form-group label {
                    margin-bottom: 0.5rem;
                    font-weight: bold;
                    color: #333;
                    display: block;
                }
                
                .form-group input,
                .form-group textarea,
                .form-group select {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 1rem;
                    width: 100%;
                }
                
                .form-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-top: 20px;
                }
                
                .schedule-btn {
                    padding: 12px 24px;
                    background-color: #2A2D7C;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.3s;
                }
                
                .schedule-btn:hover {
                    background: #2A2D7C;
                    color: #ffffff;
                }
                
                .schedule-btn:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }
                
                .confirm-apt-btn {
                    background-color: #2A2D7C;
                }
                
                .back-btn {
                    background-color: #06a3c2;
                }
                
                .back-btn:hover {
                    background-color: #5a6268;
                }
                
                .success-message {
                    text-align: center;
                    padding: 1rem;
                }
                
                .success-message h3 {
                    color: #2A2D7C;
                    margin-bottom: 1rem;
                }
                
                .confirmation-details {
                    font-size: 1.1rem;
                    margin: 1rem 0;
                    padding: 1rem;
                    background-color: #f0f8ff;
                    border-radius: 4px;
                }
                
                @media (max-width: 768px) {
                    .form-buttons {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .schedule-btn {
                        width: 100%;
                    }
                    
                    .time-slots-container {
                        flex-direction: column;
                        gap: 5px;
                    }
                    
                    .time-slot {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default CalendarScheduler;