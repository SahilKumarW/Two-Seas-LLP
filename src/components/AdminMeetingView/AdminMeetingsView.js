import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaCalendarAlt, FaUser, FaClock, FaBuilding } from 'react-icons/fa';

const AdminMeetingsView = () => {
    const [meetings, setMeetings] = useState([]);
    const [filterDate, setFilterDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const startOfDay = new Date(filterDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(filterDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        const q = query(
            collection(db, 'meetings'),
            where('timestamp', '>=', startOfDay.toISOString()),
            where('timestamp', '<=', endOfDay.toISOString())
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const meetingsData = [];
            querySnapshot.forEach((doc) => {
                meetingsData.push({ id: doc.id, ...doc.data() });
            });
            setMeetings(meetingsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [filterDate]);

    // Prepare data for the chart
    const prepareChartData = () => {
        const hours = Array.from({ length: 24 }, (_, i) => i);
        return hours.map(hour => {
            const hourMeetings = meetings.filter(meeting => {
                const meetingHour = new Date(meeting.timestamp).getHours();
                return meetingHour === hour;
            });
            return {
                hour: `${hour}:00`,
                meetings: hourMeetings.length
            };
        });
    };

    return (
        <div className="admin-meetings-container">
            <h2><FaCalendarAlt /> Meeting Schedule</h2>
            
            <div className="date-filter">
                <label>Select Date: </label>
                <input 
                    type="date" 
                    value={filterDate.toISOString().split('T')[0]}
                    onChange={(e) => setFilterDate(new Date(e.target.value))}
                />
            </div>

            {loading ? (
                <p>Loading meetings...</p>
            ) : (
                <>
                    <div className="meetings-timeline">
                        <h3>Daily Overview</h3>
                        <div className="timeline-chart">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={prepareChartData()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="hour" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="meetings" fill="#06a3c2" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="meetings-list">
                        <h3>Scheduled Meetings</h3>
                        {meetings.length === 0 ? (
                            <p>No meetings scheduled for this date</p>
                        ) : (
                            <div className="meetings-grid">
                                {meetings.map(meeting => (
                                    <div key={meeting.id} className="meeting-card">
                                        <div className="meeting-time">
                                            <FaClock /> {new Date(meeting.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="meeting-details">
                                            <h4><FaUser /> {meeting.name}</h4>
                                            <p><FaBuilding /> {meeting.company || 'No company specified'}</p>
                                            <p>📧 {meeting.email}</p>
                                            <p>📞 {meeting.phone}</p>
                                            {meeting.details && (
                                                <div className="additional-details">
                                                    <p>ℹ️ {meeting.details}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            <style jsx>{`
                .admin-meetings-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: 'Arial', sans-serif;
                }
                
                .date-filter {
                    margin: 20px 0;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .date-filter input {
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
                
                .meetings-timeline {
                    background: white;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                
                .meetings-list {
                    background: white;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                
                .meetings-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }
                
                .meeting-card {
                    border: 1px solid #eee;
                    border-radius: 8px;
                    padding: 15px;
                    transition: all 0.3s;
                }
                
                .meeting-card:hover {
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    transform: translateY(-2px);
                }
                
                .meeting-time {
                    font-weight: bold;
                    color: #2A2D7C;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                
                .meeting-details h4 {
                    margin: 0 0 5px 0;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                
                .additional-details {
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid #eee;
                }
                
                @media (max-width: 768px) {
                    .meetings-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminMeetingsView;