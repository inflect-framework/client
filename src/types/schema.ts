export interface Schema {
  subject: string;
  schema: string;
}

export type SchemaFormat = 'avro' | 'json' | 'protobuf';
