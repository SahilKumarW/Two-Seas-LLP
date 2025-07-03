import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaClock, FaGlobe } from 'react-icons/fa';
import { niches } from '../pages/AdminDashboard/constants';

const timeZones = [
    { value: 'GMT-12:00', label: 'GMT-12:00 (International Date Line West)' },
    { value: 'GMT-08:00', label: 'GMT-08:00 (Pacific Time)' },
    { value: 'GMT-05:00', label: 'GMT-05:00 (Eastern Time)' },
    { value: 'GMT+00:00', label: 'GMT+00:00 (London)' },
    { value: 'GMT+01:00', label: 'GMT+01:00 (Central European Time)' },
    { value: 'GMT+05:00', label: 'GMT+05:00 (Pakistan Standard Time)' },
    { value: 'GMT+08:00', label: 'GMT+08:00 (China Standard Time)' },
    { value: 'GMT+10:00', label: 'GMT+10:00 (Australian Eastern Time)' },
];

const CalendarScheduler = ({
    onScheduleSubmit,
    unavailableDates = [],
    title = "Schedule a Meeting",
    submitButtonText = "Send Appointment Request",
    successMessage = "We'll contact you shortly to confirm your appointment.",
    workingHours = { start: 9, end: 16 } // 9 AM to 4 PM
}) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedTimeZone, setSelectedTimeZone] = useState('GMT+05:00');
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        website: '',
        details: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [timeSlots, setTimeSlots] = useState([]);

    // Utility function to convert times between timezones
    const convertTimeToTimezone = (time, fromTimezone, toTimezone) => {
        const offsetMap = {
            'GMT-12:00': -12,
            'GMT-08:00': -8,
            'GMT-05:00': -5,
            'GMT+00:00': 0,
            'GMT+01:00': 1,
            'GMT+05:00': 5,
            'GMT+08:00': 8,
            'GMT+10:00': 10,
        };

        const fromOffset = offsetMap[fromTimezone] || 0;
        const toOffset = offsetMap[toTimezone] || 0;
        const diff = toOffset - fromOffset;

        // Extract hour from time string (format: "H:00 AM/PM")
        const [hourStr, period] = time.split(/[: ]/);
        let hour = parseInt(hourStr);

        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;

        // Apply timezone difference
        hour += diff;

        // Normalize hour (0-23)
        hour = (hour + 24) % 24;

        // Convert back to 12-hour format
        let newPeriod = hour >= 12 ? 'PM' : 'AM';
        let newHour = hour > 12 ? hour - 12 : hour;
        if (newHour === 0) newHour = 12;

        return `${newHour}:00 ${newPeriod}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Generate days for the current month view
    const generateDays = (month, year) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days = [];

        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            days.push(date);
        }

        return days;
    };

    const [days, setDays] = useState(() => generateDays(currentMonth, currentYear));

    useEffect(() => {
        setDays(generateDays(currentMonth, currentYear));
    }, [currentMonth, currentYear]);

    const isDateDisabled = (date) => {
        if (!date) return true;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date < today) return true;

        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) return true;

        const dateString = date.toISOString().split('T')[0];
        if (unavailableDates.includes(dateString)) return true;

        return false;
    };

    // Modified to handle timezone conversion
    const generateTimeSlots = (date, timeZone) => {
        if (!date) return [];

        const slots = [];
        const startHour = workingHours.start;
        const endHour = workingHours.end;

        for (let hour = startHour; hour <= endHour; hour++) {
            if (hour === 12) continue;

            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour > 12 ? hour - 12 : hour;
            const timeString = `${displayHour}:00 ${period}`;

            // Convert to user's selected timezone
            const userTimeString = convertTimeToTimezone(
                timeString,
                'GMT+05:00', // System timezone (adjust to your server's timezone)
                timeZone
            );

            slots.push({
                systemTime: timeString,  // Store original time
                displayTime: userTimeString // Time to show user
            });
        }

        return slots;
    };

    const handleDateClick = (date) => {
        if (isDateDisabled(date)) return;

        setSelectedDate(date);
        setSelectedTime(null);
        setIsSuccess(false);
        setTimeSlots(generateTimeSlots(date, selectedTimeZone));
    };

    const handleTimeZoneChange = (e) => {
        const newTimeZone = e.target.value;
        setSelectedTimeZone(newTimeZone);
        if (selectedDate) {
            setTimeSlots(generateTimeSlots(selectedDate, newTimeZone));
        }
    };

    const handleTimeClick = (time) => {
        setSelectedTime(time);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (onScheduleSubmit) {
                await onScheduleSubmit({
                    ...userDetails,
                    appointmentDate: selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    appointmentTime: selectedTime,
                    timeZone: selectedTimeZone
                });
            } else {
                // Default behavior if no callback provided
                const subject = `Appointment Request - ${userDetails.company || userDetails.name}`;
                const body = `Company: ${userDetails.company}%0D%0AWebsite: ${userDetails.website || 'N/A'}%0D%0AName: ${userDetails.name}%0D%0AEmail: ${userDetails.email}%0D%0APhone: ${userDetails.phone}%0D%0A%0D%0ARequested Appointment Time:%0D%0A${selectedDate.toLocaleDateString()} at ${selectedTime}%0D%0A%0D%0AAdditional Details:%0D%0A${userDetails.details}%0D%0A%0D%0A`;
                window.open(`mailto:?subject=${subject}&body=${body}`);
            }

            setUserDetails({
                name: '',
                email: '',
                phone: '',
                company: '',
                website: '',
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
    };

    const monthName = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'][currentMonth];

    const formatDateDisplay = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="calendar-scheduler">
            <div className="scheduler-header">
                <h2 style={{ color: '#06a3c2' }}>{title}</h2>
                <div className="header-divider"></div>
            </div>

            <div className="scheduler-container">
                <div className="scheduler-card">
                    <div className="scheduler-icon">
                        {!selectedDate ? <FaCalendarAlt /> : <FaClock />}
                    </div>

                    {!selectedDate ? (
                        // Calendar View
                        <div className="calendar-view">
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

                            <div className="calendar-grid">
                                <div className="day-names">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className="day-name">{day}</div>
                                    ))}
                                </div>

                                <div className="days-grid">
                                    {days.map((date, index) => (
                                        <div
                                            key={index}
                                            className={`day-cell ${!date ? 'empty' : ''} ${date && isDateDisabled(date) ? 'disabled' : ''}`}
                                            onClick={() => handleDateClick(date)}
                                        >
                                            {date && (
                                                <>
                                                    <div className="day-number">{date.getDate()}</div>
                                                    {unavailableDates.includes(date.toISOString().split('T')[0]) && (
                                                        <div className="booked-indicator">Booked</div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : !selectedTime ? (
                        // Time Slot Selection with Time Zone selector
                        <div className="time-slot-view">
                            <div className="time-zone-selector">
                                <FaGlobe className="time-zone-icon" />
                                <select
                                    value={selectedTimeZone}
                                    onChange={handleTimeZoneChange}
                                    className="time-zone-dropdown"
                                >
                                    {timeZones.map(zone => (
                                        <option key={zone.value} value={zone.value}>
                                            {zone.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <h3>Select a Time Slot</h3>
                            <p className="selected-date">{formatDateDisplay(selectedDate)}</p>

                            <div className="time-slots-grid">
                                {timeSlots.length > 0 ? (
                                    timeSlots.map((slot, index) => (
                                        <button
                                            key={index}
                                            className={`time-slot-btn ${selectedTime === slot.systemTime ? 'selected' : ''}`}
                                            onClick={() => handleTimeClick(slot.systemTime)}
                                        >
                                            {slot.displayTime}
                                        </button>
                                    ))
                                ) : (
                                    <p>No available time slots for this date</p>
                                )}
                            </div>

                            <div className="time-slot-actions">
                                <button
                                    className="back-btn"
                                    onClick={() => setSelectedDate(null)}
                                >
                                    Back to Calendar
                                </button>
                            </div>
                        </div>
                    ) : isSuccess ? (
                        // Success Message showing timezone
                        <div className="success-message">
                            <h3>Appointment Request Sent!</h3>
                            <p>Your appointment request has been sent for:</p>
                            <p className="confirmation-details">
                                <strong>{formatDateDisplay(selectedDate)}</strong>
                                {selectedTime && <>, <strong>
                                    {convertTimeToTimezone(
                                        selectedTime,
                                        'GMT+05:00', // System timezone
                                        selectedTimeZone
                                    )}
                                </strong></>}
                                {selectedTimeZone && <>, <strong>{selectedTimeZone}</strong></>}
                            </p>
                            <p>{successMessage}</p>
                            <div className="button-container">
                                <button
                                    className="primary-btn"
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
                        // Appointment Form
                        <div className="appointment-form-container">
                            <h3>Confirm Your Appointment</h3>
                            <p className="selected-slot">
                                {formatDateDisplay(selectedDate)}
                                {selectedTime && `, ${convertTimeToTimezone(
                                    selectedTime,
                                    'GMT+05:00', // System timezone
                                    selectedTimeZone
                                )
                                    }`}
                                {selectedTimeZone && ` (${selectedTimeZone})`}
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

                                {/* Add this new form group */}
                                <div className="form-group">
                                    <label htmlFor="website">Company Website</label>
                                    <input
                                        type="url"
                                        id="website"
                                        name="website"
                                        value={userDetails.website}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com"
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
                                    <label htmlFor="details">Additional Details</label>
                                    <textarea
                                        id="details"
                                        name="details"
                                        value={userDetails.details}
                                        onChange={handleInputChange}
                                        rows="4"
                                        placeholder="Please share any specific requirements..."
                                    />
                                </div>

                                <div className="form-buttons">
                                    <button
                                        type="submit"
                                        className="confirm-btn"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending...' : submitButtonText}
                                    </button>

                                    <button
                                        type="button"
                                        className="back-btn"
                                        onClick={() => setSelectedTime(null)}
                                        disabled={isSubmitting}
                                    >
                                        Back to Time Slots
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .calendar-scheduler {
                    max-width: 800px;
                    margin: 0 auto;
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
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                
                .scheduler-card {
                    text-align: center;
                }
                
                .scheduler-icon {
                    font-size: 2rem;
                    color: #2A2D7C;
                    margin-bottom: 1rem;
                }
                
                /* Calendar View Styles */
                .calendar-view {
                    max-width: 500px;
                    margin: 0 auto;
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
                    font-size: 1.2rem;
                }
                
                .month-nav-btn {
                    background: none;
                    border: none;
                    font-size: 1rem;
                    cursor: pointer;
                    color: #2A2D7C;
                    padding: 0.5rem;
                }
                
                .month-nav-btn:hover {
                    color: #06a3c2;
                }
                
                .calendar-grid {
                    display: flex;
                    flex-direction: column;
                }
                
                .day-names {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    text-align: center;
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                    color: #2A2D7C;
                }
                
                .day-name {
                    padding: 0.5rem;
                }
                
                .days-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 5px;
                }
                
                .day-cell {
                    aspect-ratio: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                    padding: 0.5rem;
                }
                
                .day-cell:not(.empty):not(.disabled):hover {
                    background-color: #e1f5fe;
                }
                
                .day-cell.empty {
                    visibility: hidden;
                }
                
                .day-cell.disabled {
                    color: #ccc;
                    cursor: not-allowed;
                }
                
                .day-number {
                    font-size: 1rem;
                    font-weight: bold;
                }
                
                .booked-indicator {
                    font-size: 0.6rem;
                    color: #f44336;
                    margin-top: 2px;
                }
                
                /* Time Slot View Styles */
                .time-slot-view {
                    max-width: 500px;
                    margin: 0 auto;
                }
                
                .time-slot-view h3 {
                    color: #2A2D7C;
                    margin-bottom: 0.5rem;
                }
                
                .selected-date {
                    color: #2A2D7C;
                    font-weight: bold;
                    margin-bottom: 1.5rem;
                }
                
                .time-slots-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;
                    margin-bottom: 1.5rem;
                }
                
                .time-slot-btn {
                    padding: 10px;
                    background-color: #06a3c2;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                .time-slot-btn:hover {
                    background-color: #2A2D7C;
                }
                
                .time-slot-actions {
                    display: flex;
                    justify-content: center;
                }
                
                /* Appointment Form Styles */
                .appointment-form-container {
                    text-align: left;
                    max-width: 500px;
                    margin: 0 auto;
                }
                
                .appointment-form-container h3 {
                    color: #2A2D7C;
                    text-align: center;
                }
                
                .selected-slot {
                    font-size: 1.1rem;
                    color: #2A2D7C;
                    margin-bottom: 1.5rem;
                    text-align: center;
                    font-weight: bold;
                }
                
                .form-group {
                    margin-bottom: 1rem;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: bold;
                    color: #333;
                }
                
                .form-group input,
                .form-group select,
                .form-group textarea {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 1rem;
                }
                
                .form-group textarea {
                    min-height: 100px;
                    resize: vertical;
                }
                
                .form-buttons {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 1.5rem;
                }
                
                .confirm-btn {
                    padding: 12px 24px;
                    background-color: #2A2D7C;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: background-color 0.3s;
                }
                
                .confirm-btn:hover {
                    background-color: #1a1c52;
                }
                
                .confirm-btn:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }
                
                .back-btn {
                    padding: 12px 24px;
                    background-color: #2A2D7C;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: background-color 0.3s;
                }
                
                .back-btn:hover {
                    background-color: #0489a8;
                }
                
                /* Success Message Styles */
                .success-message {
                    text-align: center;
                    max-width: 500px;
                    margin: 0 auto;
                }
                
                .success-message h3 {
                    color: #2A2D7C;
                    margin-bottom: 1rem;
                }
                
                .confirmation-details {
                    font-size: 1.1rem;
                    margin: 1.5rem 0;
                    padding: 1rem;
                    background-color: #f0f8ff;
                    border-radius: 4px;
                }
                
                .button-container {
                    margin-top: 1.5rem;
                }
                
                .primary-btn {
                    padding: 12px 24px;
                    background-color: #2A2D7C;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: background-color 0.3s;
                }
                
                .primary-btn:hover {
                    background-color: #1a1c52;
                }
                
                @media (max-width: 600px) {
                    .scheduler-container {
                        padding: 1rem;
                    }
                    
                    .time-slots-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    
                    .form-buttons {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .confirm-btn, .back-btn {
                        width: 100%;
                    }
                }

                .time-zone-selector {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    background: #f5f5f5;
                    padding: 10px 15px;
                    border-radius: 6px;
                }

                .time-zone-icon {
                    color: #2A2D7C;
                    margin-right: 10px;
                    font-size: 18px;
                }

                .time-zone-dropdown {
                    flex: 1;
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    background: white;
                    font-size: 14px;
                }

                @media (max-width: 600px) {
                    .time-zone-selector {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .time-zone-icon {
                        margin-bottom: 8px;
                    }
                    
                    .time-zone-dropdown {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default CalendarScheduler;