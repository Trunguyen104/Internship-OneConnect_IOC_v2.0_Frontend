import React, { useEffect, useState } from 'react';
import { Skeleton, Empty, message, Alert } from 'antd';
import { ArrowRightOutlined, SafetyCertificateFilled, InfoCircleOutlined } from '@ant-design/icons';
import Header from '@/shared/components/Header';
import Stepper from '@/shared/components/Stepper';
import Badge from '@/shared/components/Badge';
import Button from '@/shared/components/Button';
import { EvaluationService } from '@/services/evaluation.service';

const InternshipPlacementDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeCycle, setActiveCycle] = useState(null);
  const [completedCycles, setCompletedCycles] = useState([]);
  
  // Placement mock data since we might not have it in cycle list
  const [placementData, setPlacementData] = useState(null);
  const [placementStatus, setPlacementStatus] = useState('PLACED'); // UNPLACED or PLACED

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch cycle list
      const cyclesRes = await EvaluationService.getCycles();
      if (cyclesRes && cyclesRes.isSuccess !== false) {
        const cycles = cyclesRes.data?.items || cyclesRes.items || [];
        
        // Filter active and completed
        const active = cycles.find(c => c.status === 'ACTIVE' || c.status === 1) || null;
        const completed = cycles.filter(c => c.status === 'COMPLETED' || c.status === 2);
        
        setActiveCycle(active);
        setCompletedCycles(completed);
        
        // Mocking placement data fetching based on requirements. 
        // Real implementation would use active.cycleId to fetch placement details if ACTIVE
        if (active) {
            // Mocking API call to /api/evaluations/cycles/{cycleId}
            setTimeout(() => {
                 setPlacementStatus('PLACED'); // Change to UNPLACED to test Alert box
                 setPlacementData({
                    enterprise: { name: 'FPT Software', logo: 'F' }, // Simulated Logo
                    mentor: { name: 'Mr. Nguyen Van A', avatar: 'N' },
                    project: { name: 'Smart City Management System' }
                 });
                 setLoading(false);
            }, 600);
            return;
        }
      } else {
        message.error(cyclesRes?.message || 'Failed to fetch internship cycles');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('An error occurred while fetching data');
    } finally {
      if(!activeCycle) setLoading(false);
    }
  };

  const renderCurrentCycle = () => {
    if (!activeCycle) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
             <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">CURRENT TERM</span>
                <Badge variant="success">CURRENT</Badge>
                <Badge variant="info">ACTIVE & PLACED</Badge>
             </div>
             <h2 className="text-2xl font-bold text-gray-900">{activeCycle.cycleName || 'Fall 2024 Semester'}</h2>
          </div>
          <div className="text-right">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-2">STATUS</span>
              {placementStatus === 'PLACED' ? (
                  <Badge variant="success-solid" size="lg" className="rounded-md px-4">ACTIVE & PLACED</Badge>
              ) : (
                  <Badge variant="warning-solid" size="lg" className="rounded-md px-4">ACTIVE & UNPLACED</Badge>
              )}
          </div>
        </div>

        <div className="px-4 py-8 relative">
           {/* Timeline visualization for Current Cycle. Hardcoded step logic for display purposes based on requirements. */}
           <Stepper currentStatus={placementStatus === 'PLACED' ? 'PLACED' : 'Interviewing'} />
        </div>

        {/* Placement Information Card */}
        {placementStatus === 'PLACED' && placementData ? (
            <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mr-6">
                    {/* Enterprise */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-800 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                           {placementData.enterprise.logo}
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium mb-1">Enterprise</p>
                            <p className="text-[15px] font-bold text-gray-900">{placementData.enterprise.name}</p>
                        </div>
                    </div>
                    
                    {/* Mentor */}
                    <div className="flex items-center gap-4 border-l border-gray-200 pl-8">
                        <div className="w-12 h-12 bg-[#dfb48e] rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {placementData.mentor.avatar}
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium mb-1">Mentor</p>
                            <p className="text-[15px] font-bold text-gray-900">{placementData.mentor.name}</p>
                        </div>
                    </div>

                    {/* Project */}
                    <div className="flex flex-col justify-center border-l border-gray-200 pl-8 relative pr-24">
                        <p className="text-xs text-gray-500 font-medium mb-1">Project</p>
                        <p className="text-[15px] font-bold text-gray-900">{placementData.project.name}</p>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2">
                            <Badge variant="success-solid" icon={<SafetyCertificateFilled />}>
                                CONFIRMED BY UNI ADMIN
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            /* Unplaced Alert Box using --warning colors from global.css */
            <div className="mt-4 bg-[var(--warning-50, #fffbeb)] border border-[var(--warning-200, #fde68a)] rounded-xl p-5 flex items-start gap-4">
                <InfoCircleOutlined className="text-[var(--warning-600, #d97706)] text-xl mt-0.5" />
                <div>
                   <h4 className="text-[var(--warning-800, #92400e)] font-bold text-sm mb-1">Notice: Placement Pending</h4>
                   <p className="text-[var(--warning-700, #b45309)] text-sm m-0">
                      You are currently unplaced for this term. Please wait while the University Administration matches you with a suitable enterprise and project, or check your messages for pending interviews.
                   </p>
                </div>
            </div>
        )}

        <div className="mt-6 flex justify-end">
             <Button variant="primary" icon={<ArrowRightOutlined />} iconPosition="right">
                 View Detailed Training Plan
             </Button>
        </div>
      </div>
    );
  };

  const renderCompletedCycles = () => {
    if (completedCycles.length === 0) return null;

    return completedCycles.map((cycle, i) => (
      <div key={cycle.cycleId || i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6 opacity-80 hover:opacity-100 transition-opacity">
        <div className="flex justify-between items-start mb-6">
          <div>
             <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">HISTORICAL TERM</span>
             <h3 className="text-2xl font-bold text-gray-800">{cycle.cycleName || 'Summer 2024 Semester'}</h3>
          </div>
          <Badge variant="default" size="lg" className="rounded-md font-bold px-4">
             COMPLETED
          </Badge>
        </div>
        
        <div className="px-4 py-6">
             {/* Uses Stepper indicating terminal state with all completed */}
             <Stepper currentStatus="Completed" isTerminalStatus={true} />
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Main Container replacing old grid */}
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
              {renderCompletedCycles()}
              {renderCurrentCycle()}
           </>
         )}

      </main>
    </div>
  );
};

export default InternshipPlacementDashboard;
