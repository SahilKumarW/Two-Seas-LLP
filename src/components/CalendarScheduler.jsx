import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaClock, FaGlobe } from 'react-icons/fa';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { niches } from '../pages/AdminDashboard/constants';
import { getBlockedSlots } from '../services/blockedSlotsService';
import { Timestamp } from 'firebase/firestore';
import { FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { checkSlotAvailability } from '../services/blockedSlotsService';
import { getBlockedSlotsForDate } from '../services/blockedSlotsService';
import { query, where, getDocs } from "firebase/firestore";
import emailjs from 'emailjs-com';

// Add near the top of your component
const EMAILJS_SERVICE_ID = 'service_wjrb0qk';
const EMAILJS_TEMPLATE_ID = 'template_177shrs';
const EMAILJS_PUBLIC_KEY = 'vkVckeGL1JQx-x4_q';

export const timeZones = [
    { value: 'Pacific/Midway', label: '(GMT-11:00) Midway Island' },
    { value: 'Pacific/Honolulu', label: '(GMT-10:00) Hawaii' },
    { value: 'America/Anchorage', label: '(GMT-09:00) Alaska' },
    { value: 'America/Los_Angeles', label: '(GMT-08:00) Pacific Time (US & Canada)' },
    { value: 'America/Denver', label: '(GMT-07:00) Mountain Time (US & Canada)' },
    { value: 'America/Chicago', label: '(GMT-06:00) Central Time (US & Canada)' },
    { value: 'America/New_York', label: '(GMT-05:00) Eastern Time (US & Canada)' },
    { value: 'America/Caracas', label: '(GMT-04:30) Caracas' },
    { value: 'America/Halifax', label: '(GMT-04:00) Atlantic Time (Canada)' },
    { value: 'America/St_Johns', label: '(GMT-03:30) Newfoundland' },
    { value: 'America/Argentina/Buenos_Aires', label: '(GMT-03:00) Buenos Aires' },
    { value: 'Atlantic/Azores', label: '(GMT-01:00) Azores' },
    { value: 'Europe/London', label: '(GMT+00:00) London' },
    { value: 'Europe/Berlin', label: '(GMT+01:00) Berlin' },
    { value: 'Europe/Helsinki', label: '(GMT+02:00) Helsinki' },
    { value: 'Asia/Baghdad', label: '(GMT+03:00) Baghdad' },
    { value: 'Asia/Tehran', label: '(GMT+03:30) Tehran' },
    { value: 'Asia/Dubai', label: '(GMT+04:00) Dubai' },
    { value: 'Asia/Karachi', label: '(GMT+05:00) Karachi' },
    { value: 'Asia/Kolkata', label: '(GMT+05:30) Kolkata' },
    { value: 'Asia/Dhaka', label: '(GMT+06:00) Dhaka' },
    { value: 'Asia/Bangkok', label: '(GMT+07:00) Bangkok' },
    { value: 'Asia/Shanghai', label: '(GMT+08:00) Beijing' },
    { value: 'Asia/Tokyo', label: '(GMT+09:00) Tokyo' },
    { value: 'Australia/Sydney', label: '(GMT+10:00) Sydney' },
    { value: 'Pacific/Auckland', label: '(GMT+12:00) Auckland' },
];

// const timeZones = [
//     // USA Time Zones
//     { value: 'GMT-10:00', label: 'GMT-10:00 (Hawaii-Aleutian Time)' },
//     { value: 'GMT-08:00', label: 'GMT-08:00 (Pacific Time - US & Canada)' },
//     { value: 'GMT-07:00', label: 'GMT-07:00 (Mountain Time - US & Canada)' },
//     { value: 'GMT-06:00', label: 'GMT-06:00 (Central Time - US & Canada)' },
//     { value: 'GMT-05:00', label: 'GMT-05:00 (Eastern Time - US & Canada)' },

//     // UK
//     { value: 'GMT+00:00', label: 'GMT+00:00 (London, UK)' },

//     // Pakistan
//     { value: 'GMT+05:00', label: 'GMT+05:00 (Pakistan Standard Time)' },

//     // UAE
//     { value: 'GMT+04:00', label: 'GMT+04:00 (Dubai, UAE)' },

//     // Australia
//     { value: 'GMT+08:00', label: 'GMT+08:00 (Western Australia)' },
//     { value: 'GMT+09:30', label: 'GMT+09:30 (Central Australia)' },
//     { value: 'GMT+10:00', label: 'GMT+10:00 (Eastern Australia)' }
// ];

const CalendarScheduler = ({
    onDateSelected,
    onScheduleSubmit,
    unavailableDates = [],
    title = "Schedule a Meeting",
    submitButtonText = "Send Appointment Request",
    successMessage = "We'll contact you shortly to confirm your appointment.",
    workingHours = { start: 9, end: 16 } // 9 AM to 4 PM
}) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedTimeZone, setSelectedTimeZone] = useState('Asia/Karachi');
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [currentTime, setCurrentTime] = useState('');
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
    const [blockedTimes, setBlockedTimes] = useState([]);
    const [blockedSlots, setBlockedSlots] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);

    const detectUserLocation = async () => {
        setIsDetectingLocation(true);
        try {
            // First try IP-based location
            const ipResponse = await fetch('https://ipapi.co/json/');
            const ipData = await ipResponse.json();

            setUserLocation({
                country: ipData.country_name,
                city: ipData.city,
                region: ipData.region,
                timezone: ipData.timezone,
                source: 'ip'
            });

            // If we got a timezone from IP, set it
            if (ipData.timezone && timeZones.some(tz => tz.value === ipData.timezone)) {
                setSelectedTimeZone(ipData.timezone);
            }

        } catch (error) {
            console.error("Error detecting location:", error);
            // Fallback to browser timezone
            const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            setUserLocation({
                timezone: browserTimezone,
                source: 'browser'
            });

            if (browserTimezone && timeZones.some(tz => tz.value === browserTimezone)) {
                setSelectedTimeZone(browserTimezone);
            }
        } finally {
            setIsDetectingLocation(false);
        }
    };

    useEffect(() => {
        detectUserLocation();
    }, []);

    useEffect(() => {
        if (selectedTimeZone) {
            const updateClock = () => {
                try {
                    const now = new Date();
                    const formatter = new Intl.DateTimeFormat("en-US", {
                        timeZone: selectedTimeZone,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    });
                    setCurrentTime(formatter.format(now));
                } catch (error) {
                    console.error("Invalid time zone:", selectedTimeZone, error);
                }
            };

            updateClock(); // initial
            const timer = setInterval(updateClock, 1000);
            return () => clearInterval(timer);
        }
    }, [selectedTimeZone]);


    const convertTimeToTimezone = (time, fromTimezone, toTimezone) => {
        // Create a date object with the current date and selected time
        const date = new Date();
        const [timePart, period] = time.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);

        // Convert to 24-hour format
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        // Set the time on the date object (using the from timezone)
        date.setHours(hours, minutes || 0, 0, 0);

        // Format in the target timezone
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: toTimezone
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

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

    // Update the isDateDisabled function to check blocked slots
    const isDateDisabled = (date) => {
        if (!date) return true;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date < today) return true;

        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) return true;

        const dateString = date.toISOString().split('T')[0];
        if (unavailableDates.includes(dateString)) return true;

        // Check if all time slots are blocked for this date
        const dateBlockedSlots = blockedSlots.filter(slot => slot.date === dateString);
        if (dateBlockedSlots.length > 0) {
            const allSlots = generateTimeSlots(date, selectedTimeZone);
            return dateBlockedSlots.length >= allSlots.length;
        }

        return false;
    };

    // Helper function to format date as YYYY-MM-DD in local timezone
    const formatDateLocal = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const generateTimeSlots = async (date, timeZone = selectedTimeZone) => {
        const slots = [];
        const startHour = 9; // 9 AM
        const endHour = 16;  // 4 PM

        // Get date in YYYY-MM-DD format in LOCAL timezone
        const dateString = formatDateLocal(date);
        console.log(`Generating slots for LOCAL date: ${dateString} in timezone ${timeZone}`);

        try {
            // Get blocked slots for this date
            const blockedSlotsForDate = await getBlockedSlotsForDate(dateString);

            // Generate all possible time slots
            for (let hour = startHour; hour <= endHour; hour++) {
                const time24 = `${hour.toString().padStart(2, '0')}:00:00`;
                const time12 = new Date(date);
                time12.setHours(hour, 0, 0, 0);

                // Use the selected timezone for display
                const displayTime = time12.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: timeZone // Use the passed timezone
                });

                // Check if this slot is blocked
                const isBlocked = blockedSlotsForDate.some(
                    slot => slot.time === time24
                );

                slots.push({
                    systemTime: time24,
                    displayTime: displayTime,
                    isAvailable: !isBlocked
                });
            }
        } catch (error) {
            console.error('Error generating slots:', error);
            // Fallback - return all slots as available
            for (let hour = startHour; hour <= endHour; hour++) {
                const time12 = new Date(date);
                time12.setHours(hour, 0, 0, 0);
                slots.push({
                    systemTime: `${hour.toString().padStart(2, '0')}:00:00`,
                    displayTime: time12.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: timeZone // Use the passed timezone
                    }),
                    isAvailable: true
                });
            }
        }

        return slots;
    };

    // Modified date click handler to fetch blocked slots
    const handleDateClick = async (date) => {
        if (isDateDisabled(date)) return;

        setSelectedDate(date);
        setSelectedTime(null);
        setIsSuccess(false);

        // Generate time slots with current timezone
        const slots = await generateTimeSlots(date, selectedTimeZone);
        setTimeSlots(slots);

        if (onDateSelected) {
            onDateSelected(formatDateLocal(date));
        }
    };

    const handleTimeZoneChange = async (e) => {
        const newTimeZone = e.target.value;
        setSelectedTimeZone(newTimeZone);

        if (selectedDate) {
            // Regenerate slots with the new timezone
            const slots = await generateTimeSlots(selectedDate, newTimeZone);
            setTimeSlots(slots);
        }
    };

    const handleTimeClick = (time) => {
        setSelectedTime(time);
    };


    // Add Firestore meeting submission
    const submitMeetingToFirestore = async (meetingData) => {
        try {
            const docRef = await addDoc(collection(db, 'meetings'), {
                ...meetingData,
                createdAt: serverTimestamp(),
                status: 'pending',
                timestamp: new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    parseInt(selectedTime.split(':')[0]) + (selectedTime.includes('PM') ? 12 : 0),
                    0, 0, 0
                ).toISOString()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding meeting: ', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validate required fields including email format
            if (!userDetails.name || !userDetails.email || !userDetails.phone) {
                throw new Error('Please fill in all required fields');
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userDetails.email)) {
                throw new Error('Please enter a valid email address');
            }


            // Prepare meeting data
            const meetingHour = parseInt(selectedTime.split(':')[0]);
            const meetingMinutes = parseInt(selectedTime.split(':')[1].split(' ')[0]);
            const isPM = selectedTime.includes('PM');

            const meetingData = {
                ...userDetails,
                appointmentDate: selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                appointmentTime: selectedTime,
                timeZone: selectedTimeZone,
                timestamp: new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    isPM && meetingHour !== 12 ? meetingHour + 12 : meetingHour,
                    meetingMinutes,
                    0,
                    0
                ).toISOString(),
                status: 'pending',
                createdAt: serverTimestamp()
            };

            console.log('Submitting meeting:', meetingData); // Debug log

            // Submit to Firestore
            const docRef = await addDoc(collection(db, 'meetings'), meetingData);
            console.log('Meeting submitted with ID:', docRef.id);

            // Send confirmation email
            const sendConfirmationEmail = async (data) => {
                try {
                    // Verify email exists (double-check even though logs show it)
                    if (!data.email || !data.email.includes('@')) {
                        throw new Error('Invalid email address');
                    }

                    const templateParams = {
                        to_name: data.name,
                        to_email: data.email,  // Must match {{to_email}} in template
                        appointment_date: data.date,
                        appointment_time: data.time,
                        timezone: data.timezone,
                        from_name: 'Two Seas',  // Added sender name
                        reply_to: 'support@twoseas.org'  // For reply handling
                    };

                    console.log('Final email params:', templateParams);

                    const response = await emailjs.send(
                        EMAILJS_SERVICE_ID,
                        EMAILJS_TEMPLATE_ID,
                        templateParams,
                        EMAILJS_PUBLIC_KEY
                    );

                    console.log('Email successfully sent:', response.status);
                    return true;
                } catch (error) {
                    console.error('EmailJS error details:', {
                        status: error.status,
                        text: error.text,
                        fullError: error
                    });
                    return false;
                }
            };

            console.log('Before email send - data:', {
                name: userDetails.name,
                email: userDetails.email,
                date: formatDateDisplay(selectedDate),
                time: convertTimeToTimezone(selectedTime, 'Asia/Karachi', selectedTimeZone),
                timezone: selectedTimeZone
            });

            const emailSent = await sendConfirmationEmail({
                name: userDetails.name,
                email: userDetails.email,
                date: formatDateDisplay(selectedDate),
                time: convertTimeToTimezone(selectedTime, 'Asia/Karachi', selectedTimeZone),
                timezone: selectedTimeZone
            });

            console.log('Email send result:', emailSent);

            // Clear form on success
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
            console.error('Detailed error:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            alert(`Failed to schedule appointment: ${error.message}`);
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

    // Function to fetch blocked slots
    async function fetchBlockedSlotsForDate(selectedDate) {
        const q = query(
            collection(db, "blockedSlots"),
            where("date", "==", selectedDate)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data());
    }

    function normalizeTime(t) {
        return t.length === 5 ? t + ":00" : t; // ensures HH:mm:ss
    }

    const fetchBlockedSlots = async (date) => {
        try {
            const blockedRef = collection(db, "blockedSlots");
            const q = query(blockedRef, where("date", "==", date));
            const snapshot = await getDocs(q);
            // Return array of blocked times e.g. ["09:00:00", "13:00:00"]
            return snapshot.docs.map(doc => doc.data().time);
        } catch (error) {
            console.error("Error fetching blocked slots:", error);
            return [];
        }
    };

    useEffect(() => {
        if (!selectedDate) return;

        const formattedDate = selectedDate.toISOString().split("T")[0]; // 'YYYY-MM-DD'

        fetchBlockedSlots(formattedDate).then(blocked => {
            setBlockedSlots(blocked);
        });
    }, [selectedDate]);

    function isBlocked(time) {
        return blockedTimes.includes(normalizeTime(time));
    }

    return (
        <div className="calendar-scheduler">
            <div className="scheduler-header">
                <h2 style={{ color: '#06a3c2', marginTop: '1.5rem'}}>{title}</h2>
                <div className="header-divider"></div>
            </div>

            <div className="scheduler-container" style={{marginBottom: '2rem'}}>
                <div className="scheduler-card">
                    {!selectedDate ? (
                        // Calendar View
                        <div className="calendar-view">
                            {/* Calendar Icon (now above the month navigation) */}
                            <div className="scheduler-icon">
                                <FaCalendarAlt />
                            </div>
                            {/* Fixed Header */}
                            <div className="calendar-header-fixed">
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
                            </div>

                            {/* Scrollable Calendar Grid */}
                            <div className="calendar-grid-container">
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
                        // Time Slot Selection

                        <div className="time-slot-view">
                            <div className="time-zone-selector">
                                <FaGlobe className="time-zone-icon" />
                                {userLocation && (
                                    <span className="detected-location">
                                        {userLocation.city && `${userLocation.city}, `}
                                        {userLocation.country || userLocation.timezone}
                                    </span>
                                )}
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
                                {isDetectingLocation && <FaSpinner className="spinner" />}
                            </div>

                            <h3>Select a Time Slot</h3>
                            <p className="selected-date">{formatDateDisplay(selectedDate)}</p>
                            <div className="current-time-display">
                                <FaClock /> Current time in {selectedTimeZone}: <strong>{currentTime}</strong>
                            </div>

                            <div className="time-slots-grid">
                                {timeSlots.length > 0 ? (
                                    timeSlots.map((slot, index) => (
                                        <button
                                            key={index}
                                            className={`time-slot-btn ${!slot.isAvailable ? 'blocked' : ''}`}
                                            disabled={!slot.isAvailable}
                                            onClick={() => slot.isAvailable && handleTimeClick(slot.systemTime)}
                                        >
                                            {slot.displayTime}
                                            {!slot.isAvailable && (
                                                <span className="blocked-label">Booked</span>
                                            )}
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
                        // Success Message
                        <div className="success-message">
                            <h3>Appointment Request Sent!</h3>
                            <p>Your appointment request has been sent for:</p>
                            <p className="confirmation-details">
                                <strong>{formatDateDisplay(selectedDate)}</strong>
                                {selectedTime && <>, <strong>
                                    {convertTimeToTimezone(
                                        selectedTime,
                                        'GMT+05:00',
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
                                    'Asia/Karachi', // Use the actual timezone identifier
                                    selectedTimeZone
                                )}`}
                                {selectedTimeZone && ` (${timeZones.find(tz => tz.value === selectedTimeZone)?.label || selectedTimeZone})`}
                            </p>

                            {/* Add notification area */}
                            {error && (
                                <div className="error-notification">
                                    <FaExclamationTriangle /> {error}
                                </div>
                            )}

                            <div className="form-scroll-container">
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
                                            minLength="2"
                                            maxLength="50"
                                        />
                                        {errors.name && <span className="error-text">{errors.name}</span>}
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
                                            pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                                        />
                                        {errors.email && <span className="error-text">{errors.email}</span>}
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
                                            pattern="[0-9]{10,15}"
                                            title="Please enter a valid phone number"
                                        />
                                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="company">Company Name</label>
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            value={userDetails.company}
                                            onChange={handleInputChange}
                                            maxLength="50"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="website">Company Website</label>
                                        <input
                                            type="url"
                                            id="website"
                                            name="website"
                                            value={userDetails.website}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com"
                                            pattern="https?://.+"
                                        />
                                        {errors.website && <span className="error-text">{errors.website}</span>}
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
                                        {errors.niche && <span className="error-text">{errors.niche}</span>}
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
                                            maxLength="500"
                                        />
                                    </div>
                                </form>
                            </div>

                            <div className="form-buttons">
                                <button
                                    type="submit"
                                    className="confirm-btn"
                                    disabled={isSubmitting}
                                    onClick={handleSubmit}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FaSpinner className="spinner" /> Sending...
                                        </>
                                    ) : (
                                        submitButtonText
                                    )}
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
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
            .time-slot-btn.blocked {
    background-color: #f8d7da;
    color: #721c24;
    cursor: not-allowed;
    position: relative;
}

.time-slot-btn.blocked:hover {
    background-color: #f8d7da;
}

.blocked-label {
    display: block;
    font-size: 0.7em;
    color: #dc3545;
    margin-top: 4px;
}

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
                    display: flex;
                    flex-direction: column;
                    height: auto; /* Remove fixed height */
                    min-height: 400px; /* Set a minimum height */
                }
                
                .calendar-header-fixed {
                    position: sticky;
                    top: 0;
                    background: white;
                    z-index: 10;
                    padding: 10px 0;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .calendar-header {
                    display: flex;
                    align-items: center;      /* vertical center */
                    justify-content: center;  /* horizontal center */
                    gap: 15px;
                    flex-grow: 1;
                }
                
                .calendar-header h3 {
                    margin: 0;
                    color: #2A2D7C;
                    font-size: 1.2rem;
                    white-space: nowrap;
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
                
                .calendar-grid-container {
                    overflow: visible; /* Change from auto to visible */
                    flex-grow: 1; /* Allow it to expand */
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
                    position: sticky;
                    top: 60px; /* Below the header */
                    background: white;
                    z-index: 9;
                }
                
                .day-name {
                    padding: 0.5rem;
                    min-width: 40px;
                }
                
                .days-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 5px;
                    min-width: 300px;
                    flex-grow: 1; /* Allow the grid to expand */
                    grid-auto-rows: 1fr; /* Make all rows equal height */
                }
                
                .day-cell {
                    min-height: 50px; /* Increased minimum height */
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                    padding: 0.2rem;
                    aspect-ratio: 1; /* Keep cells square */
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
                    font-size: 0.9rem;
                    font-weight: bold;
                }

                /* Calendar View Styles */
.calendar-view {
    max-width: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
}

.calendar-grid-container {
    overflow-x: auto; /* Enable horizontal scrolling */
    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
    width: 100%;
}

.day-names {
    display: grid;
    grid-template-columns: repeat(7, minmax(40px, 1fr));
    text-align: center;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #2A2D7C;
    position: sticky;
    left: 0; /* Keep day names visible when scrolling */
    background: white;
    min-width: 280px; /* Minimum width to prevent squeezing */
}

.days-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(40px, 1fr));
    gap: 5px;
    min-width: 280px; /* Same as day names to align properly */
}

.day-cell {
    min-height: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    padding: 0.2rem;
    aspect-ratio: 1;
}

.current-time-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* space between icon and text */
  font-size: 1rem;
  margin-bottom: 16px; /* space beneath */
  padding: 10px 14px;
  background-color: #f9f9f9; /* light background for visibility */
  border: 1px solid #ddd;
  border-radius: 8px;
  color: #333;
}

.current-time-display strong {
  color: #2A2D7C; /* highlight the time */
  font-weight: bold;
}

/* Mobile-specific styles */
@media (max-width: 600px) {
    .calendar-view {
        max-width: 100%;
    }
    
    .calendar-grid-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
    
    .day-names {
        grid-template-columns: repeat(7, 60px); /* Fixed width for mobile */
        min-width: 420px; /* 7 columns * 60px */
    }
    
    .days-grid {
        grid-template-columns: repeat(7, 60px); /* Fixed width for mobile */
        min-width: 420px; /* 7 columns * 60px */
    }
    
    .day-cell {
        min-height: 60px; /* Larger tap target for mobile */
    }
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
    display: flex;
    flex-direction: column;
    height: 100%; /* or specific height like 500px */
    max-height: 80vh; /* limits the maximum height to 80% of viewport */
    position: relative;
}

.selected-slot {
    font-size: 1.1rem;
    color: #2A2D7C;
    margin-bottom: 1.5rem;
    text-align: center;
    font-weight: bold;
    flex-shrink: 0; /* prevents this element from shrinking */
}

.form-scroll-container {
    flex-grow: 1;
    overflow-y: auto;
    padding-right: 8px; /* prevents scrollbar from overlapping content */
    margin-bottom: 15px;
}

/* Custom scrollbar styling */
.form-scroll-container::-webkit-scrollbar {
    width: 6px;
}

.form-scroll-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.form-scroll-container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}

.form-scroll-container::-webkit-scrollbar-thumb:hover {
    background: #555;
}

.form-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: auto; /* pushes buttons to bottom */
    padding-top: 15px;
    flex-shrink: 0; /* prevents buttons from shrinking */
    border-top: 1px solid #eee;
}

/* For mobile responsiveness */
@media (max-width: 600px) {
    .appointment-form-container {
        max-height: 70vh;
    }
    
    .form-buttons {
        flex-direction: column;
        gap: 10px;
    }
    
    .confirm-btn, .back-btn {
        width: 100%;
    }
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
                
                .time-zone-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  background: #f5f5f5;
  padding: 10px 15px;
  border-radius: 6px;
}

.detected-location {
  font-size: 0.9rem;
  color: #2A2D7C;
  margin-right: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.time-zone-dropdown {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  min-width: 200px;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
                
                /* Mobile Responsive Styles */
                @media (max-width: 600px) {
                    .scheduler-container {
                        padding: 1rem;
                    }
                    
                    .calendar-header-fixed {
                        padding: 8px 0;
                    }
                    
                    .calendar-header h3 {
                        font-size: 1rem;
                    }
                    
                    .month-nav-btn {
                        padding: 5px;
                    }
                    
                    .day-names {
                        top: 50px;
                        font-size: 0.8rem;
                    }
                    
                    .day-cell {
                        min-height: 35px;
                    }
                    
                    .day-number {
                        font-size: 0.8rem;
                    }
                    
                    .booked-indicator {
                        font-size: 0.5rem;
                    }
                    
                    .time-slots-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    
                    .time-slot-btn {
                        padding: 8px;
                        font-size: 0.8rem;
                    }
                    
                    .time-slot-btn.blocked {
    background-color: #f8d7da;
    color: #721c24;
    cursor: not-allowed;
    position: relative;
}

.time-slot-btn.blocked:hover {
    background-color: #f8d7da;
}

.blocked-label {
    display: block;
    font-size: 0.7em;
    color: #dc3545;
}
                    .form-buttons {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .confirm-btn, .back-btn {
                        width: 100%;
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