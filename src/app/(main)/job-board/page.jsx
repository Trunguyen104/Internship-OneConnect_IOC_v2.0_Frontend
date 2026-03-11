import JobBoardPage from '@/features/job-board/components/JobBoardPage';
import Header from '@/components/layout/Header';
import React from 'react';

function page() {
  return (
    <div>
      <Header />
      <JobBoardPage />
    </div>
  );
}

export default page;

