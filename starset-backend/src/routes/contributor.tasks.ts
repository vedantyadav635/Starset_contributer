import { Router } from "express";
import { supabase } from "../db/supabase";

const router = Router();

/**
 * GET ACTIVE TASKS FOR CONTRIBUTORS
 */
router.get("/", async (_req, res) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("status", "active")
    .eq("visibility", "public")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.json(data);
});

export default router;
