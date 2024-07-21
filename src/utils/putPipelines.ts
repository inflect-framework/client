import axios from "axios";
import z from "zod";

const putPipelineSchema = z.object({
  id: z.number(),
  isActive: z.boolean(),
});

export const putPipeline = async (id: number, isActive: boolean) => {
  try {
    const result = await axios.put(
      `http://localhost:3010/pipeline`,
      putPipelineSchema.parse({
        id,
        isActive,
      })
    );

    return result.data;
  } catch (error) {
    console.error("Error pausing/unpausing pipeline:", error);
  }
};
