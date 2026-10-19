import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import authReducer, { loginUser, registerUser, signOut } from '../features/auth/authSlice'
import dashboardReducer from '../features/dashboard/dashboardSlice'
import { setTokenProvider } from './api'

const sessionListener = createListenerMiddleware()
sessionListener.startListening({
  matcher: isAnyOf(loginUser.fulfilled, registerUser.fulfilled),
  effect: (action) => {
    localStorage.setItem('dsa-sprint-session', JSON.stringify(action.payload))
  },
})
sessionListener.startListening({
  actionCreator: signOut,
  effect: () => localStorage.removeItem('dsa-sprint-session'),
})

export const store = configureStore({
  reducer: { auth: authReducer, dashboard: dashboardReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(sessionListener.middleware),
})

setTokenProvider(() => store.getState().auth.token)
