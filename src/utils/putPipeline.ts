import axios from 'axios';
import z from 'zod';

const putPipelineSchema = z.object({
  id: z.number(),
  name: z.string(),
  incoming_schema: z.string(),
  outgoing_schema: z.string(),
  redirect_topic: z.string(),
  source_topic: z.string(),
  target_topic: z.string(),
  steps: z.object({
    dlqs: z.array(z.string().nullable()).optional(),
    processors: z.array(z.number().nullable()),
  }),
  is_active: z.boolean(),
});

type PutPipelineType = z.infer<typeof putPipelineSchema>;

export const putPipeline = async (putPipeline: PutPipelineType) => {
  try {
    console.log('PUT Pipeline:', putPipeline);
    const result = await axios.put(
      `http://localhost:3010/pipeline`,
      putPipelineSchema.parse(putPipeline)
    );

    return result.data;
  } catch (error) {
    console.error('Error pausing/unpausing pipeline:', error);
  }
};
