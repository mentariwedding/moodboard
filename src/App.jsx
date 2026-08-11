import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import { isSupabaseConfigured } from './lib/supabase'
import { seedDemoIfNeeded } from './lib/seed'
import { Spinner } from './components/ui'
import ErrorBoundary from './components/ErrorBoundary'
import { logger, initDebugPanel } from './lib/debug'

// Halaman berat di-load on-demand (code-splitting) supaya bukaan pertama ringan
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const MoodboardPage = lazy(() => import('./pages/MoodboardPage'))
const CoupleLandingPage = lazy(() => import('./pages/CoupleLandingPage'))

if (!isSupabaseConfigured) seedDemoIfNeeded()

logger.info('App dimulai', { mode: isSupabaseConfigured ? 'supabase' : 'demo', ua: navigator.userAgent.slice(0, 80) })
initDebugPanel()

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory">
      <Spinner className="h-8 w-8" />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/mb/:token" element={<MoodboardPage />} />
          <Route path="/couple/:token" element={<CoupleLandingPage />} />
          <Route path="/demo" element={<Navigate to="/mb/demo" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
    </ErrorBoundary>
  )
}
