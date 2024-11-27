// CustomNode.js
import React from "react";
import { Handle, Position } from "reactflow";

const CustomNode = ({ data }) => {
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
    >
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
