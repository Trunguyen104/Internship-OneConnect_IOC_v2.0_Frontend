'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  INTERNSHIP_MANAGEMENT_UI,
  PROJECT_STATUS,
} from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';

import { ProjectService } from '../services/project.service';

export const useProjectManagement = () => {
  const toast = useToast();
  const { PROJECT_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;
  const { MESSAGES } = PROJECT_MANAGEMENT;

  // List State
  const [data, setData] = useState([]);
  const [mockData, setMockData] = useState([
    {
      projectId: '1',
      name: 'E-Commerce CMS Platform',
      code: 'PRJ-IOC_2024_001',
      internshipGroup: { internshipGroupName: 'Group 01 - Backend' },
      internshipGroupId: 'group-1',
      field: 'Web Development',
      template: 'Scrum',
      startDate: '2024-03-01',
      endDate: '2024-06-01',
      status: PROJECT_STATUS.DRAFT,
      description: 'A robust CMS system for managing e-commerce products and orders.',
      requirements: 'Node.js, PostgreSQL, Redis',
      deliverables: 'Architecture Doc, Source Code, API Documentation',
    },
    {
      projectId: '2',
      name: 'Mobile Banking Wallet',
      code: 'PRJ-IOC_2024_002',
      internshipGroup: { internshipGroupName: 'Group 02 - App' },
      internshipGroupId: 'group-2',
      field: 'Mobile Development',
      template: 'Kanban',
      startDate: '2024-03-15',
      endDate: '2024-06-15',
      status: PROJECT_STATUS.PUBLISHED,
      description: 'Secure mobile banking solution with QR payment support.',
      requirements: 'Flutter, Firebase, Biometric Auth',
      deliverables: 'UI/UX Design, iOS/Android Apps',
    },
    {
      projectId: '3',
      name: 'AI Chatbot Integration',
      code: 'PRJ-IOC_2024_003',
      internshipGroup: { internshipGroupName: 'Group 01 - Backend' },
      internshipGroupId: 'group-1',
      field: 'Artificial Intelligence',
      template: 'None',
      startDate: '2024-02-01',
      endDate: '2024-05-01',
      status: PROJECT_STATUS.COMPLETED,
      description: 'Integrating GPT-4 into existing customer support portal.',
      requirements: 'Python, OpenAI API, LangChain',
      deliverables: 'Model Fine-tuning report, Integrated Widget',
    },
    {
      projectId: '4',
      name: 'DevOps CI/CD Pipeline',
      code: 'PRJ-IOC_2024_004',
      internshipGroup: { internshipGroupName: 'Group 03 - Ops' },
      internshipGroupId: 'group-3',
      field: 'Infrastructure',
      template: 'Kanban',
      startDate: '2024-04-01',
      endDate: '2024-07-01',
      status: PROJECT_STATUS.PUBLISHED,
      description: 'Automating deployment for all internal services.',
      requirements: 'Docker, Kubernetes, Jenkins',
      deliverables: 'Pipeline Scripts, K8s Configs',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupIdFilter, setGroupIdFilter] = useState(undefined);
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [assignmentModalVisible, setAssignmentModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);

  // Supporting Data
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      /* Coment out real API call until backend is ready
      const res = await ProjectService.getAll(params);
      if (res?.data?.items && res.data.items.length > 0) {
        console.log('Projects fetched successfully:', res.data.items);
        setData(res.data.items);
        setPagination(prev => ({
          ...prev,
          total: res.data.totalCount || 0,
        }));
        return;
      }
      */
      console.log('Mock Mode: Skipping real API call, using mock data.');
      throw new Error('Force Mock Mode');
    } catch (err) {
      console.warn('Project API failed, falling back to mock data. Error:', err.message);
      // filtering for mock data
      let filtered = [...mockData];
      if (searchTerm) {
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (groupIdFilter) {
        filtered = filtered.filter((p) => p.internshipGroupId === groupIdFilter);
      }
      if (statusFilter) {
        filtered = filtered.filter((p) => p.status === statusFilter);
      }

      setData(filtered);
      setPagination((prev) => ({
        ...prev,
        total: filtered.length,
      }));
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchTerm, groupIdFilter, statusFilter, mockData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchSupportingData = useCallback(async () => {
    try {
      /* Comment out real API call
      const resGroups = await ProjectService.getGroupsForMentor();
      if (resGroups?.data?.items) {
        setGroups(resGroups.data.items || []);
        return;
      }
      */
      throw new Error('Force Mock Mode');
    } catch (err) {
      setGroups([
        { id: 'group-1', internshipGroupName: 'Group 01 - Backend' },
        { id: 'group-2', internshipGroupName: 'Group 02 - App' },
        { id: 'group-3', internshipGroupName: 'Group 03 - Ops' },
      ]);
    }
  }, []);

  useEffect(() => {
    fetchSupportingData();
  }, [fetchSupportingData]);

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleGroupFilterChange = (val) => {
    setGroupIdFilter(val);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (newPagination) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination((prev) => ({
      ...prev,
      current: 1,
      pageSize: newSize,
    }));
  };

  const handleCreateNew = () => {
    setEditingRecord(null);
    setViewOnly(false);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setViewOnly(false);
    setModalVisible(true);
  };

  const handleView = (record) => {
    setEditingRecord(record);
    setViewOnly(true);
    setModalVisible(true);
  };

  const handleAssign = (record) => {
    setEditingRecord(record);
    setAssignmentModalVisible(true);
  };

  const handleSaveProject = async (values, isDraft = true) => {
    try {
      setSubmitLoading(true);
      const payload = {
        ...values,
        status: isDraft ? PROJECT_STATUS.DRAFT : PROJECT_STATUS.PUBLISHED,
      };

      try {
        if (editingRecord) {
          await ProjectService.update(editingRecord.projectId, payload);
          toast.success(MESSAGES.UPDATE_SUCCESS);
        } else {
          await ProjectService.create(payload);
          toast.success(isDraft ? MESSAGES.SAVE_DRAFT_SUCCESS : MESSAGES.PUBLISH_SUCCESS);
        }
      } catch (apiErr) {
        // Mock Update
        if (editingRecord) {
          setMockData((prev) =>
            prev.map((p) => (p.projectId === editingRecord.projectId ? { ...p, ...payload } : p))
          );
          toast.success(MESSAGES.UPDATE_SUCCESS + ' (Mock)');
        } else {
          const newProject = {
            ...payload,
            projectId: Date.now().toString(),
            internshipGroup: groups.find(
              (g) => (g.id || g.internshipGroupId) === payload.internshipGroupId
            ) || { internshipGroupName: 'Unknown Group' },
          };
          setMockData((prev) => [newProject, ...prev]);
          toast.success(
            (isDraft ? MESSAGES.SAVE_DRAFT_SUCCESS : MESSAGES.PUBLISH_SUCCESS) + ' (Mock)'
          );
        }
      }
      setModalVisible(false);
      fetchData();
    } catch (err) {
      toast.error(MESSAGES.ERROR);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handlePublishProject = async (id) => {
    try {
      setLoading(true);
      try {
        await ProjectService.publish(id);
      } catch (apiErr) {
        setMockData((prev) =>
          prev.map((p) => (p.projectId === id ? { ...p, status: PROJECT_STATUS.PUBLISHED } : p))
        );
      }
      toast.success(MESSAGES.PUBLISH_SUCCESS);
      fetchData();
    } catch (err) {
      toast.error(MESSAGES.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProject = async (id) => {
    try {
      setLoading(true);
      try {
        await ProjectService.complete(id);
      } catch (apiErr) {
        setMockData((prev) =>
          prev.map((p) => (p.projectId === id ? { ...p, status: PROJECT_STATUS.COMPLETED } : p))
        );
      }
      toast.success(MESSAGES.COMPLETE_SUCCESS);
      fetchData();
    } catch (err) {
      toast.error(MESSAGES.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      setLoading(true);
      try {
        await ProjectService.delete(id);
      } catch (apiErr) {
        setMockData((prev) => prev.filter((p) => p.projectId !== id));
      }
      toast.success(MESSAGES.DELETE_SUCCESS);
      fetchData();
    } catch (err) {
      toast.error(MESSAGES.ERROR);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    searchTerm,
    groupIdFilter,
    statusFilter,
    pagination,
    modalVisible,
    assignmentModalVisible,
    editingRecord,
    submitLoading,
    viewOnly,
    groups,
    students,
    setModalVisible,
    setAssignmentModalVisible,
    handleSearchChange,
    handleGroupFilterChange,
    handleStatusFilterChange,
    handleTableChange,
    handleCreateNew,
    handleEdit,
    handleView,
    handleAssign,
    handleSaveProject,
    handlePublishProject,
    handleCompleteProject,
    handleDeleteProject,
  };
};
