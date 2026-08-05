
import {
  textQueue,
  GENERATE_TEXT_JOB,
} from "../infrastructure/bullmq/bullmq.textGeneration.queue.js";

import type { generateTextRequest } from "@repo/types";

export async function enqueueTextGeneration(
  request: generateTextRequest
) {
  return await textQueue.add(GENERATE_TEXT_JOB, {
    text: request.text,
    task: request.task,
    tone: request.tone,
  });
}