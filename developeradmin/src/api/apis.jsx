// ─── Auth ─────────────────────────────────────────────────────────────────────
export const AUTH_LOGIN   = "/auth/login";
export const AUTH_REGISTER = "/auth/register";

// ─── Admin — User Management ──────────────────────────────────────────────────
export const ADMIN_GET_USERS        = "/admin/users";
export const ADMIN_CREATE_USER      = "/admin/users";
export const ADMIN_UPDATE_USER      = (userId) => `/admin/users/${userId}`;
export const ADMIN_DELETE_USER      = (userId) => `/admin/users/${userId}`;
export const ADMIN_TOGGLE_VERIFY    = (userId) => `/admin/users/${userId}/verify`;

// ─── Admin — Registration Requests ────────────────────────────────────────────
export const ADMIN_GET_REG_REQUESTS    = "/admin/registration-requests";
export const ADMIN_APPROVE_REG_REQUEST = (requestId) => `/admin/registration-requests/${requestId}/approve`;
export const ADMIN_REJECT_REG_REQUEST  = (requestId) => `/admin/registration-requests/${requestId}/reject`;

// ─── Admin — Sessions ─────────────────────────────────────────────────────────
export const ADMIN_GET_SESSIONS     = "/admin/sessions";
export const ADMIN_COMPLETE_SESSION = "/admin/sessions/complete";
export const ADMIN_GET_SLOTS        = "/sessions/slots";
export const ADMIN_CREATE_SLOT      = "/sessions/slots";
export const ADMIN_DELETE_SLOT      = (slotId) => `/sessions/slots/${slotId}`;


// ─── Jobs ─────────────────────────────────────────────────────────────────────
export const JOBS_GET_ALL    = "/jobs";
export const JOBS_CREATE     = "/jobs";
export const JOBS_UPDATE     = (jobId) => `/jobs/${jobId}`;
export const JOBS_DELETE     = (jobId) => `/jobs/${jobId}`;

// ─── Live Projects ────────────────────────────────────────────────────────────
export const LIVE_GET_ALL    = "/projects/live";
export const LIVE_CREATE     = "/projects/live";
export const LIVE_UPDATE     = (projectId) => `/projects/live/${projectId}`;
export const LIVE_DELETE     = (projectId) => `/projects/live/${projectId}`;
export const LIVE_APPROVE    = "/projects/live/approve";

// ─── Practice Projects ────────────────────────────────────────────────────────
export const PRACTICE_GET_ALL  = "/projects/practice";
export const PRACTICE_CREATE   = "/projects/practice";
export const PRACTICE_UPDATE   = (projectId) => `/projects/practice/${projectId}`;
export const PRACTICE_DELETE   = (projectId) => `/projects/practice/${projectId}`;
export const ADMIN_AUDIT_PRACTICE = "/admin/projects/practice/audit";

