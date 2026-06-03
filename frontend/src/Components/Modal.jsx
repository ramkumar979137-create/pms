import React, { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";

export default function Modal({ isOpen, onClose, title = "", size = "medium", children, className = "", hideHeader = false, footer = null }) {
  useEffect(() => {
    if (isOpen) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [isOpen]);

  const maxW = size === "large" ? 900 : size === "small" ? 360 : 560;

  return (
    <Dialog
      open={Boolean(isOpen)}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      PaperProps={{
        className,
        sx: {
          borderRadius: "28px",
          boxShadow: "0 20px 60px rgba(18,24,31,0.14)",
          width: "100%",
          maxWidth: `${maxW}px`,
          m: 2,
        },
      }}
    >
      {!hideHeader && (
        <DialogTitle sx={{ position: "sticky", top: 0, zIndex: 2, backgroundColor: "#fff", p: "32px 28px 20px 28px", borderBottom: "1px solid #ede4d7", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
          <h2 id="modal-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#12181f", margin: 0 }}>{title}</h2>
          <IconButton onClick={onClose} aria-label="close" sx={{ p: 0, width: 28, height: 28, color: "#7a8694" }}>
            ×
          </IconButton>
        </DialogTitle>
      )}

      <DialogContent dividers={false} sx={{ p: "28px", overflowY: "auto", maxHeight: "calc(100vh - 220px)" }}>
        {children}
      </DialogContent>
      {footer && (
        <DialogActions sx={{ position: "sticky", bottom: 0, left: 0, right: 0, zIndex: 1, backgroundColor: "#fff", borderTop: "1px solid #ede4d7", px: "28px", py: "18px", display: "flex", justifyContent: "flex-end", gap: 12 }}>
          {footer}
        </DialogActions>
      )}
    </Dialog>
  );
}
