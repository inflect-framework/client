import axios from 'axios';
import { Schema, SchemaFormat } from '../types/schema';

export const postTestEvent = async (
  schema: Schema,
  schemaType: SchemaFormat = 'avro'
): Promise<JSON> => {
  try {
    const result = await axios.post('http://localhost:3000/test_event', {
      format: schemaType,
      // schema: schema.schema,
    });
    return result.data;
  } catch (error) {
    console.error('Error posting test event:', error);
  }
};
