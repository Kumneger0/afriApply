import * as cron from 'node-cron';
import { parseInterval } from './intervalParser';

export class TaskScheduler {
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  addJob(name: string, interval: string, task: () => Promise<void> | void) {
    try {
      const cronPattern = parseInterval(interval);
      const job = cron.schedule(cronPattern, async () => {
        try {
          console.log(`[${new Date().toISOString()}] Running job: ${name}`);
          await task();
          console.log(`[${new Date().toISOString()}] Completed job: ${name}`);
        } catch (error) {
          console.error(`[${new Date().toISOString()}] Error in job ${name}:`, error);
        }
      });

      this.jobs.set(name, job);
      console.log(`Scheduled job "${name}" with interval: ${interval} (cron: ${cronPattern})`);
    } catch (error) {
      console.error(`Failed to schedule job "${name}":`, error);
      throw error;
    }
  }

  removeJob(name: string) {
    const job = this.jobs.get(name);
    if (job) {
      job.stop();
      this.jobs.delete(name);
      console.log(`Stopped job: ${name}`);
    }
  }

  stopAll() {
    this.jobs.forEach((job, name) => {
      job.stop();
      console.log(`Stopped job: ${name}`);
    });
    this.jobs.clear();
  }

  listJobs() {
    return Array.from(this.jobs.keys());
  }
}

export const scheduler = new TaskScheduler();