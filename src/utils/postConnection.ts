import axios from 'axios';

interface PostConnectionResult {
  sourceTopic: string;
  targetTopic: string;
  transformation: string;
}

export const postConnection = async (
  sourceTopic: string,
  targetTopic: string,
  transformation: string
) => {
  const body = {
    sourceTopic,
    targetTopic,
    transformation,
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
