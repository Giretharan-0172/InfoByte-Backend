import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

// This layout only includes the Left Sidebar
export default function ExploreLayout() {
  return (
    <div className="flex h-screen bg-navy-900 text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        {/* No max-width container, page handles its own layout */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
      {/* No RightSidebar */}
    </div>
  );
}