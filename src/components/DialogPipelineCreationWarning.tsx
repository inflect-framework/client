import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface DialogPipelineCreationWarningProps {
  warningDialogOpen: boolean;
  setWarningDialogOpen: (open: boolean) => void;
  setConfirmDialogOpen: (open: boolean) => void;
}

const DialogPipelineCreationWarning = ({
  warningDialogOpen,
  setWarningDialogOpen,
  setConfirmDialogOpen,
}: DialogPipelineCreationWarningProps) => {
  return (
    <Dialog
      open={warningDialogOpen}
      onClose={() => setWarningDialogOpen(false)}
    >
      <DialogTitle>Schema Validation Warning</DialogTitle>
      <DialogContent>
        <DialogContentText>
          No outgoing schema selected. The pipeline will be processed without
          schema validation. Is that okay?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setWarningDialogOpen(false)}>No</Button>
        <Button
          onClick={() => {
            setWarningDialogOpen(false);
            setConfirmDialogOpen(true);
          }}
          autoFocus
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogPipelineCreationWarning;
