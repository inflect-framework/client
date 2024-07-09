import axios from 'axios';
import { Pipeline } from '../types/pipelines';
import { topics, subjects, schemas, processes } from './sampleTopicsAndSchemas';
import { Schema } from '../types/schema';
import { Process } from '../types/process';

export const getPipelines = async (): Promise<Pipeline[]> => {
  try {
    const result = await axios.get('http://localhost:3000/pipelines');
    return result.data;
  } catch (error) {
    console.error('Error getting pipelines:', error);
  }
};

// export const getSchemas = async (): Promise<Schema[]> => {
//   try {
//     const result = await Promise.resolve({ data: schemas });
//     return result.data;
//   } catch (error) {
//     console.error('Error getting schemas:', error);
//   }
// };

// export const getTopics = async (): Promise<string[]> => {
//   try {
//     const result = await Promise.resolve({ data: topics });
//     return result.data;
//   } catch (error) {
//     console.error('Error getting topics:', error);
//   }
// };

interface TopicsSchemas {
  schemas: Schema[];
  topics: string[];
}

export const getTopicsAndSchemas = async (): Promise<TopicsSchemas> => {
  try {
    const result = await axios.get('http://localhost:3000/topics_schemas');
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.error('Error getting topics and schemas', error);
  }
};

// const processes = [
//   { id: 1, name: 'capitalize', is_filter: false },
//   { id: 2, name: 'isString', is_filter: true },
//   { id: 3, name: 'isNumber', is_filter: true },
//   { id: 4, name: 'isBoolean', is_filter: true },
//   { id: 5, name: 'appendSuffix', is_filter: false },
//   { id: 6, processor_name: 'appendPrefix', is_filter: false },
// ];

export const getProcessors = async (): Promise<Process[]> => {
  try {
    const result = await axios.get('http://localhost:3000/processors');
    return result.data;
  } catch (error) {
    console.error('Error getting processes:', error);
  }
};

// TODO:
// change references to connections to pipelines
// ability to add pipelines via post req to create_pipeline
// ability to add/remove transformations/filters from list for a pipeline
