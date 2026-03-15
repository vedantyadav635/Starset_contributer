import { Request, Response, NextFunction } from "express";
import { supabase } from "../db/supabase";

export interface AuthRequest extends Request {
    user?: any;
}

/**
 * Middleware: requireAuth
 * Verifies the Supabase JWT from the Authorization header.
 * Attaches the user object to the request.
 */
export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.split(" ")[1];

    try {
        // 1. Verify token with Supabase (using the standard SDK method)
        // Note: Since the backend uses the Service Role key, we use the token to get the user
        // This verifies the token is valid for a real user.
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error("❌ Auth error:", error?.message);
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        // 2. Fetch the user's role and profile data to be sure
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role, full_name")
            .eq("id", user.id)
            .single();

        if (profileError || !profile) {
            console.error("❌ Profile fetch error:", profileError);
            return res.status(401).json({ error: "User profile not found" });
        }

        // Attach user and profile data to request
        req.user = {
            ...user,
            role: profile.role,
            fullName: profile.full_name
        };

        next();
    } catch (err) {
        console.error("🔥 Auth middleware crash:", err);
        return res.status(500).json({ error: "Internal server authentication error" });
    }
};

/**
 * Middleware: requireAdmin
 * Must be used after requireAuth.
 * Checks if the attached user has the 'admin' role.
 */
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "admin") {
        console.warn(`🚨 Unauthorized admin access attempt by: ${req.user?.email || 'Unknown'}`);
        return res.status(403).json({ error: "Forbidden: Admin privileges required" });
    }
    next();
};
