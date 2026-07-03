import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFunction } from "../api/apiFunction";
import { studentApis, jobApis, projectApis } from "../api/apis";

export const fetchStudentData = createAsyncThunk(
  "getData/fetchStudentData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiFunction(studentApis.getProfile, [], {}, "GET", true);
      return response.data.student; // Backend returns { success: true, student: {...} }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const fetchJobs = createAsyncThunk(
  "getData/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiFunction(jobApis.getJobs, [], {}, "GET", true);
      return response.data.jobs; // Backend returns { success: true, jobs: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const fetchLiveProjects = createAsyncThunk(
  "getData/fetchLiveProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiFunction(projectApis.getLive, [], {}, "GET", true);
      return response.data.liveProjects; // Backend returns { success: true, liveProjects: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const fetchPracticeProjects = createAsyncThunk(
  "getData/fetchPracticeProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiFunction(projectApis.getPractice, [], {}, "GET", true);
      return response.data.practiceProjects; // Backend returns { success: true, practiceProjects: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  studentData: null,
  allJobsData: null,
  allProjectsData: null,
  allPracticeData: null,
};

const getDataSlice = createSlice({
  name: "getData",
  initialState,
  reducers: {
    clearData: (state) => {
      state.studentData = null;
      state.allJobsData = null;
      state.allProjectsData = null;
      state.allPracticeData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchStudentData
      .addCase(fetchStudentData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentData.fulfilled, (state, action) => {
        state.loading = false;
        state.studentData = action.payload;
      })
      .addCase(fetchStudentData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchJobs
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.allJobsData = action.payload;
      })
      // fetchLiveProjects
      .addCase(fetchLiveProjects.fulfilled, (state, action) => {
        state.allProjectsData = action.payload;
      })
      // fetchPracticeProjects
      .addCase(fetchPracticeProjects.fulfilled, (state, action) => {
        state.allPracticeData = action.payload;
      });
  }
});

export const { clearData } = getDataSlice.actions;
export const getDataReducer = getDataSlice.reducer;