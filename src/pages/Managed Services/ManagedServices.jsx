import React, { useState } from 'react';
import './ManagedServices.css';

const ManagedServices = () => {
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [showWorkforce, setShowWorkforce] = useState(false);

    const teams = [
        { id: 1, name: 'Tecno Chiefs' },
        { id: 2, name: 'Tecno Aynata' },
        { id: 3, name: 'Tecno America' }
    ];

    const workforceData = {
        1: [
            {
                id: 101,
                name: 'Usman',
                expertise: 'HR Recruitment',
                experience: '3 years',
                image: 'https://randomuser.me/api/portraits/men/32.jpg',
                description: 'Specialized in technical recruitment and talent acquisition for IT roles.'
            },
            {
                id: 102,
                name: 'Priya',
                expertise: 'Technical Screening',
                experience: '2 years',
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                description: 'Expert in conducting technical interviews and candidate evaluation.'
            }
        ],
        2: [
            {
                id: 201,
                name: 'Rahul',
                expertise: 'IT Recruitment',
                experience: '4 years',
                image: 'https://randomuser.me/api/portraits/men/22.jpg',
                description: 'Focuses on hiring for cloud computing and DevOps positions.'
            }
        ],
        3: [
            {
                id: 301,
                name: 'Neha',
                expertise: 'Campus Recruitment',
                experience: '1.5 years',
                image: 'https://randomuser.me/api/portraits/women/33.jpg',
                description: 'Handles fresh graduate hiring and university relations.'
            },
            {
                id: 302,
                name: 'Amit',
                expertise: 'Leadership Hiring',
                experience: '5 years',
                image: 'https://randomuser.me/api/portraits/men/45.jpg',
                description: 'Specializes in executive search and C-level placements.'
            }
        ]
    };

    const handleTeamClick = (teamId) => {
        setSelectedTeam(teamId);
        setShowWorkforce(true);
    };

    const handleBackClick = () => {
        setShowWorkforce(false);
        setSelectedTeam(null);
    };

    return (
        <div className="team-workforce-page">
            {!showWorkforce ? (
                <>
                    <div className="page-header">
                        <h1>Managed Services Teams</h1>
                    </div>

                    <div className="teams-grid">
                        {teams.map((team) => (
                            <div
                                key={team.id}
                                className="team-card"
                                onClick={() => handleTeamClick(team.id)}
                            >
                                <h2>{team.name}</h2>
                                <div className="team-hover-content">
                                    <span>Click to view workforce</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div className="workforce-header">
                        <button className="back-button" onClick={handleBackClick}>
                            &larr; Back to Teams
                        </button>
                        <h1>{teams.find(t => t.id === selectedTeam)?.name} Workforce</h1>
                    </div>

                    <div className="workforce-grid">
                        {workforceData[selectedTeam]?.map((member) => (
                            <div key={member.id} className="member-card">
                                <div className="member-header">
                                    <img src={member.image} alt={member.name} className="member-image" />
                                    <div className="member-info">
                                        <h2>{member.name}</h2>
                                        <div className="member-details">
                                            <span><strong>Expertise:</strong> {member.expertise}</span>
                                            <span><strong>Experience:</strong> {member.experience}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="member-description">
                                    <p>{member.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ManagedServices;