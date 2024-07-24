import axios from 'axios';
import z from 'zod';

const getTestResultsSchema = z.object({
  format: z.string().min(1),
  event: z.string().min(1),
  steps: z.array(z.string().nullable()),
  dlqs: z.array(z.string().nullable()).min(1),
});

interface TestResultsArgs {
  selectedIncomingSchemaFormat: string;
  testEvent: string;
  steps: string[];
  dlqs: (string | null)[];
}

export const getTestResults = async ({
  selectedIncomingSchemaFormat,
  testEvent,
  steps,
  dlqs,
}: TestResultsArgs) => {
  const body = {
    format: selectedIncomingSchemaFormat,
    event: testEvent,
    steps,
    dlqs,
  };
  console.log('Test pipeline request body:', body);
  try {
    const result = await axios.post(
      'http://localhost:3010/test_pipeline',
      getTestResultsSchema.parse(body)
    );
    return result.data;
  } catch (error) {
    console.error('Error attempting to test generated event:', error);
  }
};
