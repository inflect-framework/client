import axios from 'axios';

export const getConnections = async () => {
  try {
    const result = await axios.get('http://localhost:3000/connections');
    console.log(result)
    return result.data;
  } catch (error) {
    console.error('Error getting connections:', error)
  }
  
  // return Promise.resolve(mockQueryResult);
};
