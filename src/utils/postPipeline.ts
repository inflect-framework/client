import axios from 'axios';

export const postPipeline = async (
  sourceTopic: string,
  targetTopic: string,
  processor: string
) => {
  const body = {
    sourceTopic,
    targetTopic,
    processor,
  };

  try {
    const response = await axios.post(
      'http://localhost:3000/create_transformation',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Error:', error);
  }
};
