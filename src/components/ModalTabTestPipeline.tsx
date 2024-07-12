import TabPanel from './TabPanel';
import { Box, Typography, Button, TextField } from '@mui/material';
import { getCustomStyles } from '../utils/getCustomStyles';
import Select from 'react-select';
import { SelectedOption } from '../types/SelectedOption';
import { Processor } from '../types/processor';
import { SchemaFormat } from '../types/schema';
import React from 'react';
import { getTestResults } from '../utils/getTestResults';
import Editor from '@monaco-editor/react';
import { postTestEvent } from '../utils/postTestEvent';

interface ModalTabTestPipelineProps {
  tabValue: number;
  incomingSchema: string | null;
  schemaType: SchemaFormat;
  setSchemaType: React.Dispatch<React.SetStateAction<SchemaFormat>>;
  mode: 'light' | 'dark';
  selectedIncomingSchemaFormat: string | null;
  testEvent: string;
  setTestEvent: React.Dispatch<React.SetStateAction<string>>;
  steps: Processor[];
  testResult: string;
  setTestResult: React.Dispatch<React.SetStateAction<string>>;
}

const ModalTabTestPipeline = ({
  tabValue,
  incomingSchema,
  schemaType,
  setSchemaType,
  mode,
  selectedIncomingSchemaFormat,
  testEvent,
  setTestEvent,
  steps,
  testResult,
  setTestResult,
}: ModalTabTestPipelineProps) => {
  const handleTest = () => {
    const request = async () => {
      return await getTestResults(
        selectedIncomingSchemaFormat,
        testEvent,
        steps
      );
    };

    const result = request().then((res) => {
      // console.log('result!!!!', res);
      setTestResult(JSON.stringify(res.transformedMessage, null, 2));
    });
    // console.log('Attempt to test result:', result);
    // setTestResult(result);
    return result;
  };

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

  return (
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
          <Button onClick={handleTest} variant='contained' color='secondary'>
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
  );
};

export default ModalTabTestPipeline;
