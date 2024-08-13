import axios from 'axios';
import z from 'zod';

const getTestResultsSchema = z.object({
  event: z.string().min(1),
  steps: z.array(z.string()),
  dlqs: z.array(z.string().nullable()),
});

interface TestResultsArgs {
  event: string;
  steps: string[];
  dlqs: (string | null)[];
}

export const getTestResults = async ({
  event,
  steps,
  dlqs,
}: TestResultsArgs) => {
  const body = {
    event,
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
