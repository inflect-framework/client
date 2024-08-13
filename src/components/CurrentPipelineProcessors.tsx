import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Box, IconButton, Typography } from '@mui/material';
import Select, { MultiValue, SingleValue } from 'react-select';
import { Pipeline } from '../types/pipelines';
import { Processor } from '../types/processor';
import { getCustomStyles } from '../utils/getCustomStyles';
import { SelectedOption } from '../types/SelectedOption';

interface CurrentPipelineProcessorsProps {
  selectedPipeline: Pipeline;
  processorOptions: Processor[];
  topics: string[];
  mode: 'light' | 'dark';
  setSelectedPipeline: React.Dispatch<React.SetStateAction<Pipeline>>;
}

const CurrentPipelineProcessors = ({
  selectedPipeline,
  processorOptions,
  topics,
  mode,
  setSelectedPipeline,
}: CurrentPipelineProcessorsProps) => {
  const handleMoveUp = (index: number) => {
    if (index === 0) return;

    const newPipeline = { ...selectedPipeline };
    newPipeline.steps.processors = [...selectedPipeline.steps.processors];

    [
      newPipeline.steps.processors[index],
      newPipeline.steps.processors[index - 1],
    ] = [
      selectedPipeline.steps.processors[index - 1],
      selectedPipeline.steps.processors[index],
    ];

    if (selectedPipeline.steps.hasOwnProperty('dlqs')) {
      newPipeline.steps.dlqs = [...selectedPipeline.steps.dlqs];
      [newPipeline.steps.dlqs[index], newPipeline.steps.dlqs[index - 1]] = [
        selectedPipeline.steps.dlqs[index - 1],
        selectedPipeline.steps.dlqs[index],
      ];
    }

    setSelectedPipeline(newPipeline);
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedPipeline.steps.processors.length - 1) return;

    const newPipeline = { ...selectedPipeline };
    newPipeline.steps.processors = [...selectedPipeline.steps.processors];

    [
      newPipeline.steps.processors[index],
      newPipeline.steps.processors[index + 1],
    ] = [
      selectedPipeline.steps.processors[index + 1],
      selectedPipeline.steps.processors[index],
    ];

    if (selectedPipeline.steps.hasOwnProperty('dlqs')) {
      newPipeline.steps.dlqs = [...selectedPipeline.steps.dlqs];
      [newPipeline.steps.dlqs[index], newPipeline.steps.dlqs[index + 1]] = [
        selectedPipeline.steps.dlqs[index + 1],
        selectedPipeline.steps.dlqs[index],
      ];
    }

    setSelectedPipeline(newPipeline);
  };

  const handleRemovePipelineStep = (index: number) => {
    const newPipeline = { ...selectedPipeline };
    newPipeline.steps.processors = selectedPipeline.steps.processors.filter(
      (_, i) => i !== index
    );
    if (selectedPipeline.steps.hasOwnProperty('dlqs')) {
      newPipeline.steps.dlqs = selectedPipeline.steps.dlqs.filter(
        (_, i) => i !== index
      );
    }
    setSelectedPipeline(newPipeline);
  };

  const handleDefaultProcessorSelect = (id: number | null) => {
    if (id === null) return;

    const selectedProcessor = processorOptions.find(
      (processor) => processor.id === id
    );

    if (!selectedProcessor) {
      return {
        value: '',
        label: '',
      };
    }

    return {
      value: selectedProcessor.processor_name,
      label: selectedProcessor.processor_name,
    };
  };

  const handleProcessorChange = (
    selectedOption:
      | MultiValue<{
          value: string;
          label: string;
        }>
      | SingleValue<{
          value: string;
          label: string;
        }>,
    index: number
  ) => {
    const selectedProcessor = processorOptions.find(
      (processor) =>
        processor.processor_name === (selectedOption as SelectedOption).value
    );

    if (!selectedProcessor) {
      return;
    }

    const newPipeline = { ...selectedPipeline };
    newPipeline.steps.processors[index] = Number(selectedProcessor.id);
    if (newPipeline.steps.hasOwnProperty('dlqs')) {
      newPipeline.steps.dlqs[index] = null;
    }

    setSelectedPipeline(newPipeline);
  };
  
  return (
    <>
      {selectedPipeline.steps.processors.map((processorId, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ flex: 1, mr: 2 }}>
            <Select
              value={handleDefaultProcessorSelect(processorId)}
              onChange={(selectedOption) =>
                handleProcessorChange(selectedOption, index)
              }
              options={processorOptions.map((processor) => ({
                value: processor.processor_name,
                label: `${processor.processor_name} (${processor.is_filter ? 'Filter' : 'Transformation'})`,
              }))}
              styles={getCustomStyles(mode)}
            />
          </Box>
          <Box>
            <IconButton
              onClick={() => handleMoveUp(index)}
              disabled={index === 0}
            >
              <ArrowUpwardIcon />
            </IconButton>
            <IconButton
              onClick={() => handleMoveDown(index)}
              disabled={index === selectedPipeline.steps.processors.length - 1}
            >
              <ArrowDownwardIcon />
            </IconButton>
            <IconButton onClick={() => handleRemovePipelineStep(index)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      ))}
    </>
  );
};

export default CurrentPipelineProcessors;
