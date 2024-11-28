// CustomNode.js
import React, { useState } from "react";
import { Handle, Position } from "reactflow";

const CustomNode = ({ data, selected }) => {
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
      {selected && (
        <button
          style={{
            position: "absolute",
            right: "-50px",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "5px 10px",
            backgroundColor: "#4a90e2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => {
            console.log("Running node:", data);
            data.onNodeAction(data);
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
