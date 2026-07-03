import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiFunction } from "../api/apiFunction.jsx";
import {
  fetchUsers,
  fetchJobs,
  fetchLiveProjects,
  fetchPracticeProjects,
  fetchSessions,
  setUsers,
  setJobs,
  setLiveProjects,
  setPracticeProjects,
  setSessions,
} from "../redux/getData.jsx";
import {
  AUTH_LOGIN,
  ADMIN_CREATE_USER,
  ADMIN_UPDATE_USER,
  ADMIN_DELETE_USER,
  ADMIN_TOGGLE_VERIFY,
  ADMIN_GET_REG_REQUESTS,
  ADMIN_APPROVE_REG_REQUEST,
  ADMIN_REJECT_REG_REQUEST,
  JOBS_CREATE,
  JOBS_UPDATE,
  JOBS_DELETE,
  LIVE_CREATE,
  LIVE_UPDATE,
  LIVE_DELETE,
  LIVE_APPROVE,
  PRACTICE_CREATE,
  PRACTICE_UPDATE,
  PRACTICE_DELETE,
  ADMIN_AUDIT_PRACTICE,
  ADMIN_COMPLETE_SESSION,
  ADMIN_GET_SLOTS,
  ADMIN_CREATE_SLOT,
  ADMIN_DELETE_SLOT,
} from "../api/apis.jsx";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const dispatch = useDispatch();

  // ─── Auth state ──────────────────────────────────────────────────────────
  const [admin, setAdmin] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Hydrate admin from token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await apiFunction("get", "/auth/me", null, null, true);
          if (response.user && response.user.role === "admin") {
            setAdmin(response.user);
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error('Admin session hydration failed:', err);
          localStorage.removeItem('token');
        }
      }
      setAuthLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await apiFunction("post", AUTH_LOGIN, { emailOrPhone: email, password });
    
    if (res.user?.role !== "admin") throw new Error("Access denied: not an admin account");
    setAdmin(res.user);
   
    localStorage.setItem("token", res.token);
    return res.user;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("token");
  };

  // ─── Redux selectors ─────────────────────────────────────────────────────
  const users           = useSelector((s) => s.admin.users);
  const jobs            = useSelector((s) => s.admin.jobs);
  const liveProjects    = useSelector((s) => s.admin.liveProjects);
  const practiceProjects= useSelector((s) => s.admin.practiceProjects);
  const sessions        = useSelector((s) => s.admin.sessions);
  const loading         = useSelector((s) => s.admin.loading);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [registrationRequests, setRegistrationRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const fetchAvailableSlots = useCallback(async () => {
    try {
      const res = await apiFunction("get", ADMIN_GET_SLOTS, null, null, true);
      setAvailableSlots(res.slots || []);
    } catch (err) {
      console.error("Fetch available slots error:", err);
    }
  }, []);

  const fetchRegistrationRequests = useCallback(async () => {
    setLoadingRequests(true);
    try {
      const res = await apiFunction("get", ADMIN_GET_REG_REQUESTS, null, null, true);
      setRegistrationRequests(res.requests || []);
    } catch (err) {
      console.error("Fetch registration requests error:", err);
    } finally {
      setLoadingRequests(false);
    }
  }, []);

  // ─── Initial data load ────────────────────────────────────────────────────
  const loadAll = useCallback(() => {
    dispatch(fetchUsers());
    dispatch(fetchJobs());
    dispatch(fetchLiveProjects());
    dispatch(fetchPracticeProjects());
    dispatch(fetchSessions());
    fetchAvailableSlots();
    fetchRegistrationRequests();
  }, [dispatch, fetchAvailableSlots, fetchRegistrationRequests]);

  useEffect(() => {
    if (admin) loadAll();
  }, [admin, loadAll]);

  // ─── User Mutations ───────────────────────────────────────────────────────
  const deleteUser = async (userId) => {
    await apiFunction("delete", ADMIN_DELETE_USER(userId), null, null, true);
    dispatch(setUsers(users.filter(u => u.userId !== userId)));
  };

  const toggleVerify = async (userId) => {
    const res = await apiFunction("put", ADMIN_TOGGLE_VERIFY(userId), null, null, true);
    const updated = res.student;
    dispatch(setUsers(users.map(u => u.userId === userId ? { ...u, isHrVerified: updated.isHrVerified, verifiedProgress: updated.verifiedProgress } : u)));
    return updated;
  };

  const createUser = async (data) => {
    const res = await apiFunction("post", ADMIN_CREATE_USER, data, null, true);
    dispatch(setUsers([...users, res.user]));
    return res.user;
  };

  const updateUser = async (userId, data) => {
    const res = await apiFunction("put", ADMIN_UPDATE_USER(userId), data, null, true);
    dispatch(setUsers(users.map(u => u.userId === userId ? res.user : u)));
    return res.user;
  };

  const approveRegistrationRequest = async (requestId) => {
    const res = await apiFunction("post", ADMIN_APPROVE_REG_REQUEST(requestId), null, null, true);
    setRegistrationRequests(prev => prev.filter(r => r.id !== requestId));
    dispatch(fetchUsers());
    return res;
  };

  const rejectRegistrationRequest = async (requestId) => {
    const res = await apiFunction("post", ADMIN_REJECT_REG_REQUEST(requestId), null, null, true);
    setRegistrationRequests(prev => prev.filter(r => r.id !== requestId));
    return res;
  };

  // ─── Job Mutations ────────────────────────────────────────────────────────
  const createJob = async (data) => {
    const res = await apiFunction("post", JOBS_CREATE, data, null, true);
    dispatch(setJobs([...jobs, res.job]));
    return res.job;
  };

  const updateJob = async (jobId, data) => {
    const res = await apiFunction("put", JOBS_UPDATE(jobId), data, null, true);
    dispatch(setJobs(jobs.map(j => j.id === jobId ? res.job : j)));
    return res.job;
  };

  const deleteJob = async (jobId) => {
    await apiFunction("delete", JOBS_DELETE(jobId), null, null, true);
    dispatch(setJobs(jobs.filter(j => j.id !== jobId)));
  };

  // ─── Live Project Mutations ───────────────────────────────────────────────
  const createLiveProject = async (data) => {
    const res = await apiFunction("post", LIVE_CREATE, data, null, true);
    dispatch(setLiveProjects([...liveProjects, res.project]));
    return res.project;
  };

  const updateLiveProject = async (projectId, data) => {
    const res = await apiFunction("put", LIVE_UPDATE(projectId), data, null, true);
    dispatch(setLiveProjects(liveProjects.map(p => p.id === projectId ? res.project : p)));
    return res.project;
  };

  const deleteLiveProject = async (projectId) => {
    await apiFunction("delete", LIVE_DELETE(projectId), null, null, true);
    dispatch(setLiveProjects(liveProjects.filter(p => p.id !== projectId)));
  };

  const approveLiveSubmodule = async (data) => {
    const res = await apiFunction("post", LIVE_APPROVE, data, null, true);
    if (res.success && res.student) {
      const updated = res.student;
      dispatch(setUsers(users.map(u => u.userId === updated.userId ? { ...u, walletPoints: updated.walletPoints, liveProjects: updated.liveProjects } : u)));
    }
    return res;
  };

  // ─── Practice Project Mutations ───────────────────────────────────────────
  const createPracticeProject = async (data) => {
    const res = await apiFunction("post", PRACTICE_CREATE, data, null, true);
    dispatch(setPracticeProjects([...practiceProjects, res.project]));
    return res.project;
  };

  const updatePracticeProject = async (projectId, data) => {
    const res = await apiFunction("put", PRACTICE_UPDATE(projectId), data, null, true);
    dispatch(setPracticeProjects(practiceProjects.map(p => p.id === projectId ? res.project : p)));
    return res.project;
  };

  const deletePracticeProject = async (projectId) => {
    await apiFunction("delete", PRACTICE_DELETE(projectId), null, null, true);
    dispatch(setPracticeProjects(practiceProjects.filter(p => p.id !== projectId)));
  };

  const auditPracticeProject = async (studentId, projectId, performance, reviewerFeedback) => {
    const res = await apiFunction("post", ADMIN_AUDIT_PRACTICE, { studentId, projectId, performance, reviewerFeedback }, null, true);
    if (res.success && res.student) {
      const updated = res.student;
      dispatch(setUsers(users.map(u => u.userId === updated.userId ? { ...u, practiceProjects: updated.practiceProjects } : u)));
    }
    return res;
  };


  // ─── Session Mutations ────────────────────────────────────────────────────
  const completeSession = async (studentId, sessionId) => {
    const res = await apiFunction("put", ADMIN_COMPLETE_SESSION, { studentId, sessionId }, null, true);
    dispatch(setSessions(sessions.map(s =>
      s.id === sessionId && s.studentId === studentId ? { ...s, status: "Completed" } : s
    )));
    return res;
  };

  const createAvailableSlot = async (date, timeSlot, meetingLink) => {
    console.log(date, timeSlot, meetingLink)
    const res = await apiFunction("post", ADMIN_CREATE_SLOT, { date, timeSlot, meetingLink }, null, true);
    setAvailableSlots(prev => [...prev, res.slot]);
    return res.slot;
  };

  const deleteAvailableSlot = async (slotId) => {
    await apiFunction("delete", ADMIN_DELETE_SLOT(slotId), null, null, true);
    setAvailableSlots(prev => prev.filter(s => s.id !== slotId));
  };

  // ─── Seed ─────────────────────────────────────────────────────────────────
  

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-300">
        <div className="text-xl font-medium animate-pulse">Initializing Admin...</div>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{
      admin, login, logout,
      users, jobs, liveProjects, practiceProjects, sessions, availableSlots,
      registrationRequests, loadingRequests,
      loading, loadAll,
      deleteUser, toggleVerify, createUser, updateUser,
      createJob, updateJob, deleteJob,
      createLiveProject, updateLiveProject, deleteLiveProject, approveLiveSubmodule,
      createPracticeProject, updatePracticeProject, deletePracticeProject, auditPracticeProject,
      completeSession,
      createAvailableSlot, deleteAvailableSlot, fetchAvailableSlots,
      fetchRegistrationRequests, approveRegistrationRequest, rejectRegistrationRequest
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
};
