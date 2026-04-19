import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetAsync } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import HoroscopePage from './pages/HoroscopePage';
import BirthChartPage from './pages/BirthChartPage';
import AdminPanel from './pages/AdminPanel';

// Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('maviastro_token');
  return token ? children : <Navigate to="/login" />;
};

// Admin Route
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('maviastro_token');
  const user = JSON.parse(localStorage.getItem('maviastro_user') || '{}');
  return token && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <HelmetAsync>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-cosmic-950 via-cosmic-900 to-cosmic-800">
              <Navbar />
              
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/horoscope"
                    element={
                      <ProtectedRoute>
                        <HoroscopePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/birth-chart"
                    element={
                      <ProtectedRoute>
                        <BirthChartPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminPanel />
                      </AdminRoute>
                    }
                  />

                  {/* Redirect */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>

              <Footer />
              <ChatBot />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetAsync>
  );
}

export default App;
