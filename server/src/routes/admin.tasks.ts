import { Router } from "express";
import { supabase } from "../db/supabase";
import { validate, CreateTaskSchema } from "../middleware/validate";

const router = Router();

/**
 * POST /admin/tasks
 */
router.post("/", validate(CreateTaskSchema), async (req, res) => {
  try {
    console.log("📥 Incoming task:", req.body);

    const {
      title,
      type,
      compensation,
      currency,
      estimated_time_min,
      status,
      language,
      project,
      difficulty,
      prompt,
      instructions,
      ai_capability,
      data_usage,
      image_url,
      requirements,
    } = req.body;

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title,
          type,
          compensation,
          currency,
          estimated_time_min,
          status,
          language,
          project,
          difficulty,
          prompt,
          instructions,
          ai_capability,
          data_usage,
          image_url,
          requirements,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase error:", error);
      return res.status(500).send(error.message);
    }

    console.log("✅ Task saved:", data);
    res.status(201).json(data);

  } catch (err) {
    console.error("🔥 Server crash:", err);
    res.status(500).send("Server error");
  }
});

/**
 * GET /admin/tasks
 * Fetch all tasks from Supabase
 */
router.get("/", async (req, res) => {
  try {
    console.log("📥 Fetching all tasks from Supabase...");

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    const taskIds = data?.map((t: any) => t.id) || [];
    let countMap: Record<string, number> = {};
    if (taskIds.length > 0) {
      try {
        const { data: counts, error: countError } = await supabase
          .from("submissions")
          .select("task_id")
          .in("task_id", taskIds);

        if (!countError) {
          for (const row of counts ?? []) {
            countMap[row.task_id] = (countMap[row.task_id] || 0) + 1;
          }
        }
      } catch (err) {
        console.error("⚠️ Error fetching submission counts:", err);
      }
    }

    const tasksWithCounts = data?.map((t: any) => ({
      ...t,
      submission_count: countMap[t.id] ?? 0
    })) || [];

    console.log(`✅ Fetched ${tasksWithCounts.length} tasks with counts`);
    res.status(200).json(tasksWithCounts);

  } catch (err) {
    console.error("🔥 Server crash:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * DELETE /admin/tasks/:id
 * Soft-delete: sets task status to 'deleted' (keeps in DB for stats)
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🗑️ Soft-deleting task:", id);

    const { data, error } = await supabase
      .from("tasks")
      .update({ status: "deleted" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("✅ Task soft-deleted:", data);
    res.status(200).json(data);

  } catch (err) {
    console.error("🔥 Server crash:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
