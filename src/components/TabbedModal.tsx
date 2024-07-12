import React, { useState, useEffect } from 'react';
import { Modal, Box, Tabs, Tab, Typography, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Processor } from '../types/processor';
import { Schema, SchemaFormat } from '../types/schema';
import { FrontendPipeline, PipelineStep } from '../types/pipelines';
import { getProcessors, getTopicsAndSchemas } from '../utils/getEntities';
import TabPanel from './TabPanel';
import PipelineWarningDialog from './DialogPipelineCreationWarning';
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
  pipeline: [string, string, string, boolean, number] | null;
}

const TabbedModal = ({ open, onClose, pipeline }: TabbedModalProps) => {
  // Theme
  const theme = useTheme();
  const mode = theme.palette.mode;

  // Modal
  const [tabValue, setTabValue] = useState(0);

  // Select Options
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [processorOptions, setProcessorOptions] = useState<Processor[]>([]);
  const [displayedProcessorSelectOptions, setdisplayedProcessorSelectOptions] =
    useState<[] | { id: string; is_filter: boolean }[]>([]);

  // Pipeline Creation/Update
  const [newPipelineName, setNewPipelineName] = useState('');
  const [incomingSchema, setIncomingSchema] = useState<string | null>(null);
  const [outgoingSchema, setOutgoingSchema] = useState<string | null>(null);
  const [schemaRedirectTopic, setSchemaRedirectTopic] = useState<string | null>(
    null
  );
  const [steps, setSteps] = useState<[] | Processor[]>([]);
  const [sourceTopic, setSourceTopic] = useState<string | null>(null);
  const [targetTopic, setTargetTopic] = useState<string | null>(null);
  const [userCreatedPipeline, setUserCreatedPipeline] =
    useState<null | FrontendPipeline>(null);

  // Dialogs
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);

  // Test Events
  const [selectedIncomingSchemaFormat, setSelectedIncomingSchemaFormat] =
    useState<string | null>(null);
  const [testEvent, setTestEvent] = useState('');
  const [testResult, setTestResult] = useState('');
  const [schemaType, setSchemaType] = useState<SchemaFormat>('json');

  const loadTopicsAndSchemas = () => {
    const request = async () => {
      const result = await getTopicsAndSchemas();
      setSchemas(result.schemas);
      setTopics(result.topics);
    };
    request();
  };

  const loadProcessors = () => {
    const request = async () => {
      const request = await getProcessors();
      setProcessorOptions(request);
    };
    request();
  };

  useEffect(() => {
    loadTopicsAndSchemas();
    loadProcessors();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleClose = () => {
    setNewPipelineName('');
    setIncomingSchema(null);
    setOutgoingSchema(null);
    setSchemaRedirectTopic(null);
    setTestEvent('');
    setTestResult('');
    setdisplayedProcessorSelectOptions([]);
    setTabValue(0);
    onClose();
  };

  const createPipelineObject = (): FrontendPipeline => {
    return {
      name: newPipelineName,
      sourceTopic,
      targetTopic,
      incomingSchema,
      outgoingSchema: {
        name: outgoingSchema,
        redirectTopic: schemaRedirectTopic,
      },
      steps,
    };
  };

  const handleCreatePipeline = () => {
    const pipeline = createPipelineObject();
    setUserCreatedPipeline(pipeline);
    console.log(
      'React batches updates therefore the logging statement for the state is:',
      userCreatedPipeline
    );
    console.log('The pipeline actuallylooks like:', pipeline);
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
            {pipeline ? 'Edit Pipeline' : 'Create New Pipeline'}
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
            <Tab label='Test' {...a11yProps(1)} />
            <Tab label='Versioning and Evolution' {...a11yProps(2)} />
          </Tabs>
          <DesignPipelineTab
            tabValue={tabValue}
            setNewPipelineName={setNewPipelineName}
            schemas={schemas}
            incomingSchema={incomingSchema}
            setIncomingSchema={setIncomingSchema}
            setSelectedIncomingSchemaFormat={setSelectedIncomingSchemaFormat}
            setOutgoingSchema={setOutgoingSchema}
            setSchemaRedirectTopic={setSchemaRedirectTopic}
            mode={mode}
            topics={topics}
            setSourceTopic={setSourceTopic}
            setTargetTopic={setTargetTopic}
            processorOptions={processorOptions}
            displayedProcessorSelectOptions={displayedProcessorSelectOptions}
            setdisplayedProcessorSelectOptions={
              setdisplayedProcessorSelectOptions
            }
            steps={steps}
            setSteps={setSteps}
            // pipelineServerPost={pipelineServerPost}
            handleCreatePipeline={handleCreatePipeline}
            userCreatedPipeline={userCreatedPipeline}
          />
          <TestPipelineTab
            tabValue={tabValue}
            incomingSchema={incomingSchema}
            schemaType={schemaType}
            setSchemaType={setSchemaType}
            mode={mode}
            selectedIncomingSchemaFormat={selectedIncomingSchemaFormat}
            testEvent={testEvent}
            setTestEvent={setTestEvent}
            steps={steps}
            testResult={testResult}
            setTestResult={setTestResult}
          />
          <TabPanel value={tabValue} index={2}>
            {/* Render Versioning and Evolution tab content here */}
            Versioning and Evolution Content
          </TabPanel>
        </Box>
      </Modal>
      <PipelineWarningDialog
        warningDialogOpen={warningDialogOpen}
        setWarningDialogOpen={setWarningDialogOpen}
        setConfirmDialogOpen={setConfirmDialogOpen}
      />
      <PipelineConfirmationDialog
        confirmDialogOpen={confirmDialogOpen}
        setConfirmDialogOpen={setConfirmDialogOpen}
        handleCreatePipeline={handleCreatePipeline}
      />
    </>
  );
};

export default TabbedModal;
