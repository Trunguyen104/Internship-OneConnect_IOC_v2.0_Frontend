import React from 'react';
import { Skeleton, Empty } from 'antd';
import Header from '@/components/layout/Header';

import { useInternshipPlacement } from '../hooks/useInternshipPlacement';
import { CurrentCycle } from './CurrentCycle';
import { CompletedCycles } from './CompletedCycles';

const InternshipPlacementDashboard = () => {
  const { loading, activeCycle, completedCycles, placementData, placementStatus } = useInternshipPlacement();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 md:px-10 py-8 flex flex-col gap-6">

        {loading ? (
          <div className="space-y-6">
            <Skeleton active paragraph={{ rows: 6 }} className="bg-white p-8 rounded-xl border border-gray-100" />
            <Skeleton active paragraph={{ rows: 4 }} className="bg-white p-8 rounded-xl border border-gray-100" />
          </div>
        ) : !activeCycle && completedCycles.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
            <Empty description={<span className="text-gray-500 font-medium">No internship placements found.</span>} />
          </div>
        ) : (
          <>
            <CompletedCycles completedCycles={completedCycles} />
            <CurrentCycle
              activeCycle={activeCycle}
              placementStatus={placementStatus}
              placementData={placementData}
            />
          </>
        )}

      </main>
    </div>
  );
};

export default InternshipPlacementDashboard;

