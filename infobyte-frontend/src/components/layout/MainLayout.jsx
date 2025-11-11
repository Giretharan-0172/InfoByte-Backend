import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';

// This layout includes both sidebars
export default function MainLayout() {
  return (
    <div className="flex h-screen bg-navy-900 text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="max-w-5xl mx-auto p-6">
          <Outlet />
        </div>
      </main>
      <RightSidebar />
    </div>
  );
}