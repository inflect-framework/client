import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface DialogConfirmCreatePipelineProps {
  confirmDialogOpen: boolean;
  setConfirmDialogOpen: (open: boolean) => void;
  setUserConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
}

const DialogConfirmCreatePipeline = ({
  confirmDialogOpen,
  setConfirmDialogOpen,
  setUserConfirmation,
}: DialogConfirmCreatePipelineProps) => {
  return (
    <Dialog
      open={confirmDialogOpen}
      onClose={() => setConfirmDialogOpen(false)}
    >
      <DialogTitle>Confirm Pipeline Creation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to create the pipeline?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setUserConfirmation(false);
            setConfirmDialogOpen(false);
          }}
        >
          No
        </Button>
        <Button
          onClick={() => {
            setUserConfirmation(true);
            setConfirmDialogOpen(false);
          }}
          autoFocus
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogConfirmCreatePipeline;
