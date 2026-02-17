import { Router } from "express";
import { supabase } from "../db/supabase";

const router = Router();

/**
 * POST /admin/tasks
 */
router.post("/", async (req, res) => {
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

    console.log(`✅ Fetched ${data?.length || 0} tasks`);
    res.status(200).json(data || []);

  } catch (err) {
    console.error("🔥 Server crash:", err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
