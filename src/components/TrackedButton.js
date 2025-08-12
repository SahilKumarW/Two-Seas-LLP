import { logEvent } from "firebase/analytics";
import { analytics } from '../firebase';

const TrackedButton = ({ actionName, children, onClick, ...props }) => {
  const handleClick = (e) => {
    logEvent(analytics, 'user_action', {
      action_type: 'button_click',
      action_name: actionName
    });
    if (onClick) onClick(e);
  };

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

export default TrackedButton;