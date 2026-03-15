import { supabase } from "../supabaseClient";

/**
 * Helper to perform authorized fetch requests to the backend.
 * Automatically attaches the Supabase JWT to the Authorization header.
 * @param url The endpoint URL
 * @param options Traditional fetch options
 */
export async function fetchApi(url: string, options: RequestInit = {}) {
    const { data: { session } } = await supabase.auth.getSession();

    const headers = {
        ...options.headers,
        'Authorization': session ? `Bearer ${session.access_token}` : '',
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    return response;
}
