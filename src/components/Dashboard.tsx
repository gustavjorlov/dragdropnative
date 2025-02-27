import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import WeatherWidget from "./widgets/WeatherWidget.tsx";
import ClockWidget from "./widgets/ClockWidget.tsx";
import TodoWidget from "./widgets/TodoWidget.tsx";
import TextWidget from "./widgets/TextWidget.tsx";

// Define widget types for our array
type WidgetType = "weather" | "clock" | "todo" | "text";

interface WidgetItem {
  id: string;
  type: WidgetType;
  text?: string; // Optional text for text widgets
}

const Dashboard: React.FC = () => {
  // State to track if edit mode is active
  const [editMode, setEditMode] = useState<boolean>(false);
  // Default widget configuration
  const defaultWidgets: WidgetItem[] = [
    { id: "widget-1", type: "weather" },
    { id: "widget-2", type: "clock" },
    { id: "widget-3", type: "todo" },
    { id: "widget-4", type: "text", text: "Widget #4 - This is a simple text widget" },
    { id: "widget-5", type: "text", text: "Widget #5 - Drag and drop me!" },
    { id: "widget-6", type: "text", text: "Widget #6 - Another text widget" },
    { id: "widget-7", type: "text", text: "Widget #7 - Try moving me around" },
    { id: "widget-8", type: "text", text: "Widget #8 - Last but not least" }
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
  
  // Track the widget being dragged, the drop target, and drop position
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'left' | 'right' | null>(null);

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
      
      // Determine if we're dropping to the left or right of the target
      // by checking if cursor is in the left or right half of the element
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const position = x < rect.width / 2 ? 'left' : 'right';
      setDropPosition(position);
    }
  };
  
  // Handle drag leave
  const handleDragLeave = () => {
    // We'll use a short timeout to prevent flickering when moving between elements
    setTimeout(() => {
      setDropTarget(null);
      setDropPosition(null);
    }, 50);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    setDropTarget(null);
    setDropPosition(null);
    
    if (draggedWidget === targetId) return;
    
    // Find positions of dragged and target widgets
    const draggedIndex = widgets.findIndex(widget => widget.id === draggedWidget);
    const targetIndex = widgets.findIndex(widget => widget.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    // Create a new array with reordered widgets
    const newWidgets = [...widgets];
    const [movedWidget] = newWidgets.splice(draggedIndex, 1);
    
    // If dropping to the right and the target is after the dragged item,
    // we need to adjust the insertion index
    let insertIndex = targetIndex;
    if (dropPosition === 'right') {
      // If we're dropping to the right of the target, increment the index
      // But if the dragged item was before the target, we need to account for the removed item
      insertIndex = draggedIndex < targetIndex ? targetIndex : targetIndex + 1;
    } else {
      // If we're dropping to the left of the target and the dragged item was before the target,
      // we need to account for the removed item
      insertIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
    }
    
    newWidgets.splice(insertIndex, 0, movedWidget);
    
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
    setDropPosition(null);
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
      case "text":
        return <TextWidget key={widget.id} text={widget.text || ""} />;
      default:
        return null;
    }
  };

  // Pastel colors for widget backgrounds
  const pastelColors = [
    "#FFD6E0", // Light pink
    "#FFEFB5", // Light yellow
    "#C1E1C1", // Light green
    "#C4D7ED", // Light blue
    "#D8C3E9", // Light purple
    "#F0E0D6", // Light peach
    "#D1F0E0", // Light mint
    "#F9D5E5"  // Light rose
  ];

  // Determine if a widget should have space created to its left or right
  const getWidgetClasses = (widget: WidgetItem) => {
    let classes = 'widget-wrapper';
    
    // If this is the widget being dragged, add the dragging class
    if (draggedWidget === widget.id) {
      classes += ' dragging';
    }
    
    // If this is the drop target, add the drop-target class and drop position
    if (dropTarget === widget.id) {
      classes += ` drop-target drop-${dropPosition}`;
    }
    
    // If we're dragging and this isn't the dragged widget, check if we need to make space
    if (draggedWidget && draggedWidget !== widget.id) {
      // Only add make-space class if this widget is the drop target
      if (dropTarget === widget.id) {
        if (dropPosition === 'left') {
          classes += ' make-space-left';
        } else if (dropPosition === 'right') {
          classes += ' make-space-right';
        }
      }
    }
    
    return classes;
  };

  // Get background color for a widget based on its ID
  const getWidgetStyle = (widgetId: string) => {
    // Extract the number from the widget ID (e.g., "widget-3" -> 3)
    const idNumber = parseInt(widgetId.split('-')[1], 10);
    // Use modulo to cycle through colors if we have more widgets than colors
    const colorIndex = (idNumber - 1) % pastelColors.length;
    return {
      backgroundColor: pastelColors[colorIndex]
    };
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-controls">
        <p className="dashboard-hint">
          {editMode 
            ? "Drag widgets to reposition them. Widget contents are disabled in edit mode." 
            : "Toggle edit mode to reposition widgets"}
        </p>
        <button 
          className={`edit-mode-button ${editMode ? 'active' : ''}`} 
          onClick={() => setEditMode(!editMode)}
          title={editMode ? "Exit edit mode" : "Enter edit mode"}
        >
          {editMode ? "Exit Edit Mode" : "Edit Layout"}
        </button>
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
            className={getWidgetClasses(widget)}
            draggable={editMode}
            onDragStart={(e) => handleDragStart(e, widget.id)}
            onDragOver={(e) => handleDragOver(e, widget.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, widget.id)}
            onDragEnd={handleDragEnd}
          >
            <div 
              className={`widget-color-background ${editMode ? 'edit-mode' : ''}`} 
              style={getWidgetStyle(widget.id)}
            >
              {renderWidget(widget)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
