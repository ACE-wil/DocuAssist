// CustomNode.js
import React, { useState } from "react";
import { Handle, Position } from "reactflow";

const CustomNode = ({ data, selected }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        padding: "10px",
        border: "2px solid #4a90e2",
        borderRadius: "8px",
        backgroundColor: "#f0f4f8",
        minWidth: "150px",
        textAlign: "center",
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          width: "15px",
          height: "15px",
          borderRadius: "50%",
          backgroundColor: selected ? "yellow" : data.color,
          margin: "0 auto",
        }}
      ></div>
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "#83BCF5",
          width: "12px",
          height: "12px",
          transform: "translateY(-3px)",
        }}
      />
      <div>{data.label}</div>
      {(selected || isHovered) && (
        <button
          style={{
            position: "absolute",
            right: "-60px",
            top: "50%",
            transform: "translateY(-40%)",
            padding: "5px 10px",
            backgroundColor: "#4a90e2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#357ABD";
            e.target.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#4a90e2";
            e.target.style.transform = "translateY(-50%) scale(1)";
          }}
          onMouseDown={(e) => {
            e.target.style.transform = "translateY(-50%) scale(0.95)";
          }}
          onMouseUp={(e) => {
            e.target.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onClick={() => {
            console.log("Running node:", data);
            data.onNodeAction(data);
            console.log("currentRunNodeId:", data.currentRunNodeId);
          }}
        >
          运行
        </button>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "#83BCF5",
          width: "12px",
          height: "12px",
          transform: "translateY(3px)",
        }}
      />
    </div>
  );
};

export default CustomNode;
