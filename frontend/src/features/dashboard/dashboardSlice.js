import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../app/api'

export const loadDashboard = createAsyncThunk('dashboard/load', async (_, { rejectWithValue }) => {
  try {
    const [submissions, streak, heatmap, reviewQueue] = await Promise.all([
      api.get('/submissions'),
      api.get('/submissions/streak'),
      api.get('/submissions/heatmap'),
      api.get('/submissions/review'),
    ])
    return { submissions: submissions.data, streak: streak.data.streak, heatmap: heatmap.data, reviewQueue: reviewQueue.data }
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const createSubmission = createAsyncThunk('dashboard/createSubmission', async (form, { rejectWithValue }) => {
  try {
    return (await api.post('/submissions', form)).data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const setSubmissionReview = createAsyncThunk('dashboard/setSubmissionReview', async ({ id, needsReview }, { rejectWithValue }) => {
  try {
    return (await api.patch(`/submissions/${id}/review`, { needsReview })).data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: { submissions: [], streak: 0, heatmap: [], reviewQueue: [], status: 'idle', error: null, saving: false },
  reducers: { clearDashboardError: (state) => { state.error = null } },
  extraReducers: (builder) => {
    builder
      .addCase(loadDashboard.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(loadDashboard.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.submissions = action.payload.submissions
        state.streak = action.payload.streak
        state.heatmap = action.payload.heatmap
        state.reviewQueue = action.payload.reviewQueue
      })
      .addCase(loadDashboard.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Could not load your dashboard.'
      })
      .addCase(createSubmission.pending, (state) => { state.saving = true; state.error = null })
      .addCase(createSubmission.fulfilled, (state, action) => {
        state.saving = false
        state.submissions.unshift(action.payload)
      })
      .addCase(createSubmission.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload || 'Could not save this problem.'
      })
      .addCase(setSubmissionReview.fulfilled, (state, action) => {
        const updated = action.payload
        state.submissions = state.submissions.map((entry) => entry.id === updated.id ? updated : entry)
        state.reviewQueue = state.reviewQueue.filter((entry) => entry.id !== updated.id)
        if (updated.needsReview) state.reviewQueue.push(updated)
      })
      .addCase(setSubmissionReview.rejected, (state, action) => {
        state.error = action.payload || 'Could not update the review queue.'
      })
  },
})

export const { clearDashboardError } = dashboardSlice.actions
export default dashboardSlice.reducer
