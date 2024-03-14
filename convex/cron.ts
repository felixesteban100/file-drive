import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// this ain't working :| and dunno why
crons.interval(
  "clear trash can",
  { minutes: 1 },
  internal.files.clearTrashCron,
);

export default crons