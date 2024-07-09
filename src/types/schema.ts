export type SchemaFormat = 'avro' | 'json' | 'protobuf';

export interface Schema {
  schema: string;
  format: SchemaFormat;
}
