// ConfirmDialog.jsx
import React from "react";

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          width: "90%",
          maxWidth: "400px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          textAlign: "center"
        }}
      >
        <p style={{ fontSize: "16px", marginBottom: "20px" }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            onClick={onConfirm}
            style={{
              backgroundColor: "#ff4d4d",
              color: "white",
              border: "none",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Yes, Record New
          </button>
          <button
            onClick={onCancel}
            style={{
              backgroundColor: "#ccc",
              color: "#333",
              border: "none",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Keep Old Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
