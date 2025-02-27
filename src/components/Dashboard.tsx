import React from "react";
import WeatherWidget from "./widgets/WeatherWidget.tsx";
import ClockWidget from "./widgets/ClockWidget.tsx";
import TodoWidget from "./widgets/TodoWidget.tsx";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="widgets-container">
        <WeatherWidget />
        <ClockWidget />
        <TodoWidget />
      </div>
    </div>
  );
};

export default Dashboard;
