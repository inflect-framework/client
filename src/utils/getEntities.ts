import axios from 'axios';
import { Pipeline } from '../types/pipelines';
import { Processor } from '../types/processor';

export const getPipelines = async (): Promise<Pipeline[]> => {
  try {
    const result = await axios.get('http://localhost:3010/pipelines');
    return result.data;
  } catch (error) {
    console.error('Error getting pipelines:', error);
  }
};

interface TopicsSchemas {
  schemas: string[];
  topics: string[];
}

export const getTopicsAndSchemas = async (): Promise<TopicsSchemas> => {
  try {
    const result = await axios.get('http://localhost:3010/topics_schemas');
    return result.data;
  } catch (error) {
    console.error('Error getting topics and schemas', error);
  }
};

export const getProcessors = async (): Promise<Processor[]> => {
  try {
    const result = await axios.get('http://localhost:3010/processors');
    return result.data;
  } catch (error) {
    console.error('Error getting processes:', error);
  }
};
