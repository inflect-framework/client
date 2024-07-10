import axios from 'axios';
import { Pipeline } from '../types/pipelines';
import { Schema } from '../types/schema';
import { Process } from '../types/processor';

export const getPipelines = async (): Promise<Pipeline[]> => {
  try {
    const result = await axios.get('http://localhost:3000/pipelines');
    return result.data;
  } catch (error) {
    console.error('Error getting pipelines:', error);
  }
};

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

export const getProcessors = async (): Promise<Process[]> => {
  try {
    const result = await axios.get('http://localhost:3000/processors');
    return result.data;
  } catch (error) {
    console.error('Error getting processes:', error);
  }
};
