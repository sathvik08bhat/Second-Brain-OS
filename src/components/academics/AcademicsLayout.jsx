import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAcademicStore } from '../../store/academicStore';
import { useGoogleStore } from '../../store/googleStore';

import AcademicsSidebar from './AcademicsSidebar';

export default function AcademicsLayout() {
  const { startRealtimeSync, stopRealtimeSync } = useAcademicStore();
  const { userEmail } = useGoogleStore();

  useEffect(() => {
    if (userEmail) {
      startRealtimeSync(userEmail);
    }
    return () => stopRealtimeSync();
  }, [userEmail, startRealtimeSync, stopRealtimeSync]);

  return (
    <div className="flex h-full w-full bg-background overflow-hidden relative">
      <AcademicsSidebar />
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pt-6 px-2">
        <Outlet />
      </div>
    </div>
  );
}
