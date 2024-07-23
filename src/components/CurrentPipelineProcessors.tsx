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
    const newProcessorId = processorOptions.find(
      (processor) =>
        processor.processor_name === (selectedOption as SelectedOption).value
    )?.id;

    if (!newProcessorId) {
      return;
    }

    selectedPipeline.steps.processors[index] = Number(newProcessorId);
    if (selectedPipeline.steps.hasOwnProperty('dlqs')) {
      selectedPipeline.steps.dlqs[index] = null;
    }

    setSelectedPipeline({ ...selectedPipeline });
  };
  return (
    <>
      {selectedPipeline.steps.processors.map((processor, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            {selectedPipeline.steps.dlqs &&
            selectedPipeline.steps.dlqs.at(index) !==
              null /* todo: add filters */ ? //       isClearable //       // onChange={handleAddFilterTopic} //       }))} //         label: topic, //         value: topic, //       options={topics.map((topic) => ({ //     <Select //     <Typography>Topic On Fail</Typography> //   <Box sx={{ flex: 1 }}> //   </Box> //     /> //       styles={getCustomStyles(mode)} //       isClearable //       } //         handleAddPipelineStep(selectedOption, actionMeta, index) //       onChange={(selectedOption, actionMeta) => //         }))} //           label: processor.processor_name, //           value: processor.processor_name, //         .map((processor) => ({ //         .filter((p) => p.is_filter) //       options={processorOptions //     <Select //     </Typography> //         .indexOf(item) + 1} //         .filter((p) => p.is_filter) //       {displayedProcessorSelectOptions //       Filter{' '} //     <Typography> //   <Box sx={{ flex: 1 }}> // <>
            //       styles={getCustomStyles(mode)}
            //     />
            //   </Box>
            // </>
            null : (
              <>
                <Typography>Transformation </Typography>
                <Select
                  options={processorOptions
                    .filter((p) => !p.is_filter)
                    .map((processorOption) => ({
                      value: processorOption.processor_name,
                      label: processorOption.processor_name,
                    }))}
                  value={handleDefaultProcessorSelect(processor)}
                  isClearable
                  styles={getCustomStyles(mode)}
                  onChange={(selectedOption) =>
                    handleProcessorChange(selectedOption, index)
                  }
                />
              </>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => handleRemovePipelineStep(index)}>
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
    </>
  );
};

export default CurrentPipelineProcessors;
