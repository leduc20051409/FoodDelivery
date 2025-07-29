import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const CancelOrderModal = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        className: "bg-[#2a2a2a] text-white",
      }}
    >
      <DialogTitle className="text-lg font-semibold text-white">
        Cancel Order
      </DialogTitle>
      <DialogContent>
        <Typography className="text-gray-300 text-sm">
          Are you sure you want to cancel this order? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions className="px-4 py-3">
        <Button
          variant="outlined"
          onClick={onClose}
          className="text-gray-300 border-gray-500 hover:bg-gray-600"
        >
          No
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Yes, Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelOrderModal;
