import React, { useState, useEffect } from "react";
import WeatherWidget from "./widgets/WeatherWidget.tsx";
import ClockWidget from "./widgets/ClockWidget.tsx";
import TodoWidget from "./widgets/TodoWidget.tsx";
import "./Dashboard.css";

// Define widget types for our array
type WidgetType = "weather" | "clock" | "todo";

interface WidgetItem {
  id: string;
  type: WidgetType;
}

const Dashboard: React.FC = () => {
  // Default widget configuration
  const defaultWidgets: WidgetItem[] = [
    { id: "widget-1", type: "weather" },
    { id: "widget-2", type: "clock" },
    { id: "widget-3", type: "todo" }
  ];
  
  // Store widgets in state array for reordering
  const [widgets, setWidgets] = useState<WidgetItem[]>(() => {
    // Try to load saved widget order from localStorage
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    return savedWidgets ? JSON.parse(savedWidgets) : defaultWidgets;
  });
  
  // Save widget order to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
  }, [widgets]);
  
  // Track the widget being dragged and the drop target
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedWidget(id);
    // Set the drag data
    e.dataTransfer.setData("text/plain", id);
    // Add a class to the dragged element for styling
    e.currentTarget.classList.add("dragging");
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault(); // Allow drop
    e.dataTransfer.dropEffect = "move";
    
    // Don't set drop target if it's the same as the dragged widget
    if (id !== draggedWidget) {
      setDropTarget(id);
    }
  };
  
  // Handle drag leave
  const handleDragLeave = () => {
    // We'll use a short timeout to prevent flickering when moving between elements
    setTimeout(() => {
      setDropTarget(null);
    }, 50);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    setDropTarget(null);
    
    if (draggedWidget === targetId) return;
    
    // Find positions of dragged and target widgets
    const draggedIndex = widgets.findIndex(widget => widget.id === draggedWidget);
    const targetIndex = widgets.findIndex(widget => widget.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    // Create a new array with reordered widgets
    const newWidgets = [...widgets];
    const [movedWidget] = newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(targetIndex, 0, movedWidget);
    
    // Update state with new order
    setWidgets(newWidgets);
    setDraggedWidget(null);
  };

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // Remove dragging class
    e.currentTarget.classList.remove("dragging");
    setDraggedWidget(null);
    setDropTarget(null);
  };

  // Render the appropriate widget component based on type
  const renderWidget = (widget: WidgetItem) => {
    switch (widget.type) {
      case "weather":
        return <WeatherWidget key={widget.id} />;
      case "clock":
        return <ClockWidget key={widget.id} />;
      case "todo":
        return <TodoWidget key={widget.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-controls">
        <p className="dashboard-hint">Drag and drop widgets to reorder them</p>
        <button 
          className="reset-button" 
          onClick={() => setWidgets(defaultWidgets)}
          title="Reset to default order"
        >
          Reset Layout
        </button>
      </div>
      <div className="widgets-container">
        {widgets.map((widget) => (
          <div
            key={widget.id}
            className={`widget-wrapper ${dropTarget === widget.id ? 'drop-target' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, widget.id)}
            onDragOver={(e) => handleDragOver(e, widget.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, widget.id)}
            onDragEnd={handleDragEnd}
          >
            {renderWidget(widget)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
