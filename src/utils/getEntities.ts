import axios from "axios";
import { Connection } from "../types/connection";
import { topics, subjects, schemas } from "./sampleTopicsAndSchemas";

export const getConnections = async (): Promise<Connection[]> => {
  try {
    const result = await axios.get("http://localhost:3000/connections");
    return result.data;
  } catch (error) {
    console.error("Error getting connections:", error);
  }
};

interface Schema {
  subject: string;
  schema: string;
}

export const getSchemas = async (): Promise<Schema[]> => {
  try {
    const result = await Promise.resolve({ data: schemas });
    return result.data;
  } catch (error) {
    console.error("Error getting schemas:", error);
  }
};

export const getTopics = async (): Promise<string[]> => {
  try {
    const result = await Promise.resolve({ data: topics });
    return result.data;
  } catch (error) {
    console.error("Error getting topics:", error);
  }
};
