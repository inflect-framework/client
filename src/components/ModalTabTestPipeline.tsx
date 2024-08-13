import React, { useState } from 'react';
import TabPanel from './TabPanel';
import { Box, Typography, Button, TextField } from '@mui/material';
import { SchemaFormat } from '../types/schema';
import { getTestResults } from '../utils/getTestResults';
import { Editor, loader } from '@monaco-editor/react';
import { postTestEvent } from '../utils/postTestEvent';
import { Pipeline } from '../types/pipelines';
import { postPipeline } from '../utils/postPipeline';
import { Processor } from '../types/processor';
import DialogPipelineCreationWarning from './DialogPipelineCreationWarning';
import { putPipeline } from '../utils/putPipeline';
import { CheckCircle, Error, PendingOutlined, Cancel } from '@mui/icons-material';


loader.init().then(monaco => {
  monaco.editor.defineTheme('inflectNavyTheme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: 'ffa500', fontStyle: 'italic underline' },
      { token: 'keyword', foreground: '1DBF73' }
    ],
    colors: {
      'editor.background': '#03091F',
      'editor.foreground': '#FFFFFF'
    }
  });
});

type ProcessingResult = { name: string; status: 'success' | 'error' | 'pending'; filtered: boolean };

interface ModalTabTestPipelineProps {
  selectedPipeline: Pipeline;
  tabValue: number;
  schemaType: SchemaFormat;
  testEvent: string;
  setTestEvent: React.Dispatch<React.SetStateAction<string>>;
  testResult: string;
  setTestResult: React.Dispatch<React.SetStateAction<string>>;
  processorOptions: Processor[];
  pipelines: Pipeline[];
  processingResults: ProcessingResult[];
  setProcessingResults: React.Dispatch<React.SetStateAction<ProcessingResult[]>>;
}

