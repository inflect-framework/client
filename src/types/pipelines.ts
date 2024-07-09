export interface Pipeline {
  id: number;
  source_topic: string;
  target_topic: string;
  transformation_name: string;
  active_state: boolean;
}

export type PipelineTuple = [string, string, string, boolean, number];
