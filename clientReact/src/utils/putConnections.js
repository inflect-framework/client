import axios from 'axios'

export const putConnection = async (id, connectionActiveState) => {
  try {
    const result = await axios.put(`http://localhost:3000/connection/${id}`, {
      connectionActiveState
    });
    
    return result.data;
  } catch (error) {
    console.error('Error pausing/unpausing connection:', error)
  }
};