import axios from 'axios';
import { FrontendPipeline } from '../types/pipelines';
import z from 'zod';

const postPipelineSchema = z.object({
  name: z.string(),
  source_topic: z.string(),
  incoming_schema: z.string(),
  outgoing_schema: z.string(),
  redirect_topic: z.string(),
  target_topic: z.string(),
  steps: z.object({
    dlqs: z.array(z.string().min(1).nullable()).optional(),
    processors: z.array(z.number().nullable()),
  }),
  is_active: z.boolean(),
});

export const postPipeline = async (pipeline: FrontendPipeline) => {
  try {
    const response = await axios.post(
      'http://localhost:3010/create_pipeline',
      postPipelineSchema.parse(pipeline)
    );
    return response;
  } catch (error) {
    console.error('Error:', error);
  }
};
