import axios from 'axios';

export const putPipeline = async (id: number, pipelineActiveState: boolean) => {
  try {
    const result = await axios.put(`http://localhost:3000/connection/${id}`, {
      pipelineActiveState,
    });

    return result.data;
  } catch (error) {
    console.error('Error pausing/unpausing pipeline:', error);
  }
};
