// API Configuration
// This file centralizes all API endpoints for easy configuration

// Sanitize and resolve the backend API URL.
// If VITE_API_URL is empty, "/", or locally misconfigured, fallback to Render backend.
let envApi = import.meta.env.VITE_API_URL;
if (typeof envApi === 'string') envApi = envApi.trim();
if (!envApi || envApi === '/' || envApi === '') {
    envApi = 'https://starset-contributer.onrender.com';
} else if (envApi.endsWith('/')) {
    envApi = envApi.slice(0, -1); // remove trailing slash
}
const API_URL = envApi;

export const API_ENDPOINTS = {
    // Admin endpoints
    ADMIN_TASKS: `${API_URL}/admin/tasks`,
    ADMIN_STATS: `${API_URL}/admin/stats`,
    DELETE_TASK: (taskId: string) => `${API_URL}/admin/tasks/${taskId}`,
    ADMIN_SUBMISSIONS: `${API_URL}/admin/submissions`,
    ADMIN_SUBMISSIONS_PENDING: `${API_URL}/admin/submissions/pending`,
    APPROVE_SUBMISSION: (id: string) => `${API_URL}/admin/submissions/${id}/approve`,
    REJECT_SUBMISSION: (id: string) => `${API_URL}/admin/submissions/${id}/reject`,

    // Contributor endpoints
    CONTRIBUTOR_TASKS: `${API_URL}/contributor/tasks`,

    // Submission endpoints
    SUBMIT_AUDIO: `${API_URL}/submissions/audio`,
    SUBMIT_IMAGE: `${API_URL}/submissions/image`,
    SUBMIT_TEXT: `${API_URL}/submissions/text`,

    // User submissions (check completed tasks)
    USER_SUBMISSIONS: (userId: string) => `${API_URL}/user/submissions/${userId}`,
    USER_STATS: (userId: string) => `${API_URL}/user/stats/${userId}`,
    CHECK_TASK_COMPLETION: (userId: string, taskId: string) =>
        `${API_URL}/user/submissions/${userId}/task/${taskId}`,
};

export { API_URL };
