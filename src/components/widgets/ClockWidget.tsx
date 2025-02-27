import React, { useState, useEffect } from 'react';
import './Widget.css';

const ClockWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="widget">
      <div className="widget-header">
        <h3 className="widget-title">Clock</h3>
      </div>
      <div className="widget-content">
        <div style={{ textAlign: 'center' }}>
          <h2>{formatTime(time)}</h2>
          <p>{formatDate(time)}</p>
        </div>
      </div>
    </div>
  );
};

export default ClockWidget;
