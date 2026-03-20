import React from 'react';

import JobBoardPage from '@/components/features/job-board/components/JobBoardPage';
import Header from '@/components/layout/Header';

function page() {
  return (
    <div>
      <Header />
      <JobBoardPage />
    </div>
  );
}

export default page;
