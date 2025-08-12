import React from 'react';
import './WhatsAppChat.css'; // We'll create this next
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppChat = () => {
  const phoneNumber = '923349999780';
  const message = 'Hello Two Seas! I want to enquire about your services.'; // Default message

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="whatsapp-chat" onClick={handleClick}>
      <FaWhatsapp className="whatsapp-icon" />
    </div>
  );
};

export default WhatsAppChat;