const ModalTabTestPipeline = ({
  selectedPipeline,
  tabValue,
  schemaType,
  testEvent,
  setTestEvent,
  testResult,
  setTestResult,
  processorOptions,
  pipelines,
  processingResults,
  setProcessingResults,
}: ModalTabTestPipelineProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogCallback, setDialogCallback] = useState<() => void>(() => {});
  const [isConfirmDialog, setIsConfirmDialog] = useState(false);
  const [selectedIncomingSchemaFormat, setSelectedIncomingSchemaFormat] =
    useState<string>(selectedPipeline.incoming_schema || '');

  const showDialog = (
    title: string,
    message: string,
    callback?: () => void,
    isConfirm: boolean = false
  ) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogCallback(() => callback);
    setIsConfirmDialog(isConfirm);
    setDialogOpen(true);
  };

  const runTest = () => {
    const request = async () => {
      const steps: string[] = selectedPipeline.steps.processors
        .map(
          (processor) =>
            processorOptions.find((p) => p.id === processor)?.processor_name
        )
        .filter((name): name is string => !!name);

      setProcessingResults(steps.map(step => ({ name: step, status: 'pending', filtered: false })));

      const requestBody = {
        event: testEvent,
        steps,
        dlqs: selectedPipeline.steps.dlqs,
        incomingSchema: selectedPipeline.incoming_schema,
        outgoingSchema: selectedPipeline.outgoing_schema,
      };

      console.log('Sending test pipeline request:', requestBody);

      return await getTestResults(requestBody);
    };

    request()
      .then((result) => {
        if (!result) {
          console.error(
            'No result returned from test pipeline request',
            'Request body:',
            { testEvent }
          );
          return;
        }
        
        if (result.filteredAt) {
          setTestResult(`Message filtered at step: ${result.filteredAt}`);
          setProcessingResults(prev => 
            prev.map((step, index) => {
              if (index < prev.findIndex(s => s.name === result.filteredAt)) {
                return { ...step, status: 'success', filtered: false };
              } else if (step.name === result.filteredAt) {
                return { ...step, status: 'success', filtered: true };
              } else {
                return { ...step, status: 'error', filtered: false };
              }
            })
          );
        } else {
          setTestResult(JSON.stringify(result.transformedMessage, null, 2));
          setProcessingResults(prev => prev.map(step => ({ ...step, status: 'success', filtered: false })));
        }
      })
      .catch((error) => {
        console.error('Error attempting to test generated event:', error);
        setTestResult('Error occurred during pipeline test');
        setProcessingResults(prev => prev.map(step => ({ ...step, status: 'error', filtered: false })));
      });
  };

  const countStringInstancesInArray = (str: string, arr: unknown[]) => {
    str = str.trim().toLowerCase();
    return arr.reduce((acc: number, val) => {
      if (typeof val !== 'string') return acc;

      val = val.trim().toLowerCase();
      if (val === str) {
        acc += 1;
      }

      return acc;
    }, 0);
  };

  const handleTest = () => {
    const checkName = () => {
      if (!selectedPipeline.name) {
        showDialog('Error', 'Pipeline must have a unique name');
        return;
      }
      if (countStringInstancesInArray(selectedPipeline.name, pipelines) > 1) {
        showDialog('Error', 'Pipeline name is not unique');
        return;
      }
      checkIncomingSchema();
    };

    const checkIncomingSchema = () => {
      if (!selectedPipeline.incoming_schema) {
        showDialog('Error', 'No incoming schema selected');
        return;
      }
      checkOutgoingSchema();
    };

    const checkOutgoingSchema = () => {
      console.log('outgoing schema:', selectedPipeline.outgoing_schema);
      if (!selectedPipeline.outgoing_schema) {
        showDialog(
          'Warning',
          `No outgoing schema selected. Pipeline will not be validated against an outgoing schema.\n\nWould you like to continue?`,
          checkTargetTopic,
          true
        );
      } else {
        checkTargetTopic();
      }
    };

    const checkTargetTopic = () => {
      if (!selectedPipeline.target_topic) {
        showDialog('Error', 'No target topic selected');
        return;
      }
      checkTestEvent();
    };

    const checkTestEvent = () => {
      if (!testEvent) {
        showDialog('Error', 'No test event generated, unable to run test');
        return;
      }
      checkDLQs();
    };

    const checkDLQs = () => {
      if (selectedPipeline.steps.dlqs.length === 0) {
        showDialog(
          'Warning',
          `No DLQs selected. This pipeline will republish nonconforming messages to its target topic, "${selectedPipeline.target_topic}."\n\nWould you like to continue?`,
          checkProcessors,
          true
        );
      } else {
        checkProcessors();
      }
    };

    const checkProcessors = () => {
      if (selectedPipeline.steps.processors.length === 0) {
        showDialog(
          'Warning',
          `No processors selected. If you simply wish to redirect to the topic "${selectedPipeline.target_topic}", implementation in a Kafka stream processor is preferred.\n\nWould you like to continue?`,
          runTest,
          true
        );
      } else {
        runTest();
      }
    };

    checkName();
  };

  const pipelineServerPost = () => {
    const pipelineCopy = JSON.parse(JSON.stringify(selectedPipeline));
    if (pipelineCopy.redirect_topic === '') {
      pipelineCopy.redirect_topic = pipelineCopy.target_topic;
    }

    console.log('selectedPipeline:', pipelineCopy);
    const isNewPipeline = isNaN(selectedPipeline.id);
    showDialog(
      'Confirm Pipeline Creation',
      `Are you sure you want to ${
        isNewPipeline ? 'create' : 'update'
      } this pipeline?`,
      async () => {
        const result = isNewPipeline
          ? await postPipeline(pipelineCopy)
          : await putPipeline(pipelineCopy);
        // const result = await postPipeline(selectedPipeline);
        console.log(result);
      },
      true
    );
  };

  const createEditableTestEvent = () => {
    if (!selectedPipeline.incoming_schema) {
      showDialog('Error', 'No incoming schema selected', () => {});
      return;
    }

    const request = async () => {
      const result = await postTestEvent({
        schema: selectedPipeline.incoming_schema,
        format: schemaType as SchemaFormat,
      });

      setTestEvent(JSON.stringify(result, null, 2));
    };

    request();
  };

  return (
    <TabPanel value={tabValue} index={1}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Button
            onClick={createEditableTestEvent}
            variant='contained'
            color='primary'
            sx={{ mr: 2 }}
          >
            Generate New Test Event
          </Button>
          <Button onClick={handleTest} variant='contained' color='primary'>
            Test
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, height: '450px' }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant='subtitle1'>
              Test Event:
            </Typography>
            <Box sx={{ flex: 1 }}>
              <Editor
                height='100%'
                language='json'
                value={testEvent}
                onChange={(value) => setTestEvent(value || '')}
                theme='inflectNavyTheme'
                options={{
                  minimap: {
                    enabled: false
                  },
                  scrollbar: {
                    vertical: 'hidden',
                    horizontal: 'hidden'
                  },
                  overviewRulerBorder: false,
                  overviewRulerLanes: 0,
                  hideCursorInOverviewRuler: true,
                  glyphMargin: false,
                  folding: false,
                  lineNumbers: 'off',
                  renderLineHighlight: 'none',
                  renderValidationDecorations: 'off',
                  wordWrap: 'on'
                }}
                beforeMount={(monaco) => {
                  monaco.editor.setTheme('inflectNavyTheme');
                }}
              />
            </Box>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant='subtitle1'>Result:</Typography>
            <TextField
              multiline
              fullWidth
              rows={16}
              variant='outlined'
              value={testResult}
              InputProps={{
                readOnly: true,
                sx: { height: '100%' },
                classes: {
                  root: testResult ? 'has-content' : '',
                },
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
              Steps:
            </Typography>
            <Box sx={{ mt: 2, flex: 1 }}>
            {processingResults.map((step, index) => (
              <Typography 
                key={index} 
                color={step.filtered ? 'error' : step.status === 'success' ? '#1DBF73' : step.status === 'error' ? 'error' : 'inherit'}
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                {step.status === 'success' && !step.filtered && <CheckCircle sx={{color: "#1DBF73"}} />}
                {step.status === 'success' && step.filtered && <Cancel color="error" />}
                {step.status === 'error' && <Error color="error" />}
                {step.status === 'pending' && <PendingOutlined color="action" />}
                {step.name}
              </Typography>
            ))}
          </Box>
          </Box>
        </Box>
        <Button
          onClick={() => pipelineServerPost()}
          variant='contained'
          color='secondary'
          sx={{ width: 'fit-content', alignSelf: 'flex-start', mt: 2, color: '#03091F', backgroundColor: '#189E64' }}
        >
          {isNaN(selectedPipeline.id) ? 'Create Pipeline' : 'Update Pipeline'}
        </Button>
      </Box>
      <DialogPipelineCreationWarning
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={
          isConfirmDialog
            ? () => {
                setDialogOpen(false);
                dialogCallback && dialogCallback();
              }
            : undefined
        }
        onAcknowledge={
          !isConfirmDialog
            ? () => {
                setDialogOpen(false);
                dialogCallback && dialogCallback();
              }
            : undefined
        }
      />
    </TabPanel>
  );
};

export default ModalTabTestPipeline;
