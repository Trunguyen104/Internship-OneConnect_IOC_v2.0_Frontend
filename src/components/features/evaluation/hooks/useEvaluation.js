'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { EvaluationService } from '../services/evaluation.service';
import { InternshipGroupService } from '@/components/features/internship/services/internshipGroup.service';
import { message } from 'antd';

export function useEvaluation() {
  const [internshipId, setInternshipId] = useState(null);
  const [myStudentId, setMyStudentId] = useState(null);
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCycle, setSelectedCycle] = useState(null);

  const [teamData, setTeamData] = useState([]);
  const [myEvaluation, setMyEvaluation] = useState(null);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [loadingMyEval, setLoadingMyEval] = useState(false);

  const [teamVisible, setTeamVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 1. Fetch Internship ID first
  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const res = await InternshipGroupService.getAll();
        const items = res?.data?.items || res?.items || [];
        if (items.length > 0) {
          const id = items[0].internshipId || items[0].id;
          const sId = items[0].studentId;
          setInternshipId(id);
          setMyStudentId(sId);
        } else {
          setLoading(false);
          message.warning('Bạn hiện không tham gia kỳ thực tập nào.');
        }
      } catch (error) {
        console.error('Error fetching internship:', error);
        setLoading(false);
      }
    };
    fetchInternship();
  }, []);

  // 2. Fetch Cycles when internshipId is available
  useEffect(() => {
    if (!internshipId) return;

    const fetchCycles = async () => {
      try {
        setLoading(true);
        const res = await EvaluationService.getStudentEvaluationCycles(internshipId);
        const data = res?.data || res || [];
        setCycles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching evaluation cycles:', error);
        message.error('Không thể tải danh sách đợt đánh giá.');
      } finally {
        setLoading(false);
      }
    };

    fetchCycles();
  }, [internshipId]);

  // 3. Fetch Team Evaluations when a cycle is selected
  const fetchTeamData = useCallback(async (cycleId) => {
    try {
      setLoadingTeam(true);
      const res = await EvaluationService.getStudentTeamEvaluations(cycleId);
      const data = res?.data || res || [];
      setTeamData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching team evaluations:', error);
      message.error('Không thể tải danh sách đánh giá nhóm.');
    } finally {
      setLoadingTeam(false);
    }
  }, []);

  // 4. Fetch My Evaluation details
  const fetchMyEvalData = useCallback(async (cycleId) => {
    try {
      setLoadingMyEval(true);
      const res = await EvaluationService.getStudentMyEvaluation(cycleId);
      const data = res?.data || res || null;
      setMyEvaluation(data);
    } catch (error) {
      console.error('Error fetching my evaluation:', error);
      message.error('Không thể tải chi tiết đánh giá cá nhân.');
    } finally {
      setLoadingMyEval(false);
    }
  }, []);

  const total = cycles.length;
  const totalPages = Math.ceil(total / pageSize);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return cycles.slice(start, start + pageSize);
  }, [cycles, page, pageSize]);

  const openTeamOverview = (cycle) => {
    setSelectedCycle(cycle);
    setTeamVisible(true);
    fetchTeamData(cycle.cycleId);
  };

  const closeTeam = () => {
    setTeamVisible(false);
  };

  const openDetail = (cycle) => {
    // If cycle is passed from Team Modal, it might already be selected
    const targetCycle = cycle || selectedCycle;
    if (!targetCycle) return;

    setSelectedCycle(targetCycle);
    setTeamVisible(false);
    fetchMyEvalData(targetCycle.cycleId);

    setTimeout(() => {
      setDetailVisible(true);
    }, 250);
  };

  const closeDetail = () => {
    setDetailVisible(false);
  };

  return {
    loading,
    loadingTeam,
    loadingMyEval,

    myStudentId,
    page,
    pageSize,
    paginated,
    total,
    totalPages,

    setPage,
    setPageSize,

    selectedCycle,
    teamData,
    myEvaluation,

    teamVisible,
    detailVisible,

    openTeamOverview,
    openDetail,
    closeTeam,
    closeDetail,
  };
}
