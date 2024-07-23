import React, { useState, useEffect } from 'react';
import { Modal, Box, Tabs, Tab, Typography, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Processor } from '../types/processor';
import { SchemaFormat } from '../types/schema';
import { Pipeline } from '../types/pipelines';
import PipelineConfirmationDialog from './DialogConfirmCreatePipeline';
import DesignPipelineTab from './ModalTabDesignPipeline';
import TestPipelineTab from './ModalTabTestPipeline';

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

interface TabbedModalProps {
  open: boolean;
  onClose: () => void;
  selectedPipeline: Pipeline;
  setSelectedPipeline: React.Dispatch<React.SetStateAction<Pipeline>>;
  pipelines: Pipeline[];
  topics: string[];
  schemas: string[];
  processorOptions: Processor[];
}

const TabbedModal = ({
  open,
  onClose,
  selectedPipeline,
  setSelectedPipeline,
  pipelines,
  topics,
  schemas,
  processorOptions,
}: TabbedModalProps) => {
  // Theme
  const theme = useTheme();
  const mode = theme.palette.mode;

  // Modal
  const [tabValue, setTabValue] = useState(0);

  // Select Options

  // Dialogs
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [userConfirmation, setUserConfirmation] = useState(false);

  // Test Events
  const [testEvent, setTestEvent] = useState('');
  const [testResult, setTestResult] = useState('');
  const [schemaType, setSchemaType] = useState<SchemaFormat>('json');

  useEffect(() => {
    console.log('DLQ LENGTH CHANGED', selectedPipeline.steps.dlqs);
    console.log('PROCESSORS', selectedPipeline.steps.processors);
  }, [selectedPipeline.steps.dlqs.length]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleClose = () => {
    setTestEvent('');
    setTestResult('');
    setTabValue(0);
    onClose();
  };

  const resetDialogs = () => {
    setWarningDialogOpen(false);
    setConfirmDialogOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        aria-labelledby='modal-title'
        aria-describedby='modal-description'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            minWidth: 900,
            maxWidth: '90%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            minHeight: 700,
            maxHeight: '90vh',
            overflow: 'auto',
          }}
        >
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id='modal-title' variant='h6' component='h2'>
            {isNaN(selectedPipeline.id)
              ? 'Create New Pipeline'
              : `Edit ${selectedPipeline.name}`}
          </Typography>
          <Tabs
            value={tabValue}
            onChange={(event, newValue) => {
              resetDialogs();
              handleTabChange(event, newValue);
            }}
            aria-label='pipeline tabs'
          >
            <Tab label='Design' {...a11yProps(0)} />
            <Tab label='Test & Finalize' {...a11yProps(1)} />
          </Tabs>
          <DesignPipelineTab
            mode={mode}
            selectedPipeline={selectedPipeline}
            tabValue={tabValue}
            schemas={schemas}
            topics={topics}
            processorOptions={processorOptions}
            setSelectedPipeline={setSelectedPipeline}
          />
          <TestPipelineTab
            selectedPipeline={selectedPipeline}
            tabValue={tabValue}
            schemaType={schemaType}
            testEvent={testEvent}
            setTestEvent={setTestEvent}
            testResult={testResult}
            setTestResult={setTestResult}
            processorOptions={processorOptions}
            pipelines={pipelines}
          />
        </Box>
      </Modal>
      <PipelineConfirmationDialog
        confirmDialogOpen={confirmDialogOpen}
        setConfirmDialogOpen={setConfirmDialogOpen}
        setUserConfirmation={setUserConfirmation}
      />
    </>
  );
};

export default TabbedModal;
