import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppShell from './components/layout/AppShell';
import PublicNavbar from './components/layout/PublicNavbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import Loader from './components/Loader';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import Button from './components/ui/Button';

// Lazy-loaded Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const HoroscopePage = lazy(() => import('./pages/HoroscopePage'));
const BirthChartPage = lazy(() => import('./pages/BirthChartPage'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ZodiacExplorerPage = lazy(() => import('./pages/ZodiacExplorerPage'));
const ZodiacDetailPage = lazy(() => import('./pages/ZodiacDetailPage'));
const CompatibilityPage = lazy(() => import('./pages/CompatibilityPage'));
const AstrologyCalendarPage = lazy(() => import('./pages/AstrologyCalendarPage'));
const AiAstrologyPage = lazy(() => import('./pages/AiAstrologyPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage'));

// Signature Experience & MVP Pages
const CosmicLifeMapPage = lazy(() => import('./pages/CosmicLifeMapPage'));
const CosmicTimelinePage = lazy(() => import('./pages/CosmicTimelinePage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));

// Protected SaaS Route (Sidebar + Top Header + Mobile Nav)
const ProtectedSaaSLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('maviastro_token');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-950">
        <Loader text="Loading your cosmic sanctuary..." />
      </div>
    );
  }

  if (!token || !user) return <Navigate to="/login" replace />;
  return <AppShell>{children}</AppShell>;
};

// Admin SaaS Route with proper loading, 401 & 403 handling
const AdminSaaSLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('maviastro_token');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-950">
        <Loader text="Verifying celestial administrator credentials..." />
      </div>
    );
  }

  // 401: Unauthenticated
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: '/admin' }} replace />;
  }

  // 403: Authenticated as normal user, lacking admin role
  if (user.role !== 'admin') {
    return (
      <AppShell>
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full p-8 rounded-2xl bg-obsidian-900/90 border border-rose-500/20 text-center backdrop-blur-xl shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-5 shadow-lg">
              <ShieldAlert size={32} />
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider">
              403 Forbidden
            </span>
            <h2 className="mt-3 text-xl font-bold font-cinzel text-white">
              Restricted Sanctum
            </h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Administrative clearance required. Your account{' '}
              <span className="text-slate-200 font-mono font-medium">{user.email}</span>{' '}
              is registered as a Standard Seeker and lacks administrator authorization.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button variant="secondary" size="sm" icon={ArrowLeft} className="w-full">
                  Return to Dashboard
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="primary" size="sm" icon={LogIn} className="w-full">
                  Sign in as Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return <AppShell>{children}</AppShell>;
};

// Public Marketing Layout
const PublicLayout = ({ children, noFooter = false }) => (
  <div className="min-h-screen flex flex-col bg-obsidian-950 text-slate-100 antialiased">
    <PublicNavbar />
    <main className="flex-grow">{children}</main>
    {!noFooter && <Footer />}
    <ChatBot />
  </div>
);

// Page loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-obsidian-950">
    <Loader text="Consulting celestial ephemeris..." />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Marketing & Educational Routes */}
              <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
              <Route path="/login" element={<PublicLayout noFooter><LoginPage /></PublicLayout>} />
              <Route path="/register" element={<PublicLayout noFooter><RegisterPage /></PublicLayout>} />
              <Route path="/forgot-password" element={<PublicLayout noFooter><ForgotPasswordPage /></PublicLayout>} />
              <Route path="/reset-password/:token" element={<PublicLayout noFooter><ResetPasswordPage /></PublicLayout>} />
              <Route path="/zodiac" element={<PublicLayout><ZodiacExplorerPage /></PublicLayout>} />
              <Route path="/zodiac/:sign" element={<PublicLayout><ZodiacDetailPage /></PublicLayout>} />
              <Route path="/calendar" element={<PublicLayout><AstrologyCalendarPage /></PublicLayout>} />
              <Route path="/articles" element={<PublicLayout><ArticlesPage /></PublicLayout>} />
              <Route path="/articles/:slug" element={<PublicLayout><ArticleDetailPage /></PublicLayout>} />

              {/* Multi-step Onboarding (Focused protected flow) */}
              <Route
                path="/onboarding"
                element={
                  <PublicLayout noFooter>
                    <OnboardingPage />
                  </PublicLayout>
                }
              />

              {/* Core SaaS Product Routes (AppShell) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedSaaSLayout>
                    <Dashboard />
                  </ProtectedSaaSLayout>
                }
              />
              <Route
                path="/cosmic-life-map"
                element={
                  <ProtectedSaaSLayout>
                    <CosmicLifeMapPage />
                  </ProtectedSaaSLayout>
                }
              />
              <Route
                path="/birth-chart"
                element={
                  <ProtectedSaaSLayout>
                    <BirthChartPage />
                  </ProtectedSaaSLayout>
                }
              />
              <Route
                path="/horoscope"
                element={
                  <ProtectedSaaSLayout>
                    <HoroscopePage />
                  </ProtectedSaaSLayout>
                }
              />
              <Route
                path="/cosmic-timeline"
                element={
                  <ProtectedSaaSLayout>
                    <CosmicTimelinePage />
                  </ProtectedSaaSLayout>
                }
              />
              <Route
                path="/compatibility"
                element={
                  <ProtectedSaaSLayout>
                    <CompatibilityPage />
                  </ProtectedSaaSLayout>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedSaaSLayout>
                    <ReportsPage />
                  </ProtectedSaaSLayout>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedSaaSLayout>
                    <FavoritesPage />
                  </ProtectedSaaSLayout>
                }
              />
              <Route
                path="/ai-astrology"
                element={
                  <ProtectedSaaSLayout>
                    <AiAstrologyPage />
                  </ProtectedSaaSLayout>
                }
              />
              <Route
                path="/chatbot"
                element={
                  <ProtectedSaaSLayout>
                    <AiAstrologyPage />
                  </ProtectedSaaSLayout>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedSaaSLayout>
                    <ProfilePage />
                  </ProtectedSaaSLayout>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedSaaSLayout>
                    <SettingsPage />
                  </ProtectedSaaSLayout>
                }
              />

              {/* Admin Console Route */}
              <Route
                path="/admin"
                element={
                  <AdminSaaSLayout>
                    <AdminPanel />
                  </AdminSaaSLayout>
                }
              />

              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
