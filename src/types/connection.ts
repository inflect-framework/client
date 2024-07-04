export interface Connection {
  id: number;
  source_topic: string;
  target_topic: string;
  transformation_name: string;
  active_state: boolean;
}
