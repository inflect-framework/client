import TabPanel from './TabPanel';
import { Box, Typography, Divider, Input, Button } from '@mui/material';
import { getCustomStyles, CustomStyles } from '../utils/getCustomStyles';
import Select from 'react-select';
import { SelectedOption } from '../types/SelectedOption';
import { Pipeline } from '../types/pipelines';
import { Processor } from '../types/processor';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import CurrentPipelineProcessors from './CurrentPipelineProcessors';
import makeDebouncer from '../utils/makeDebouncer';

interface ModalTabDesignPipelineProps {
  mode: 'light' | 'dark';
  processorOptions: Processor[];
  schemas: string[];
  selectedPipeline: Pipeline;
  setSelectedPipeline: React.Dispatch<React.SetStateAction<Pipeline>>;
  tabValue: number;
  topics: string[];
}

const ModalTabDesignPipeline = ({
  selectedPipeline,
  tabValue,
  schemas,
  mode,
  topics,
  processorOptions,
  setSelectedPipeline,
}: ModalTabDesignPipelineProps) => {
  const handleDisplayNewProcessorSelect = (type: string, index: number) => {
    const newPipeline = { ...selectedPipeline };
    newPipeline.steps.processors = [...selectedPipeline.steps.processors];

    if (selectedPipeline.steps.hasOwnProperty('dlqs')) {
      if (
        selectedPipeline.steps.dlqs.length !==
        selectedPipeline.steps.processors.length + 1
      ) {
        newPipeline.steps.dlqs = [...selectedPipeline.steps.dlqs, null];
      } else {
        newPipeline.steps.dlqs = [...selectedPipeline.steps.dlqs];
      }
    } else {
      newPipeline.steps.dlqs = Array(
        selectedPipeline.steps.processors.length + 1
      ).fill(null);
    }

    if (type === 'transformation') {
      newPipeline.steps.processors.splice(
        index,
        0,
        processorOptions[0].id as number
      );
      newPipeline.steps.dlqs.splice(index, 0, null);
    }

    setSelectedPipeline(newPipeline);
  };

  const handleDefaultSchemaValues = (isIncomingSchema: boolean) => {
    const selectedSchema = schemas.find(
      (schema) =>
        (isIncomingSchema
          ? selectedPipeline.incoming_schema
          : selectedPipeline.outgoing_schema) === schema
    );

    if (!selectedSchema) {
      return {
        value: `Select ${isIncomingSchema ? 'incoming' : 'outgoing'} schema...`,
        label: `Select ${isIncomingSchema ? 'incoming' : 'outgoing'} schema...`,
      };
    }

    return {
      value: selectedSchema,
      label: selectedSchema,
    };
  };

  const handleDefaultTopicValues = (isIncomingTopic: boolean) => {
    const selectedTopic = topics.find(
      (topic) =>
        (isIncomingTopic
          ? selectedPipeline.source_topic
          : selectedPipeline.target_topic) === topic
    );

    if (!selectedTopic) {
      return {
        value: `Select ${isIncomingTopic ? 'incoming' : 'outgoing'} topic...`,
        label: `Select ${isIncomingTopic ? 'incoming' : 'outgoing'} topic...`,
      };
    }

    return {
      value: selectedTopic,
      label: selectedTopic,
    };
  };

  const handleDefaultDLQ = (isSchema: boolean) => {
    if (selectedPipeline.redirect_topic) {
      return {
        value: selectedPipeline.redirect_topic,
        label: selectedPipeline.redirect_topic,
      };
    }

    if (!selectedPipeline.steps.hasOwnProperty('dlqs')) {
      return {
        value: `Selected ${isSchema ? 'schema' : 'filter'} has no DLQ`,
        label: `Selected ${isSchema ? 'schema' : 'filter'} has no DLQ`,
      };
    }

    if (selectedPipeline.steps.dlqs.length === 0) {
      return {
        value: `Select ${isSchema ? 'schema' : 'filter'} DLQ...`,
        label: `Select ${isSchema ? 'schema' : 'filter'} DLQ...`,
      };
    }

    if (
      selectedPipeline.steps.dlqs.length -
        selectedPipeline.steps.processors.length ===
      1
    ) {
      return {
        value: selectedPipeline.steps.dlqs.at(-1),
        label: selectedPipeline.steps.dlqs.at(-1),
      };
    }
  };

  const handleSelectedPipelineNameChange = makeDebouncer((name: string) => {
    const newPipeline = { ...selectedPipeline };
    newPipeline.name = name;
    setSelectedPipeline(newPipeline);
  }, 10);

  const handleSchemaChange = makeDebouncer(
    (schema: string, isOutgoing: boolean) => {
      const newPipeline = { ...selectedPipeline };
      if (isOutgoing) {
        newPipeline.outgoing_schema = schema;
      } else {
        newPipeline.incoming_schema = schema;
      }
      setSelectedPipeline(newPipeline);
    },
    30
  );

  const handleTopicChange = makeDebouncer(
    (topic: string, topicType: 'source' | 'target') => {
      const newPipeline = { ...selectedPipeline };
      if (topicType === 'source') {
        newPipeline.source_topic = topic;
      } else if (topicType === 'target') {
        newPipeline.target_topic = topic;
      }

      setSelectedPipeline(newPipeline);
    },
    30
  );

  const handleRedirectTopicChange = makeDebouncer((topic: string) => {
    setSelectedPipeline({
      ...selectedPipeline,
      redirect_topic: topic,
    });
  }, 30);

  return (
    <TabPanel value={tabValue} index={0}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'Column',
          gap: 0,
        }}
      >
        <Typography>Pipeline Name</Typography>
        <Input
          required
          sx={{
            width: '300px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
          onChange={(event) =>
            handleSelectedPipelineNameChange(event.target.value)
          }
          value={selectedPipeline.name}
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
              value={handleDefaultSchemaValues(true)}
              isClearable
              styles={getCustomStyles(mode) as CustomStyles}
              onChange={(selectedOption) => {
                const value = selectedOption
                  ? (selectedOption as SelectedOption).value
                  : 'Select incoming schema...';
                handleSchemaChange(value, false);
              }}
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
            value={handleDefaultTopicValues(true)}
            styles={getCustomStyles(mode)}
            onChange={(selectedOption) => {
              const value = selectedOption
                ? (selectedOption as SelectedOption).value
                : 'Select incoming topic...';
              handleTopicChange(value, 'source');
            }}
          />
        </Box>{' '}
        <Box>
          <Typography>Target Topic</Typography>
          <Select
            options={topics.map((topic) => ({
              value: topic,
              label: topic,
            }))}
            value={handleDefaultTopicValues(false)}
            isClearable
            styles={getCustomStyles(mode)}
            onChange={(selectedOption) => {
              const value = selectedOption
                ? (selectedOption as SelectedOption).value
                : 'Select outgoing topic...';
              handleTopicChange(value, 'target');
            }}
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
              value={handleDefaultSchemaValues(false)}
              isClearable
              styles={getCustomStyles(mode)}
              onChange={(selectedOption) => {
                const value = selectedOption
                  ? (selectedOption as SelectedOption).value
                  : 'Select outgoing schema...';
                handleSchemaChange(value, true);
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography>Topic On Fail</Typography>
            <Select
              options={topics.map((topic) => ({
                value: topic,
                label: topic,
              }))}
              value={handleDefaultDLQ(true)}
              isClearable
              styles={getCustomStyles(mode) as CustomStyles}
              onChange={(selectedOption) => {
                const value = selectedOption
                  ? (selectedOption as { value: string }).value
                  : 'Select a DLQ...';
                handleRedirectTopicChange(value);
              }}
            />
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <CurrentPipelineProcessors
          selectedPipeline={selectedPipeline}
          processorOptions={processorOptions}
          topics={topics}
          mode={mode}
          setSelectedPipeline={setSelectedPipeline}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={() =>
              handleDisplayNewProcessorSelect(
                'transformation',
                selectedPipeline.steps.processors.length
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
                selectedPipeline.steps.processors.length
              )
            }
            variant='contained'
            startIcon={<AddIcon />}
            sx={{ width: 'fit-content', alignSelf: 'flex-start' }}
          >
            Add Filter
          </Button>
        </Box>
      </Box>
    </TabPanel>
  );
};

export default ModalTabDesignPipeline;
