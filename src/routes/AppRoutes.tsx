import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Loader from '../components/common/Loader'
import MainLayout from '../layouts/MainLayout'

const HomePage = lazy(() => import('../pages/HomePage'))
const MatchDetailsPage = lazy(() => import('../pages/MatchDetailsPage'))
const SearchPage = lazy(() => import('../pages/SearchPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

const AppRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/matches/:matchId" element={<MatchDetailsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  </Suspense>
)

export default AppRoutes
