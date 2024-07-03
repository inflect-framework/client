import axios from 'axios';

export const postConnection = async (
  sourceTopic,
  targetTopic,
  transformation
) => {
  const body = {
    sourceTopic,
    targetTopic,
    transformation,
  };

  try {
    const response = await axios.post(
      'http://localhost:3000/create_transformation',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    return response;
  } catch (error) {
    console.error('Error:', error);
  }
};
