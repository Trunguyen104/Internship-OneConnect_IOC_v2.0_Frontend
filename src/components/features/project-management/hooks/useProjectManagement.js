'use client';

import { useCallback, useEffect, useState } from 'react';

import { PROJECT_STATUS } from '@/constants/internship-management/internship-management';

import { useProjectActions } from './useProjectActions';
import { useProjectFilters } from './useProjectFilters';
import { useProjectModals } from './useProjectModals';

export const useProjectManagement = () => {
  // --- Core Data State ---
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
  const [groups, setGroups] = useState([]);

  // --- Specialized Hooks ---
  const {
    searchTerm,
    groupIdFilter,
    statusFilter,
    pagination,
    setPagination,
    handleSearchChange,
    handleGroupFilterChange,
    handleStatusFilterChange,
    handleTableChange,
    handlePageSizeChange,
  } = useProjectFilters();

  const {
    modalVisible,
    setModalVisible,
    detailDrawerVisible,
    setDetailDrawerVisible,
    editingRecord,
    viewOnly,
    handleCreateNew,
    handleEdit,
    handleView,
  } = useProjectModals();

  // --- Data Fetching ---
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Mock filtering logic
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
    } catch (err) {
      console.error('Fetch Projects failed:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, groupIdFilter, statusFilter, mockData, setPagination]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchSupportingData = useCallback(async () => {
    try {
      // Mock groups
      setGroups([
        { id: 'group-1', internshipGroupName: 'Group 01 - Backend' },
        { id: 'group-2', internshipGroupName: 'Group 02 - App' },
        { id: 'group-3', internshipGroupName: 'Group 03 - Ops' },
      ]);
    } catch (err) {
      console.error('Fetch Supporting Data failed:', err);
    }
  }, []);

  useEffect(() => {
    fetchSupportingData();
  }, [fetchSupportingData]);

  // --- Actions Hook ---
  const {
    submitLoading,
    handleSaveProject,
    handlePublishProject,
    handleCompleteProject,
    handleDeleteProject,
  } = useProjectActions({
    editingRecord,
    fetchData,
    setMockData,
    groups,
    setModalVisible,
  });

  return {
    data,
    loading,
    searchTerm,
    groupIdFilter,
    statusFilter,
    pagination,
    modalVisible,
    detailDrawerVisible,
    editingRecord,
    submitLoading,
    viewOnly,
    groups,
    setModalVisible,
    setDetailDrawerVisible,
    handleSearchChange,
    handleGroupFilterChange,
    handleStatusFilterChange,
    handleTableChange,
    handlePageSizeChange,
    handleCreateNew,
    handleEdit,
    handleView,
    handleSaveProject,
    handlePublishProject,
    handleCompleteProject: (id) => handleCompleteProject(id, setLoading),
    handleDeleteProject: (id) => handleDeleteProject(id, setLoading),
    fetchData,
  };
};
