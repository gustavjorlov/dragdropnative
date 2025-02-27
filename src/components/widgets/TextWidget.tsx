import React from "react";
import "./Widget.css";

interface TextWidgetProps {
  text: string;
}

const TextWidget: React.FC<TextWidgetProps> = ({ text }) => {
  return (
    <div className="widget text-widget">
      <div className="widget-header">
        <h3>Text Widget</h3>
      </div>
      <div className="widget-content">
        <p>{text}</p>
      </div>
    </div>
  );
};

export default TextWidget;
