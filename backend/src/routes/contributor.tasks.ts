import { Router } from "express";
import { supabase } from "../db/supabase";

const router = Router();

const MAX_SUBMISSIONS_PER_TASK = 100;

/**
 * GET ACTIVE TASKS FOR CONTRIBUTORS
 * Also returns the submission count for each task so the frontend
 * can display a "slots remaining" progress indicator.
 */
router.get("/", async (_req, res) => {
  // 1. Fetch all AVAILABLE tasks
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("status", "AVAILABLE")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!tasks || tasks.length === 0) {
    return res.json([]);
  }

  // 2. For each task, fetch its submission count
  const taskIds = tasks.map((t: any) => t.id);
  const { data: counts, error: countError } = await supabase
    .from("submissions")
    .select("task_id")
    .in("task_id", taskIds);

  if (countError) {
    // Fallback: return tasks without counts rather than failing
    console.error("⚠️ Could not fetch submission counts:", countError.message);
    return res.json(tasks);
  }

  // 3. Build a count map: { [taskId]: number }
  const countMap: Record<string, number> = {};
  for (const row of counts ?? []) {
    countMap[row.task_id] = (countMap[row.task_id] || 0) + 1;
  }

  // 4. Attach submission_count to each task
  const tasksWithCounts = tasks.map((t: any) => ({
    ...t,
    submission_count: countMap[t.id] ?? 0,
    max_submissions: MAX_SUBMISSIONS_PER_TASK,
  }));

  return res.json(tasksWithCounts);
});

export default router;
