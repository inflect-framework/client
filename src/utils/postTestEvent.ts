import axios from 'axios';
import z from 'zod';

const postTestEventSchema = z.object({
  format: z.string().min(1),
  schema: z.string().min(1),
});

interface PostTestEventArgs {
  format: string;
  schema: string;
}

export const postTestEvent = async ({
  schema,
  format,
}: PostTestEventArgs): Promise<JSON> => {
  // JSON.stringify(result, null, 2);
  try {
    const result = await axios.post(
      'http://localhost:3010/test_event',
      postTestEventSchema.parse({
        format,
        schema,
      })
    );
    return result.data;
  } catch (error) {
    console.error('Error posting test event:', error);
  }
};
