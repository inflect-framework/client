export interface Pipeline {
  id: number;
  source_topic: string;
  target_topic: string;
  transformation_name: string;
  active_state: boolean;
}

export type PipelineTuple = [string, string, string, boolean, number];

export interface FrontendPipeline {
  subscribeTopic: string;
  publishTopic: string;
  incomingSchema: string;
  outgoingSchema: {
    value: string;
    redirectTopic: string;
  };
  processes: {
    type: string;
    value: string;
    redirectTopic?: string;
  }[];
}
