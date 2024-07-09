export interface Pipeline {
  id: number;
  source_topic: string;
  target_topic: string;
  transformation_name: string;
  active_state: boolean;
}

export type PipelineTuple = [string, string, string, boolean, number];

export interface FrontendPipeline {
  subscribeTopic: string | null;
  publishTopic: string | null;
  incomingSchema: string | null;
  outgoingSchema: {
    value: string | null;
    redirectTopic: string | null;
  };
  processors: {
    type: string | null;
    value: string | null;
    redirectTopic?: string | null;
  }[];
}
