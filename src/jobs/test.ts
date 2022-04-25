// import * as cron from "node-cron";
import { Queue, Worker, QueueEvents, Job } from "bullmq";
import IORedis from "ioredis";

const key = "TestKey";

const jobWorker = async (job: Job) => {
    console.log("[TEST QUEUE]: Job running...", job.data);
};

const testQueue = new Queue(key, {
  connection: new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
  }),
});

new Worker(key, jobWorker, {
  connection: new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
  })
});

const testQueueEvents = new QueueEvents(key, {
  connection: new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
  })
});

testQueueEvents.on("failed", ()  => {
  console.log("[TEST QUEUE]: Queue job failed");
});

testQueueEvents.on("completed", () => {
  console.log("[TEST QUEUE]: Queue job completed");
});

testQueueEvents.on("error", () => {
  console.log("[TEST QUEUE]: Queue job error");
});

//schedule a cron job to run every 4 hours
export const TestJob = async () => {
  if(await testQueue.count() > 0) {
    console.log("[TEST QUEUE]: Worker is busy, returning...");
    return;
  }

  for(const test of ["I am a test", "I am a test2", "I am a test3"]) {
    testQueue.add("realtime", { test });
  }
};