import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Tabs,
  Tab,
  Typography,
  IconButton,
  Button,
  TextField,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import { getCustomStyles } from '../utils/getCustomStyles';
import { SelectedOption } from '../types/SelectedOption';
import { Process } from '../types/process';
import { Schema, SchemaFormat } from '../types/schema';
import { getTopicsAndSchemas, getProcessors } from '../utils/getEntities';
import { postTestEvent } from '../utils/postTestEvent';
import { FrontendPipeline } from '../types/pipelines';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

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
  const theme = useTheme();
  const mode = theme.palette.mode;

  const [tabValue, setTabValue] = useState(0);
  const [incomingSchema, setIncomingSchema] = useState<string | null>(null);
  const [outgoingSchema, setOutgoingSchema] = useState<string | null>(null);
  const [redirectTopic, setRedirectTopic] = useState<string | null>(null);
  const [testEvent, setTestEvent] = useState('');
  const [testResult, setTestResult] = useState('');
  const [schemaType, setSchemaType] = useState<SchemaFormat>('json');
  const [processors, setProcessors] = useState<Process[]>([]);
  const [availableProcessors, setAvailableProcessors] = useState<Process[]>([]);
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [subscribeTopic, setSubscribeTopic] = useState<string | null>(null);
  const [publishTopic, setPublishTopic] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [userCreatedPipeline, setUserCreatedPipeline] =
    useState<null | FrontendPipeline>(null);

  const loadTopicsAndSchemas = () => {
    const request = async () => {
      const result = await getTopicsAndSchemas();
      console.log('Topics', result.topics);
      console.log('Schemas', result.schemas);
      setSchemas(result.schemas);
      setTopics(result.topics);
    };
    request();
  };

  const loadProcesses = () => {
    const request = async () => {
      const request = await getProcessors();
      setAvailableProcessors(request);
    };
    request();
  };

  useEffect(() => {
    loadTopicsAndSchemas();
    loadProcesses();
  }, []);

  const createEditableTestEvent = () => {
    const request = async () => {
      const result = await postTestEvent(incomingSchema, schemaType);
      setTestEvent(JSON.stringify(result, null, 2));
    };
    request();
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTest = async () => {
    const result = await simulateBackendProcessing(testEvent);
    setTestResult(result as string);
  };

  const simulateBackendProcessing = (event: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Processed event: ${event}`);
      }, 1000);
    });
  };

  const handleClose = () => {
    setIncomingSchema(null);
    setOutgoingSchema(null);
    setRedirectTopic(null);
    setTestEvent('');
    setTestResult('');
    setProcessors([]);
    setTabValue(0);
    onClose();
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newProcesses = [...processors];
    const temp = newProcesses[index - 1];
    newProcesses[index - 1] = newProcesses[index];
    newProcesses[index] = temp;
    setProcessors(newProcesses);
  };

  const handleMoveDown = (index: number) => {
    if (index === processors.length - 1) return;
    const newProcesses = [...processors];
    const temp = newProcesses[index + 1];
    newProcesses[index + 1] = newProcesses[index];
    newProcesses[index] = temp;
    setProcessors(newProcesses);
  };

  const handleAddItem = (type: string, index: number) => {
    const newProcesses = [...processors];
    newProcesses.splice(index + 1, 0, {
      id: `${type}-${newProcesses.length + 1}`,
      processor_name: type,
      is_filter: type === 'filter',
    });
    setProcessors(newProcesses);
  };

  const handleDeleteItem = (id: number | string) => {
    setProcessors(processors.filter((item) => item.id !== id));
  };

  const createPipelineObject = (): FrontendPipeline => {
    return {
      subscribeTopic,
      publishTopic,
      incomingSchema,
      outgoingSchema: { value: outgoingSchema, redirectTopic },
      processors: processors.map((processor) => ({
        type: processor.is_filter ? 'filter' : 'transformation',
        value: processor.processor_name,
        redirectTopic: processor.is_filter ? redirectTopic : undefined,
      })),
    };
  };

  const handleCreatePipeline = () => {
    if (
      !outgoingSchema &&
      processors.some((item) => item.is_filter || !item.is_filter)
    ) {
      setWarningDialogOpen(true);
    } else if (
      (outgoingSchema || processors.some((item) => item.is_filter)) &&
      !redirectTopic
    ) {
      alert(
        'Please select a redirect topic for the outgoing schema or filters.'
      );
      return;
    } else {
      const pipeline = createPipelineObject();
      setUserCreatedPipeline(pipeline);
      console.log(userCreatedPipeline);
      setTabValue(1);
    }
  };

  const handleConfirmPipelineCreation = () => {
    setConfirmDialogOpen(false);
    const pipeline = createPipelineObject();
    setUserCreatedPipeline(pipeline);
    console.log(pipeline);
    setTabValue(1);
  };

  const resetDialogs = () => {
    setWarningDialogOpen(false);
    setConfirmDialogOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
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
            <Tab label='Finalize' {...a11yProps(2)} />
            <Tab label='Versioning and Evolution' {...a11yProps(3)} />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography>Incoming Schema</Typography>
                <Select
                  options={schemas.map((schema) => ({
                    value: schema,
                    label: schema,
                  }))}
                  isClearable
                  styles={getCustomStyles(mode)}
                  onChange={(selectedOption) =>
                    setSubscribeTopic(
                      selectedOption
                        ? (selectedOption as SelectedOption).value
                        : null
                    )
                  }
                />
              </Box>{' '}
              <Box>
                <Typography>Subscribe Topic</Typography>
                <Select
                  options={topics.map((topic) => ({
                    value: topic,
                    label: topic,
                  }))}
                  isClearable
                  styles={getCustomStyles(mode)}
                  onChange={(selectedOption) =>
                    setPublishTopic(
                      selectedOption
                        ? (selectedOption as SelectedOption).value
                        : null
                    )
                  }
                />
              </Box>{' '}
              <Box>
                <Typography>Publish Topic</Typography>
                <Select
                  options={topics.map((topic) => ({
                    value: topic,
                    label: topic,
                  }))}
                  isClearable
                  styles={getCustomStyles(mode)}
                  onChange={(selectedOption) =>
                    setIncomingSchema(
                      selectedOption
                        ? (selectedOption as SelectedOption).value
                        : null
                    )
                  }
                />
              </Box>{' '}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography>Outgoing Schema</Typography>
                  <Select
                    options={schemas.map((schema) => ({
                      value: schema,
                      label: schema,
                    }))}
                    isClearable
                    styles={getCustomStyles(mode)}
                    onChange={(selectedOption) =>
                      setOutgoingSchema(
                        selectedOption
                          ? (selectedOption as SelectedOption).value
                          : null
                      )
                    }
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography>Topic On Fail</Typography>
                  <Select
                    options={topics.map((topic) => ({
                      value: topic,
                      label: topic,
                    }))}
                    isClearable
                    styles={getCustomStyles(mode)}
                    onChange={(selectedOption) =>
                      setRedirectTopic(
                        selectedOption
                          ? (selectedOption as SelectedOption).value
                          : null
                      )
                    }
                  />
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {processors.map((item, index) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: 2,
                    }}
                  >
                    {item.is_filter ? (
                      <>
                        <Box sx={{ flex: 1 }}>
                          <Typography>
                            Filter{' '}
                            {processors
                              .filter((p) => p.is_filter)
                              .indexOf(item) + 1}
                          </Typography>
                          <Select
                            options={availableProcessors
                              .filter((p) => p.is_filter)
                              .map((processor) => ({
                                value: processor.processor_name,
                                label: processor.processor_name,
                              }))}
                            isClearable
                            styles={getCustomStyles(mode)}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography>Topic On Fail</Typography>
                          <Select
                            options={topics.map((topic) => ({
                              value: topic,
                              label: topic,
                            }))}
                            isClearable
                            styles={getCustomStyles(mode)}
                          />
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ flex: 1 }}>
                        <Typography>
                          Transformation{' '}
                          {processors
                            .filter((p) => !p.is_filter)
                            .indexOf(item) + 1}
                        </Typography>
                        <Select
                          options={availableProcessors
                            .filter((p) => !p.is_filter)
                            .map((processor) => ({
                              value: processor.processor_name,
                              label: processor.processor_name,
                            }))}
                          isClearable
                          styles={getCustomStyles(mode)}
                        />
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        onClick={() =>
                          handleAddItem(item.processor_name, index)
                        }
                        sx={{ alignSelf: 'flex-end' }}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteItem(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton onClick={() => handleMoveUp(index)}>
                        <ArrowUpwardIcon />
                      </IconButton>
                      <IconButton onClick={() => handleMoveDown(index)}>
                        <ArrowDownwardIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  onClick={() =>
                    handleAddItem('transformation', processors.length - 1)
                  }
                  variant='contained'
                  startIcon={<AddIcon />}
                  sx={{ width: 'fit-content', alignSelf: 'flex-start' }}
                >
                  Add Transformation
                </Button>
                <Button
                  onClick={() => handleAddItem('filter', processors.length - 1)}
                  variant='contained'
                  startIcon={<AddIcon />}
                  sx={{ width: 'fit-content', alignSelf: 'flex-start' }}
                >
                  Add Filter
                </Button>
              </Box>
              <Button
                onClick={handleCreatePipeline}
                variant='contained'
                color='secondary'
                sx={{ width: 'fit-content', alignSelf: 'flex-start', mt: 2 }}
              >
                Create Pipeline
              </Button>
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ width: '200px' }}>
                <Typography>Schema Type</Typography>
                <Select
                  options={[
                    { value: 'json', label: 'JSON' },
                    { value: 'avro', label: 'Avro' },
                    { value: 'protobuf', label: 'Protobuf' },
                  ]}
                  value={{ value: schemaType, label: schemaType.toUpperCase() }}
                  onChange={(selectedOption) =>
                    setSchemaType(
                      (selectedOption as SelectedOption).value as SchemaFormat
                    )
                  }
                  styles={getCustomStyles(mode)}
                />
              </Box>
              <Box>
                <Button
                  onClick={createEditableTestEvent}
                  variant='contained'
                  color='primary'
                  sx={{ mr: 2 }}
                >
                  Generate Test Event
                </Button>
                <Button
                  onClick={handleTest}
                  variant='contained'
                  color='secondary'
                >
                  Test
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, height: '450px' }}>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='subtitle1'>
                    Generated Editable Test Event:
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <Editor
                      height='100%'
                      language='json'
                      value={testEvent}
                      onChange={(value) => setTestEvent(value || '')}
                    />
                  </Box>
                </Box>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='subtitle1'>Result:</Typography>
                  <TextField
                    multiline
                    fullWidth
                    rows={10}
                    variant='outlined'
                    value={testResult}
                    InputProps={{
                      readOnly: true,
                      sx: { height: '100%' },
                    }}
                    sx={{ flex: 1 }}
                  />
                </Box>
                <Box
                  sx={{
                    width: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography variant='subtitle1'>
                    Transformations and Filters:
                  </Typography>
                  <Box sx={{ mt: 2, flex: 1 }}>
                    <Typography>Incoming Schema</Typography>
                    <Typography>Transformation 1</Typography>
                    <Typography>Filter 1</Typography>
                    <Typography>Transformation 2</Typography>
                    <Typography color='error'>Filter 2 (Error)</Typography>
                    <Typography>Outgoing Schema</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            {/* Render Finalize tab content here */}
            Finalize Content
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            {/* Render Versioning and Evolution tab content here */}
            Versioning and Evolution Content
          </TabPanel>
        </Box>
      </Modal>
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
          <Button onClick={handleConfirmPipelineCreation} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TabbedModal;
