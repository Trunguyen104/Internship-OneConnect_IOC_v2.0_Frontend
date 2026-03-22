'use client';

import React from 'react';

import InternshipDashboard from '@/components/features/internship/InternshipDashboard';
import Header from '@/components/layout/Header';

export default function InternshipGroupsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <main className="py-12">
        <InternshipDashboard />
      </main>
    </div>
  );
}
