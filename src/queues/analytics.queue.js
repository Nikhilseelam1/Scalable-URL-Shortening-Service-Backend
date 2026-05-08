import { Queue } from "bullmq";
import redis from "../config/redis.js";
import { QUEUE_NAMES } from "../config/constants.js";

const analyticsQueue = new Queue(QUEUE_NAMES.ANALYTICS, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const addAnalyticsJob = async (data) => {
  await analyticsQueue.add(QUEUE_NAMES.ANALYTICS, data);
};

export default analyticsQueue;