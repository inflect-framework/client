import TabPanel from './TabPanel';
import {
  Box,
  Typography,
  Divider,
  Input,
  Button,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { getCustomStyles } from '../utils/getCustomStyles';
import Select, { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { SelectedOption } from '../types/SelectedOption';
import { FrontendPipeline } from '../types/pipelines';
import { Processor } from '../types/processor';
import { Schema, SchemaFormat } from '../types/schema';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { postPipeline } from '../utils/postPipeline';

interface ModalTabDesignPipelineProps {
  tabValue: number;
  setNewPipelineName: (name: string) => void;
  schemas: Schema[];
  setIncomingSchema: (schema: string | null) => void;
  setOutgoingSchema: (schema: string | null) => void;
  incomingSchema: string | null;
  setSelectedIncomingSchemaFormat: (format: SchemaFormat) => void;
  setSchemaRedirectTopic: (topic: string | null) => void;
  mode: 'light' | 'dark';
  topics: string[];
  setSourceTopic: (topic: string | null) => void;
  setTargetTopic: (topic: string | null) => void;
  processorOptions: Processor[];
  displayedProcessorSelectOptions: { id: string; is_filter: boolean }[];
  setdisplayedProcessorSelectOptions: React.Dispatch<
    React.SetStateAction<[] | { id: string; is_filter: boolean }[]>
  >;
  steps: Processor[];
  setSteps: React.Dispatch<React.SetStateAction<Processor[] | []>>;
  handleCreatePipeline: () => void;
  userCreatedPipeline: FrontendPipeline | null;
}

const ModalTabDesignPipeline = ({
  tabValue,
  setNewPipelineName,
  schemas,
  incomingSchema,
  setIncomingSchema,
  setOutgoingSchema,
  setSelectedIncomingSchemaFormat,
  setSchemaRedirectTopic,
  mode,
  topics,
  setSourceTopic,
  setTargetTopic,
  processorOptions,
  displayedProcessorSelectOptions,
  setdisplayedProcessorSelectOptions,
  steps,
  setSteps,
  handleCreatePipeline,
  userCreatedPipeline,
}: ModalTabDesignPipelineProps) => {
  const handleMoveUp = (id: string) => {
    const index = displayedProcessorSelectOptions.findIndex(
      (item) => item.id === id
    );
    if (index === 0) return;
    const newProcesses = [...displayedProcessorSelectOptions];
    const temp = newProcesses[index - 1];
    newProcesses[index - 1] = newProcesses[index];
    newProcesses[index] = temp;
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

  const handleRemovePipelineStep = (index: number) => {
    const newSteps = steps.slice(0, index).concat(steps.slice(index + 1));

    setSteps(newSteps);
  };

  const handleRemoveProcessorSelect = (id: number | string) => {
    const index = displayedProcessorSelectOptions.findIndex(
      (item) => item.id === id
    );
    const newSelectOptions = displayedProcessorSelectOptions
      .slice(0, index)
      .concat(displayedProcessorSelectOptions.slice(index + 1));

    setdisplayedProcessorSelectOptions(newSelectOptions);
    handleRemovePipelineStep(index);
  };

  const handleAddPipelineStep = (
    selectedOption: SingleValue<SelectedOption> | MultiValue<SelectedOption>,
    _: ActionMeta<SelectedOption>,
    index: number
  ) => {
    if (!selectedOption) return;

    const processor = processorOptions.find(
      (p) => p.processor_name === (selectedOption as SelectedOption).value
    );
    if (!processor) return;
    let changeStep = steps.at(index);
    if (changeStep) {
      const newSteps = steps
        .slice(0, index)
        .concat([processor])
        .concat(steps.slice(index + 1));

      setSteps(newSteps);
    } else {
      setSteps([...steps, processor]);
    }
  };

  const pipelineServerPost = () => {
    const request = async () => {
      if (!userCreatedPipeline) return;
      return await postPipeline(userCreatedPipeline);
    };

    const result = request().then((res) => console.log(res));
    return result;
  };

  return (
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
            border: '1px solid #ccc',
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
              setSourceTopic(
                selectedOption ? (selectedOption as SelectedOption).value : null
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
              setTargetTopic(
                selectedOption ? (selectedOption as SelectedOption).value : null
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
                        handleAddPipelineStep(selectedOption, actionMeta, index)
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
                      handleAddPipelineStep(selectedOption, actionMeta, index)
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
          Update Pipeline
        </Button>
        <Button
          onClick={() => pipelineServerPost()}
          variant='contained'
          color='secondary'
          sx={{ width: 'fit-content', alignSelf: 'flex-start', mt: 2 }}
        >
          Create Pipeline
        </Button>
      </Box>
    </TabPanel>
  );
};

export default ModalTabDesignPipeline;
