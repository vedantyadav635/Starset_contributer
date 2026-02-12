// API Configuration
// This file centralizes all API endpoints for easy configuration

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
    // Admin endpoints
    ADMIN_TASKS: `${API_URL}/admin/tasks`,

    // Contributor endpoints
    CONTRIBUTOR_TASKS: `${API_URL}/contributor/tasks`,

    // Submission endpoints
    SUBMIT_AUDIO: `${API_URL}/submissions/audio`,
    SUBMIT_IMAGE: `${API_URL}/submissions/image`,
    SUBMIT_TEXT: `${API_URL}/submissions/text`,

    // User submissions (check completed tasks)
    USER_SUBMISSIONS: (userId: string) => `${API_URL}/user/submissions/${userId}`,
    CHECK_TASK_COMPLETION: (userId: string, taskId: string) =>
        `${API_URL}/user/submissions/${userId}/task/${taskId}`,
};

export { API_URL };
