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
  handleCreatePipeline: () => void;
}

const DialogConfirmCreatePipeline = ({
  confirmDialogOpen,
  setConfirmDialogOpen,
  handleCreatePipeline,
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
        <Button onClick={() => setConfirmDialogOpen(false)}>No</Button>
        <Button onClick={handleCreatePipeline} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogConfirmCreatePipeline;
