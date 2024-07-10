import axios from 'axios';
import {FrontendPipeline} from '../types/pipelines'

export const postPipeline = async (pipeline: FrontendPipeline
) => {

  try {
    const response = await axios.post(
      'http://localhost:3000/create_pipeline',
      pipeline
    );
    return response;
  } catch (error) {
    console.error('Error:', error);
  }
};
