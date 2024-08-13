interface Steps {
  dlqs: Array<string | null>;
  processors: Array<number | null>;
}

export interface Pipeline {
  id: number;
  name: string;
  incoming_schema: string;
  outgoing_schema: string;
  source_topic: string;
  target_topic: string;
  steps: Steps;
  is_active: boolean;
  redirect_topic: string;
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
  steps: Steps;
}

export interface ProcessingResult {
  name: string;
  status: 'success' | 'error' | 'pending';
  filtered: boolean;
}