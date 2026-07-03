import { Router } from "express";

// Import Controllers
import * as authController from "../controllers/authController.js";
import * as profileController from "../controllers/profileController.js";
import * as projectController from "../controllers/projectController.js";
import * as sessionController from "../controllers/sessionController.js";
import * as jobController from "../controllers/jobController.js";
import * as adminController from "../controllers/adminController.js";
import * as regRequestController from "../controllers/registrationRequestController.js";
import { auth } from "../middleware/auth.js";

export const apiRouter = Router();

// ─── Auth Routes ──────────────────────────────────────────────────────────────
apiRouter.post("/auth/register", authController.register);
apiRouter.post("/auth/login", authController.login);
apiRouter.post("/auth/forgot-password", authController.forgotPassword);
apiRouter.get("/auth/me", auth, authController.getMe);
apiRouter.post("/auth/register-request", regRequestController.createRequest);
apiRouter.get("/auth/validate-referral/:code", regRequestController.validateReferral);

// ─── Profile Routes ───────────────────────────────────────────────────────────
apiRouter.get("/student/profile", auth, profileController.getProfile);
apiRouter.put("/student/profile", auth, profileController.updateProfile);
apiRouter.post("/student/resume", auth, profileController.updateResume);

// ─── Live Projects Routes ─────────────────────────────────────────────────────
apiRouter.get("/projects/live", auth, projectController.getLiveProjects);
apiRouter.post("/projects/live", auth, projectController.createLiveProject);
apiRouter.put("/projects/live/:projectId", auth, projectController.updateLiveProject);
apiRouter.delete("/projects/live/:projectId", auth, projectController.deleteLiveProject);
apiRouter.post("/projects/live/submit", auth, projectController.submitLiveSubmodule);
apiRouter.post("/projects/live/approve", auth, projectController.approveLiveSubmodule);

// ─── Practice Projects Routes ─────────────────────────────────────────────────
apiRouter.get("/projects/practice", auth, projectController.getPracticeProjects);
apiRouter.post("/projects/practice", auth, projectController.createPracticeProject);
apiRouter.put("/projects/practice/:projectId", auth, projectController.updatePracticeProject);
apiRouter.delete("/projects/practice/:projectId", auth, projectController.deletePracticeProject);
apiRouter.post("/projects/practice/apk", auth, projectController.requestPracticeApk);
apiRouter.post("/projects/practice/submit", auth, projectController.submitPracticeProject);

// ─── Sessions Routes ──────────────────────────────────────────────────────────
apiRouter.get("/sessions/slots", auth, sessionController.getAvailableSlots);
apiRouter.post("/sessions/slots", auth, sessionController.createAvailableSlot);
apiRouter.delete("/sessions/slots/:slotId", auth, sessionController.deleteAvailableSlot);
apiRouter.get("/sessions", auth, sessionController.getSessions);
apiRouter.post("/sessions/book", auth, sessionController.bookSession);

// ─── Jobs Routes ──────────────────────────────────────────────────────────────
apiRouter.get("/jobs", auth, jobController.getJobs);
apiRouter.post("/jobs", auth, jobController.createJob);
apiRouter.put("/jobs/:jobId", auth, jobController.updateJob);
apiRouter.delete("/jobs/:jobId", auth, jobController.deleteJob);
apiRouter.post("/jobs/apply", auth, jobController.applyToJob);

// ─── Admin Routes ─────────────────────────────────────────────────────────────
apiRouter.get("/admin/users", auth, adminController.getAllUsers);
apiRouter.post("/admin/users", auth, adminController.createUser);
apiRouter.put("/admin/users/:userId", auth, adminController.updateUser);
apiRouter.delete("/admin/users/:userId", auth, adminController.deleteUser);
apiRouter.put("/admin/users/:userId/verify", auth, adminController.toggleVerify);
apiRouter.get("/admin/sessions", auth, adminController.getAllSessions);
apiRouter.put("/admin/sessions/complete", auth, adminController.completeSession);
apiRouter.post("/admin/projects/practice/audit", auth, adminController.auditPracticeProject);

// ─── Admin Registration Request Routes ────────────────────────────────────────
apiRouter.get("/admin/registration-requests", auth, regRequestController.getPendingRequests);
apiRouter.post("/admin/registration-requests/:requestId/approve", auth, regRequestController.approveRequest);
apiRouter.post("/admin/registration-requests/:requestId/reject", auth, regRequestController.rejectRequest);

