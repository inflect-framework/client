import React from 'react';
import {
  Modal as MuiModal,
  Box,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  connection: [string, string, string, boolean, number];
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Modal = ({ show, onClose, connection }: ModalProps) => {
  return (
    <MuiModal
      open={show}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id='modal-modal-title' variant='h6' component='h2'>
          Connection Details
        </Typography>
        <Typography id='modal-modal-description' sx={{ mt: 2 }}>
          {connection ? connection.join(' | ') : ''}
        </Typography>
        <div
          className='schema-versioning-controls'
          style={{ marginTop: '16px' }}
        >
          <Button variant='contained' onClick={onClose} sx={{ mr: 1 }}>
            Evolve Version
          </Button>
          <Button variant='contained' onClick={onClose} sx={{ mr: 1 }}>
            Is Previous Version
          </Button>
          <Button variant='contained' onClick={onClose} sx={{ mr: 1 }}>
            Is Deprecated Version
          </Button>
        </div>
        <div className='test-events-container' style={{ marginTop: '16px' }}>
          <Button variant='contained' onClick={onClose}>
            Create Test Events
          </Button>
        </div>
      </Box>
    </MuiModal>
  );
};

export default Modal;
