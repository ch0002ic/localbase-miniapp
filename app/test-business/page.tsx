'use client';

import { useState } from 'react';
import { BusinessProfile } from '../components/business/BusinessProfile';
import { BusinessDirectory } from '../components/business/BusinessDirectory';

export default function TestBusinessPage() {
  const [currentView, setCurrentView] = useState<'directory' | string>('directory');

  if (currentView === 'directory') {
    return <BusinessDirectory />;
  }

  // If currentView is a business ID, show that business profile
  return (
    <BusinessProfile 
      businessId={currentView}
      onBack={() => setCurrentView('directory')}
    />
  );
}
