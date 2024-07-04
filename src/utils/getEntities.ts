import axios from 'axios';
import { Connection } from '../types/connection';

export const getConnections = async (): Promise<Connection[]> => {
  try {
    const result = await axios.get('http://localhost:3000/connections');
    return result.data;
  } catch (error) {
    console.error('Error getting connections:', error);
  }
};
