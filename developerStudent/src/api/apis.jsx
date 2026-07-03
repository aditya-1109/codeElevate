export const authApis = {
  register: "auth/register",
  login: "auth/login",
  registerRequest: "auth/register-request",
  validateReferral: "auth/validate-referral",
  forgotPassword: "auth/forgot-password"
};

export const studentApis = {
  getProfile: "student/profile", // takes userId as param
  updateProfile: "student/profile", // takes userId as param
  updateResume: "student/resume" // takes studentId as param
};

export const projectApis = {
  getLive: "projects/live",
  submitLive: "projects/live/submit",
  approveLive: "projects/live/approve",
  getPractice: "projects/practice",
  requestApk: "projects/practice/apk",
  submitPractice: "projects/practice/submit"
};

export const sessionApis = {
  getSessions: "sessions", // takes studentId as param
  bookSession: "sessions/book",
  getSlots: "sessions/slots"
};

export const jobApis = {
  getJobs: "jobs",
  applyJob: "jobs/apply"
};
