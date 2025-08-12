import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logEvent } from "firebase/analytics";
import { analytics } from '../firebase';

const Tracking = ({ children }) => {
  const location = useLocation();

  // Track page views and time spent
  useEffect(() => {
    // Track initial page view
    logEvent(analytics, 'page_view', {
      page_title: document.title,
      page_path: window.location.pathname
    });

    // Time tracking setup
    const startTime = new Date();
    
    const handleBeforeUnload = () => {
      const endTime = new Date();
      const timeSpent = (endTime - startTime) / 1000;
      
      logEvent(analytics, 'time_spent', {
        page_title: document.title,
        duration: timeSpent
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Track route changes
  useEffect(() => {
    logEvent(analytics, 'page_view', {
      page_title: document.title,
      page_path: location.pathname
    });
  }, [location]);

  // Track location data
  useEffect(() => {
    const trackLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const locationData = await response.json();
        
        logEvent(analytics, 'location_data', {
          country: locationData.country_name,
          city: locationData.city,
          region: locationData.region
        });
      } catch (error) {
        console.error("Location tracking error:", error);
      }
    };
    
    trackLocation();
  }, []);

  return children;
};

export default Tracking;