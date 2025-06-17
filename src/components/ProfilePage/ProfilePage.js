import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import defaultProfileImage from '../../assets/admin.jpg';
import './ProfilePage.css';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        // First check localStorage
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const savedAdmin = JSON.parse(localStorage.getItem('adminData'));
        
        // Combine potential sources
        const allCandidates = [...savedWishlist];
        if (savedAdmin) allCandidates.push(savedAdmin);

        const foundCandidate = allCandidates.find(c => c.id === id);
        
        if (foundCandidate) {
          setCandidate({
            ...foundCandidate,
            image: foundCandidate.image || defaultProfileImage
          });
        } else {
          // As a fallback, try to get from session state
          const sessionCandidate = sessionStorage.getItem(`candidate-${id}`);
          if (sessionCandidate) {
            setCandidate(JSON.parse(sessionCandidate));
          } else {
            navigate('/not-found', { replace: true });
          }
        }
      } catch (error) {
        console.error('Error loading candidate:', error);
        navigate('/error', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id, navigate]);

  if (loading) return <div className="loading-spinner">Loading profile...</div>;

  return (
    <div className="profile-container">
      {candidate ? (
        <>
          <div className="profile-header">
            <img 
              src={candidate.image} 
              alt={candidate.name} 
              className="profile-image"
            />
            <div className="profile-info">
              <h1>{candidate.name}</h1>
              <h2>{candidate.expertise}</h2>
              <p className="rate">
                {candidate.currency === 'USD' ? '$' : 
                 candidate.currency === 'GBP' ? '£' : 
                 candidate.currency === 'EUR' ? '€' : 'Rs'}
                {candidate.rate}/hr
              </p>
            </div>
          </div>
          <div className="profile-details">
            <h3>About</h3>
            <p>{candidate.intro || 'No introduction available'}</p>
          </div>
        </>
      ) : (
        <div className="not-found-message">
          <p>Candidate data not available</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;