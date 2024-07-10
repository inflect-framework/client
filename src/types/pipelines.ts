import { Processor } from './processor';

export interface Pipeline {
  id: number;
  source_topic: string;
  target_topic: string;
  transformation_name: string;
  active_state: boolean;
}

export type PipelineTuple = [string, string, string, boolean, number];

export interface PipelineStep extends Processor {
  redirect_topic?: string;
}

export interface FrontendPipeline {
  name: string;
  sourceTopic: string | null;
  targetTopic: string | null;
  incomingSchema: string | null;
  outgoingSchema: {
    name: string | null;
    redirectTopic: string | null;
  };
  steps: PipelineStep[] | [];
}
