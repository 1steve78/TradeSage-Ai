import { Queue, Worker } from "bullmq";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import dotenv from "dotenv";
import logger from "./logger.js";
import { queueConfig } from "../config/queue.config.js";

dotenv.config();

const connection = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10)
};

// Initialize server adapter for Bull-Board UI
export const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

export const queues = [];

// Helper to create a Queue and a corresponding Worker
export const createQueue = (name, handler) => {
    const queue = new Queue(name, { 
        connection,
        defaultJobOptions: queueConfig.defaultJobOptions
    });
    
    const worker = new Worker(name, handler, { connection });

    worker.on("completed", (job) => {
        logger.info(`Job ${job.id} completed in queue ${name}`);
    });

    worker.on("failed", (job, err) => {
        logger.error(`Job ${job.id} failed in queue ${name}: ${err.message}`);
    });

    queues.push(new BullMQAdapter(queue));
    
    // Setup bull board
    createBullBoard({
        queues,
        serverAdapter
    });

    return { queue, worker };
};
