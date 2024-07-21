import axios from "axios";

export const getTestResults = async (
  selectedIncomingSchemaFormat,
  testEvent,
  steps
) => {
  const body = {
    format: selectedIncomingSchemaFormat,
    event: testEvent,
    steps: steps,
  };
  try {
    const result = await axios.post(
      "http://localhost:3010/test_pipeline",
      body
    );
    return result.data;
  } catch (error) {
    console.error("Error attempting to test generated event:", error);
  }
};
