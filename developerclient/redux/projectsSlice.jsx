import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFunction } from "../api/apiFunction";
import { PRACTICE_GET_ALL } from "../api/apis";

// ─── Async Thunk ─────────────────────────────────────────────────────────────
export const fetchPracticeProjects = createAsyncThunk(
  "projects/fetchPracticeProjects",
  async (_, thunkAPI) => {
    try {
      const res = await apiFunction("get", PRACTICE_GET_ALL);
      return res.practiceProjects;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    practiceProjects: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPracticeProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPracticeProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.practiceProjects = action.payload;
      })
      .addCase(fetchPracticeProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default projectsSlice.reducer;
