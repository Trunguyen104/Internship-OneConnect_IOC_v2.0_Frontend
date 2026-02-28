import JobBoardPage from '@/feature/job-board/JobBoardPage';
import Header from '@/shared/components/Header';
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
