import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WorkoutProvider } from './contexts/WorkoutContext';
import { MessageProvider } from './contexts/MessageContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { Navbar } from './components/layout/Navbar';
import { ExerciseVideosPage } from './pages/ExerciseVideosPage';
import { WorkoutRecordsPage } from './pages/WorkoutRecordsPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AppContent() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <WorkoutProvider>
                  <MessageProvider userId={user?.id || ''}>
                    <div className="flex-1">
                      <DashboardPage />
                    </div>
                  </MessageProvider>
                </WorkoutProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/records"
            element={
              <PrivateRoute>
                <WorkoutProvider>
                  <WorkoutRecordsPage />
                </WorkoutProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/videos"
            element={
              <PrivateRoute>
                <ExerciseVideosPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}