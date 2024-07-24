import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface DialogPipelineCreationWarningProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm?: () => void;
  onAcknowledge?: () => void;
}

const DialogPipelineCreationWarning: React.FC<
  DialogPipelineCreationWarningProps
> = ({ open, onClose, title, message, onConfirm, onAcknowledge }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {onConfirm ? (
          <>
            <Button onClick={onClose}>No</Button>
            <Button onClick={onConfirm} autoFocus>
              Yes
            </Button>
          </>
        ) : (
          <Button onClick={onAcknowledge || onClose} autoFocus>
            OK
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DialogPipelineCreationWarning;
