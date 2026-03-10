import { useState, useEffect } from 'react';
import { message } from 'antd';
import { EvaluationService } from '@/services/evaluation.service';

export function useInternshipPlacement() {
  const [loading, setLoading] = useState(true);
  const [activeCycle, setActiveCycle] = useState(null);
  const [completedCycles, setCompletedCycles] = useState([]);
  const [placementData, setPlacementData] = useState(null);
  const [placementStatus, setPlacementStatus] = useState('PLACED'); // UNPLACED or PLACED

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const cyclesRes = await EvaluationService.getCycles();
      if (cyclesRes && cyclesRes.isSuccess !== false) {
        const cycles = cyclesRes.data?.items || cyclesRes.items || [];
        
        const active = cycles.find(c => c.status === 'ACTIVE' || c.status === 1) || null;
        const completed = cycles.filter(c => c.status === 'COMPLETED' || c.status === 2);
        
        setActiveCycle(active);
        setCompletedCycles(completed);
        
        if (active) {
            setTimeout(() => {
                 setPlacementStatus('PLACED'); 
                 setPlacementData({
                    enterprise: { name: 'FPT Software', logo: 'F' }, 
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

  return { loading, activeCycle, completedCycles, placementData, placementStatus };
}
