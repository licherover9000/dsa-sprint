import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../app/api'

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    return (await api.post('/auth/login', credentials)).data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const registerUser = createAsyncThunk('auth/register', async (credentials, { rejectWithValue }) => {
  try {
    return (await api.post('/auth/register', credentials)).data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const readSession = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('dsa-sprint-session') || 'null')
    return saved?.token && saved?.user ? saved : null
  } catch {
    return null
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: { ...readSession(), status: 'idle', error: null },
  reducers: {
    signOut: (state) => {
      state.token = null
      state.user = null
      state.status = 'idle'
      state.error = null
    },
    clearAuthError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.status = 'loading'; state.error = null }
    const fulfilled = (state, action) => {
      state.status = 'succeeded'
      state.token = action.payload.token
      state.user = action.payload.user
      state.error = null
    }
    const rejected = (state, action) => {
      state.status = 'failed'
      state.error = action.payload || 'Unable to sign in right now.'
    }
    builder
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, fulfilled)
      .addCase(loginUser.rejected, rejected)
      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, fulfilled)
      .addCase(registerUser.rejected, rejected)
  },
})

export const { signOut, clearAuthError } = authSlice.actions
export default authSlice.reducer
