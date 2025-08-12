import React, { useState, useEffect } from 'react';
import {
    blockTimeSlot,
    unblockTimeSlot,
    getBlockedSlotsForDate
} from '../../services/blockedSlotsService';
import { timeZones } from '../CalendarScheduler';
import { format, parseISO } from 'date-fns';
import { FaCalendarAlt, FaClock, FaTimes, FaGlobe, FaSpinner } from 'react-icons/fa';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // adjust the path to your firebase.js config

const BlockedSlotsManager = ({ date }) => {
    const [blockedSlots, setBlockedSlots] = useState([]);
    const [newBlock, setNewBlock] = useState({
        date: date || '', // Initialize with passed date if available
        time: '',
        timeZone: 'America/New_York',
        reason: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!date) return;

        // Function to fetch blocked slots
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

        fetchBlockedSlots();
    }, [date]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBlock(prev => ({
            ...prev,
            [name]: name === 'time' ? `${value}:00` : value
        }));
    };

    const handleAddBlock = async () => {
        if (!newBlock.date || !newBlock.time) {
            setError('Please select both date and time');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            await blockTimeSlot(
                newBlock.date,
                newBlock.time,
                newBlock.timeZone,
                newBlock.reason
            );

            // Refresh the list
            const slots = await getBlockedSlotsForDate(newBlock.date);
            setBlockedSlots(slots);

            // Reset form but keep date if it was passed as prop
            setNewBlock(prev => ({
                date: date || '',
                time: '',
                timeZone: 'America/New_York',
                reason: ''
            }));
        } catch (err) {
            setError(err.message || 'Failed to block time slot');
            console.error('Detailed error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveBlock = async (slotId) => {
        try {
            await unblockTimeSlot(slotId);
            const slots = await getBlockedSlotsForDate(newBlock.date || date);
            setBlockedSlots(slots);
        } catch (err) {
            setError('Failed to unblock time slot. Please try again.');
            console.error('Detailed error:', err);
        }
    };

    const formatSlotDate = (dateString) => {
        try {
            return format(parseISO(dateString), 'MMM dd, yyyy');
        } catch {
            return dateString;
        }
    };

    return (
        <div className="blocked-slots-manager">
            <h2>Manage Your Availability</h2>
            <p>Block time slots when you're unavailable for appointments</p>

            <div className="add-block-form">
                <div className="form-group">
                    <label>
                        <FaCalendarAlt /> Date
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={newBlock.date}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>
                        <FaClock /> Time
                    </label>
                    <select
                        name="time"
                        value={newBlock.time}
                        onChange={handleInputChange}
                        required
                        className="hour-select"
                    >
                        <option value="">Select time</option>
                        {Array.from({ length: 8 }, (_, i) => {
                            const hour24 = 9 + i; // 9 AM start
                            const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12; // Convert to 12h
                            const ampm = hour24 < 12 ? "AM" : "PM";
                            return (
                                <option key={hour24} value={`${String(hour24).padStart(2, "0")}:00`}>
                                    {`${hour12}:00 ${ampm}`}
                                </option>
                            );
                        })}
                    </select>

                </div>

                <div className="form-group">
                    <label>
                        <FaGlobe /> Time Zone
                    </label>
                    <select
                        name="timeZone"
                        value={newBlock.timeZone}
                        onChange={handleInputChange}
                    >
                        {timeZones.map(zone => (
                            <option key={zone.value} value={zone.value}>
                                {zone.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Reason (Optional)</label>
                    <input
                        type="text"
                        name="reason"
                        value={newBlock.reason}
                        onChange={handleInputChange}
                        placeholder="E.g., Vacation, Meeting"
                    />
                </div>

                <button
                    onClick={handleAddBlock}
                    disabled={!newBlock.date || !newBlock.time}
                >
                    Block Time Slot
                </button>
            </div>

            <div className="blocked-slots-list">
                <h3>Your Blocked Time Slots</h3>
                {isLoading ? (
                    <p>Loading...</p>
                ) : blockedSlots.length === 0 ? (
                    <p>No blocked time slots</p>
                ) : (
                    <ul>
                        {blockedSlots.map(slot => {
                            // Parse date
                            const dateObj = new Date(slot.date); // slot.time is YYYY-MM-DD string
                            const day = String(dateObj.getDate()).padStart(2, "0");
                            const month = dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase();
                            const year = dateObj.getFullYear();

                            // Parse time (HH:mm)
                            let [hour, minute] = slot.time.split(":");
                            hour = parseInt(hour, 10);
                            const ampm = hour >= 12 ? "PM" : "AM";
                            const hour12 = hour % 12 === 0 ? 12 : hour % 12;
                            const formattedTime = `${String(hour12).padStart(2, "0")}:${minute} ${ampm}`;

                            return (
                                <li key={slot.id}>
                                    <div className="slot-info">
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "black", fontWeight: "bold" }}>
                                            <span>{`${day} ${month} ${year}`}</span>
                                            <span>-</span>
                                            <span>{formattedTime}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => handleRemoveBlock(slot.id)} className="remove-btn">
                                        Unblock
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            <style jsx>{`
        .blocked-slots-manager {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Arial', sans-serif;
        }
        
        h2, h3 {
          color: #2A2D7C;
        }
        
        .add-block-form {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
        }
        
        .form-group {
          margin-bottom: 0;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #333;
        }
        
        .form-group input, 
        .form-group select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        button {
          background-color: #2A2D7C;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          align-self: flex-end;
        }
        
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        
        .blocked-slots-list ul {
          list-style: none;
          padding: 0;
        }
        
        .blocked-slots-list li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #eee;
        }
        
        .slot-info {
          flex-grow: 1;
        }
        
        .date {
          font-weight: bold;
          margin-right: 10px;
        }
        
        .reason {
          color: #666;
          font-style: italic;
        }
        
        .remove-btn {
          color: white;
          border: none;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        
        @media (max-width: 600px) {
          .add-block-form {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default BlockedSlotsManager;