import { useState } from 'react'
import { useSelector } from 'react-redux'
import AuthScreen from './features/auth/AuthScreen'
import Dashboard from './features/dashboard/Dashboard'

export default function App() {
  const token = useSelector((state) => state.auth.token)
  const [authMode, setAuthMode] = useState('login')

  return token
    ? <Dashboard />
    : <AuthScreen mode={authMode} onModeChange={setAuthMode} />
}
