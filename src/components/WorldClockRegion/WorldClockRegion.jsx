const WorldClockRegion = ({ title, clocks, removeClock, timeFormat }) => {
    const [timeFormat, setTimeFormat] = useState('12h'); // '12h' or '24h'
    if (clocks.length === 0) return null;

    return (
        <div className="world-clock-region">
            <div className="region-title">{title}</div>
            {clocks.map((clock, index) => (
                <div key={index} className="world-clock-item">
                    <div className="world-clock-city">
                        {clock.label.split(' (')[0].replace(/(America|Asia|Europe|Africa|Australia|Pacific|Atlantic)\//, '')}
                    </div>
                    <div className="world-clock-time">
                        {formatTime(clock.time, timeFormat)}
                    </div>
                    <button
                        className="remove-clock-btn"
                        onClick={() => removeClock(clock.timezone)}
                        title="Remove clock"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

const formatTime = (timeString, format) => {
    if (!timeString) return '--:-- --';
    if (format === '24h') {
        const [time, period] = timeString.split(' ');
        let [hours, minutes] = time.split(':');
        if (period === 'PM' && hours !== '12') {
            hours = String(Number(hours) + 12);
        }
        if (period === 'AM' && hours === '12') {
            hours = '00';
        }
        return `${hours}:${minutes}`;
    }
    return timeString;
};