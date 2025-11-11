import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout'; // ✅ NEW
import ExploreLayout from './components/layout/ExploreLayout'; // ✅ NEW
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import NotificationsPage from './pages/NotificationsPage';
import BookmarksPage from './pages/BookmarksPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import LoginForm from './components/auth/LoginForm';

function AppLayout() {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <Routes>
      {/* Routes WITH Left & Right Sidebars */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Routes with ONLY Left Sidebar */}
      <Route element={<ExploreLayout />}>
        <Route path="/explore" element={<ExplorePage />} />
      </Route>
      
      {/* Redirect any other path to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}