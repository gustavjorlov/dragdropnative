import React, { useState, useEffect } from 'react';
import './Widget.css';

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState({
    temperature: 22,
    condition: 'Sunny',
    location: 'Stockholm'
  });

  // In a real app, you would fetch weather data from an API
  useEffect(() => {
    // Simulate weather changes every 10 seconds
    const interval = setInterval(() => {
      const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Windy'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const randomTemp = Math.floor(Math.random() * 30) + 5; // 5-35°C
      
      setWeather(prev => ({
        ...prev,
        temperature: randomTemp,
        condition: randomCondition
      }));
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="widget">
      <div className="widget-header">
        <h3 className="widget-title">Weather</h3>
      </div>
      <div className="widget-content">
        <div style={{ textAlign: 'center' }}>
          <h2>{weather.temperature}°C</h2>
          <p>{weather.condition}</p>
          <p>{weather.location}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
