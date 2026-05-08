import { Worker } from "bullmq";
import redis from "../config/redis.js";
import { QUEUE_NAMES } from "../config/constants.js";
import * as analyticsRepository from "../repositories/analytics.repository.js";
import logger from "../logging/logger.js";

const analyticsWorker = new Worker(
  QUEUE_NAMES.ANALYTICS,
  async (job) => {
    const { shortCode, ipHash, browser, os, device, referrer } = job.data;

    await analyticsRepository.createEvent({
      shortCode,
      ipHash,
      browser,
      os,
      device,
      referrer,
    });

    logger.info(`Analytics job processed for shortCode: ${shortCode}`);
  },
  {
    connection: redis,
    concurrency: 10,
  }
);

analyticsWorker.on("failed", (job, error) => {
  logger.error(`Analytics job ${job.id} failed: ${error.message}`);
});

analyticsWorker.on("completed", (job) => {
  logger.info(`Analytics job ${job.id} completed`);
});

export default analyticsWorker;