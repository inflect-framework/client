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
  Input,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Editor from '@monaco-editor/react';
import Select, { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { getCustomStyles } from '../utils/getCustomStyles';
import { SelectedOption } from '../types/SelectedOption';
import { Processor } from '../types/processor';
import { Schema, SchemaFormat } from '../types/schema';
import { getProcessors, getTopicsAndSchemas } from '../utils/getEntities';
import { postTestEvent } from '../utils/postTestEvent';
import { FrontendPipeline, PipelineStep } from '../types/pipelines';
import { v4 as uuidv4 } from 'uuid';

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
  const [sourceTopic, setsourceTopic] = useState<string | null>(null);
  const [targetTopic, settargetTopic] = useState<string | null>(null);
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

  const createEditableTestEvent = () => {
    const request = async () => {
      const result = await postTestEvent({
        schema: incomingSchema as string,
        format: selectedIncomingSchemaFormat as SchemaFormat,
      });
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

  const handleMoveUp = (id: string) => {
    const index = displayedProcessorSelectOptions.findIndex(
      (item) => item.id === id
    );
    // console.log('Index:', index);
    if (index === 0) return;
    const newProcesses = [...displayedProcessorSelectOptions];
    const temp = newProcesses[index - 1];
    newProcesses[index - 1] = newProcesses[index];
    newProcesses[index] = temp;
    // console.log('New Processes:', newProcesses);
    setdisplayedProcessorSelectOptions(newProcesses);
  };

  const handleMoveDown = (id: string) => {
    const index = displayedProcessorSelectOptions.findIndex(
      (item) => item.id === id
    );
    if (index === displayedProcessorSelectOptions.length - 1) return;
    const newProcesses = [...displayedProcessorSelectOptions];
    const temp = newProcesses[index + 1];
    newProcesses[index + 1] = newProcesses[index];
    newProcesses[index] = temp;
    // console.log('New Processes:', newProcesses);
    setdisplayedProcessorSelectOptions(newProcesses);
  };

  const handleDisplayNewProcessorSelect = (type: string, index: number) => {
    const newProcessorSelectOptions = [...displayedProcessorSelectOptions];
    const newProcessor = {
      id: uuidv4(),
      is_filter: type === 'filter',
    };

    newProcessorSelectOptions.splice(index + 1, 0, newProcessor);
    setdisplayedProcessorSelectOptions(newProcessorSelectOptions);
  };

  const handleRemoveProcessorSelect = (id: number | string) => {
    // console.log('Removing Processor with ID:', id, typeof id);
    // console.log('Current steps:', steps);
    // console.log('Current Processors:', displayedProcessorSelectOptions);
    // console.log(
    //   'Current Processor exists?',
    //   displayedProcessorSelectOptions.some((item) => item.id === id)
    // );
    const index = displayedProcessorSelectOptions.findIndex(
      (item) => item.id === id
    );
    const newSelectOptions = displayedProcessorSelectOptions
      .slice(0, index)
      .concat(displayedProcessorSelectOptions.slice(index + 1));

    // console.log('New Processors:', newSelectOptions);
    setdisplayedProcessorSelectOptions(newSelectOptions);
    handleRemovePipelineStep(index);
  };

  const handleRemovePipelineStep = (index: number) => {
    const newSteps = steps.slice(0, index).concat(steps.slice(index + 1));
    // console.log('Previous steps:', steps);
    // console.log('New Steps:', newSteps);
    setSteps(newSteps);
  };

  const handleAddPipelineStep = (
    selectedOption: SingleValue<SelectedOption> | MultiValue<SelectedOption>,
    _: ActionMeta<SelectedOption>,
    index: number
  ) => {
    // console.log('Adding Pipeline Step', selectedOption);
    // console.log('Index:', index);
    // console.log('Step to change', steps.at(index));
    if (!selectedOption) return;

    const processor = processorOptions.find(
      (p) => p.processor_name === (selectedOption as SelectedOption).value
    );
    if (!processor) return;
    let changeStep = steps.at(index);
    if (changeStep) {
      // console.log('New Step:', processor);
      const newSteps = steps
        .slice(0, index)
        .concat([processor])
        .concat(steps.slice(index + 1));

      setSteps(newSteps);
    } else {
      setSteps([...steps, processor]);
    }
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
          <TabPanel value={tabValue} index={0}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'Column',
                gap: 0,
              }}
            >
              <Typography>Name</Typography>
              <Input
                required
                sx={{
                  width: '300px',
                  border: '1px solid #ccc', // Add a border
                  borderRadius: '4px',
                }}
                onChange={(event) => setNewPipelineName(event.target.value)}
              />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography>Incoming Schema</Typography>
                  <Select
                    options={schemas.map((schema) => ({
                      value: String(schema),
                      label: String(schema),
                    }))}
                    isClearable
                    styles={getCustomStyles(mode)}
                    onChange={(
                      selectedOption:
                        | SingleValue<SelectedOption>
                        | MultiValue<SelectedOption>,
                      actionMeta: ActionMeta<SelectedOption>
                    ) =>
                      setIncomingSchema(
                        selectedOption
                          ? (selectedOption as SelectedOption).value
                          : null
                      )
                    }
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography>Incoming Schema Type</Typography>
                  <Select
                    options={['avro', 'json', 'protobuf'].map((schemaType) => ({
                      value: schemaType,
                      label: schemaType,
                    }))}
                    isClearable
                    {...(incomingSchema ? { required: true } : {})}
                    styles={getCustomStyles(mode)}
                    onChange={(selectedOption) =>
                      setSelectedIncomingSchemaFormat(
                        (selectedOption as SelectedOption).value as SchemaFormat
                      )
                    }
                  />
                </Box>
              </Box>{' '}
              <Box>
                <Typography>Source Topic</Typography>
                <Select
                  options={topics.map((topic) => ({
                    value: topic,
                    label: topic,
                  }))}
                  isClearable
                  styles={getCustomStyles(mode)}
                  onChange={(selectedOption) =>
                    setsourceTopic(
                      selectedOption
                        ? (selectedOption as SelectedOption).value
                        : null
                    )
                  }
                />
              </Box>{' '}
              <Box>
                <Typography>Target Topic</Typography>
                <Select
                  options={topics.map((topic) => ({
                    value: topic,
                    label: topic,
                  }))}
                  isClearable
                  styles={getCustomStyles(mode)}
                  onChange={(selectedOption) =>
                    settargetTopic(
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
                      value: String(schema),
                      label: String(schema),
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
                      setSchemaRedirectTopic(
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
                {displayedProcessorSelectOptions.map((item, index) => (
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
                            {displayedProcessorSelectOptions
                              .filter((p) => p.is_filter)
                              .indexOf(item) + 1}
                          </Typography>
                          <Select
                            options={processorOptions
                              .filter((p) => p.is_filter)
                              .map((processor) => ({
                                value: processor.processor_name,
                                label: processor.processor_name,
                              }))}
                            onChange={(selectedOption, actionMeta) =>
                              handleAddPipelineStep(
                                selectedOption,
                                actionMeta,
                                index
                              )
                            }
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
                            // onChange={handleAddFilterTopic}
                            isClearable
                            styles={getCustomStyles(mode)}
                          />
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ flex: 1 }}>
                        <Typography>
                          Transformation{' '}
                          {displayedProcessorSelectOptions
                            .filter((p) => !p.is_filter)
                            .indexOf(item) + 1}
                        </Typography>
                        <Select
                          options={processorOptions
                            .filter((p) => !p.is_filter)
                            .map((processor) => ({
                              value: processor.processor_name,
                              label: processor.processor_name,
                            }))}
                          onChange={(selectedOption, actionMeta) =>
                            handleAddPipelineStep(
                              selectedOption,
                              actionMeta,
                              index
                            )
                          }
                          isClearable
                          styles={getCustomStyles(mode)}
                        />
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        onClick={() =>
                          handleDisplayNewProcessorSelect(
                            item.is_filter ? 'filter' : 'transformation',
                            index
                          )
                        }
                        sx={{ alignSelf: 'flex-end' }}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleRemoveProcessorSelect(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton onClick={() => handleMoveUp(item.id)}>
                        <ArrowUpwardIcon />
                      </IconButton>
                      <IconButton onClick={() => handleMoveDown(item.id)}>
                        <ArrowDownwardIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  onClick={() =>
                    handleDisplayNewProcessorSelect(
                      'transformation',
                      displayedProcessorSelectOptions.length
                    )
                  }
                  variant='contained'
                  startIcon={<AddIcon />}
                  sx={{ width: 'fit-content', alignSelf: 'flex-start' }}
                >
                  Add Transformation
                </Button>
                <Button
                  onClick={() =>
                    handleDisplayNewProcessorSelect(
                      'filter',
                      displayedProcessorSelectOptions.length
                    )
                  }
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
          <Button onClick={handleCreatePipeline} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TabbedModal;
