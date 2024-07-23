import { Processor } from "./processor";

interface Steps {
  dlq: Array<string | null>;
  processors: Array<number | null>;
}

export interface Pipeline {
  id: number;
  name: string;
  source_topic: string;
  target_topic: string;
  transformation_name: string;
  steps: Steps;
  is_active: boolean;
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
