import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFunction } from "../api/apiFunction.jsx";
import {
  ADMIN_GET_USERS,
  ADMIN_GET_SESSIONS,
  JOBS_GET_ALL,
  LIVE_GET_ALL,
  PRACTICE_GET_ALL,
} from "../api/apis.jsx";

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (_, thunkAPI) => {
  try {
    const res = await apiFunction("get", ADMIN_GET_USERS, null, null, true);
    return res.users;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const fetchJobs = createAsyncThunk("admin/fetchJobs", async (_, thunkAPI) => {
  try {
    const res = await apiFunction("get", JOBS_GET_ALL, null, null, true);
    return res.jobs;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const fetchLiveProjects = createAsyncThunk("admin/fetchLiveProjects", async (_, thunkAPI) => {
  try {
    const res = await apiFunction("get", LIVE_GET_ALL, null, null, true);
    return res.liveProjects;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const fetchPracticeProjects = createAsyncThunk("admin/fetchPracticeProjects", async (_, thunkAPI) => {
  try {
    const res = await apiFunction("get", PRACTICE_GET_ALL, null, null, true);
    return res.practiceProjects;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const fetchSessions = createAsyncThunk("admin/fetchSessions", async (_, thunkAPI) => {
  try {
    const res = await apiFunction("get", ADMIN_GET_SESSIONS, null, null, true);
    return res.sessions;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    jobs: [],
    liveProjects: [],
    practiceProjects: [],
    sessions: [],
    loading: {
      users: false,
      jobs: false,
      liveProjects: false,
      practiceProjects: false,
      sessions: false,
    },
    error: {
      users: null,
      jobs: null,
      liveProjects: null,
      practiceProjects: null,
      sessions: null,
    },
  },
  reducers: {
    // Local optimistic updates (used by context after mutation)
    setUsers:            (state, action) => { state.users = action.payload; },
    setJobs:             (state, action) => { state.jobs = action.payload; },
    setLiveProjects:     (state, action) => { state.liveProjects = action.payload; },
    setPracticeProjects: (state, action) => { state.practiceProjects = action.payload; },
    setSessions:         (state, action) => { state.sessions = action.payload; },
  },
  extraReducers: (builder) => {
    // Users
    builder
      .addCase(fetchUsers.pending,   (s) => { s.loading.users = true; s.error.users = null; })
      .addCase(fetchUsers.fulfilled, (s, a) => { s.loading.users = false; s.users = a.payload; })
      .addCase(fetchUsers.rejected,  (s, a) => { s.loading.users = false; s.error.users = a.payload; });

    // Jobs
    builder
      .addCase(fetchJobs.pending,   (s) => { s.loading.jobs = true; s.error.jobs = null; })
      .addCase(fetchJobs.fulfilled, (s, a) => { s.loading.jobs = false; s.jobs = a.payload; })
      .addCase(fetchJobs.rejected,  (s, a) => { s.loading.jobs = false; s.error.jobs = a.payload; });

    // Live Projects
    builder
      .addCase(fetchLiveProjects.pending,   (s) => { s.loading.liveProjects = true; s.error.liveProjects = null; })
      .addCase(fetchLiveProjects.fulfilled, (s, a) => { s.loading.liveProjects = false; s.liveProjects = a.payload; })
      .addCase(fetchLiveProjects.rejected,  (s, a) => { s.loading.liveProjects = false; s.error.liveProjects = a.payload; });

    // Practice Projects
    builder
      .addCase(fetchPracticeProjects.pending,   (s) => { s.loading.practiceProjects = true; s.error.practiceProjects = null; })
      .addCase(fetchPracticeProjects.fulfilled, (s, a) => { s.loading.practiceProjects = false; s.practiceProjects = a.payload; })
      .addCase(fetchPracticeProjects.rejected,  (s, a) => { s.loading.practiceProjects = false; s.error.practiceProjects = a.payload; });

    // Sessions
    builder
      .addCase(fetchSessions.pending,   (s) => { s.loading.sessions = true; s.error.sessions = null; })
      .addCase(fetchSessions.fulfilled, (s, a) => { s.loading.sessions = false; s.sessions = a.payload; })
      .addCase(fetchSessions.rejected,  (s, a) => { s.loading.sessions = false; s.error.sessions = a.payload; });
  },
});

export const { setUsers, setJobs, setLiveProjects, setPracticeProjects, setSessions } = adminSlice.actions;
export default adminSlice.reducer;
