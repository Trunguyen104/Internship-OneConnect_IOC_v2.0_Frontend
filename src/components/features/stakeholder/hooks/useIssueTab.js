'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import { ProjectService } from '@/components/features/project/services/project.service';
import { StakeholderService } from '@/components/features/stakeholder/services/stakeholder.service';
import StakeholderIssueService from '@/components/features/stakeholder/services/stakeholder-issue.service';
import { ISSUE_MESSAGES } from '@/constants/stakeholderIssue/messages';
import { useToast } from '@/providers/ToastProvider';

import { ISSUE_STATUS } from '../constants/issueStatus';

export function useIssueTab() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 1. Fetch Project & Internship ID
  const { data: projectInfo } = useQuery({
    queryKey: ['active-project-info'],
    queryFn: async () => {
      try {
        const res = await ProjectService.getAll({ PageNumber: 1, PageSize: 1 });
        if (res?.data?.items?.length > 0) {
          return { internshipId: res.data.items[0].internshipId };
        }
        return null;
      } catch (err) {
        toast.error(ISSUE_MESSAGES.LOAD_PROJECT_FAILED);
        return null;
      }
    },
    staleTime: Infinity,
  });

  const internshipId = projectInfo?.internshipId;

  // 2. Fetch Stakeholders for dropdown
  const { data: stakeholders = [] } = useQuery({
    queryKey: ['stakeholders', internshipId],
    queryFn: async () => {
      if (!internshipId) return [];
      try {
        const res = await StakeholderService.getByProject(internshipId);
        return res?.data?.items || [];
      } catch (err) {
        return [];
      }
    },
    enabled: !!internshipId,
  });

  // 3. Fetch Issues
  const {
    data: issueData,
    isLoading: loading,
    refetch: fetchIssues,
  } = useQuery({
    queryKey: ['stakeholder-issues', internshipId, page, pageSize, search],
    queryFn: async () => {
      if (!internshipId) return { items: [], total: 0 };
      try {
        const params = {
          internshipId,
          PageIndex: page,
          PageSize: pageSize,
          OrderBy: 'createdAt desc',
          Search: search?.trim() || undefined,
        };
        const res = await StakeholderIssueService.getAll(params);
        const normalizedItems = (res?.data?.items || []).map((item) => ({
          ...item,
          status:
            typeof item.status === 'string'
              ? (ISSUE_STATUS[item.status.toUpperCase()] ?? item.status)
              : item.status,
        }));
        return {
          items: normalizedItems,
          total: res?.data?.totalCount || 0,
        };
      } catch (err) {
        return { items: [], total: 0 };
      }
    },
    enabled: !!internshipId,
    staleTime: 2 * 60 * 1000,
  });

  const [openIssueForm, setOpenIssueForm] = useState(false);
  const [issueForm, setIssueForm] = useState({
    title: '',
    description: '',
    stakeholderId: '',
  });

  const [issueDetail, setIssueDetail] = useState(null);

  const handleViewDetail = async (id) => {
    try {
      const res = await StakeholderIssueService.getById(id);
      if (res?.data) {
        const item = res.data;
        const normalized = {
          ...item,
          status:
            typeof item.status === 'string'
              ? (ISSUE_STATUS[item.status.toUpperCase()] ?? item.status)
              : item.status,
        };
        setIssueDetail(normalized);
      }
    } catch {
      // toast.error('Failed to load detail');
    }
  };

  const tableBodyRef = useRef(null);

  useEffect(() => {
    tableBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, pageSize]);

  const handleSaveIssue = async () => {
    if (!issueForm.title?.trim() || !issueForm.stakeholderId) {
      toast.warning(ISSUE_MESSAGES.REQUIRED_FIELDS.GENERAL);
      return;
    }

    try {
      const res = await StakeholderIssueService.create({
        title: issueForm.title,
        description: issueForm.description,
        stakeholderId: issueForm.stakeholderId,
        internshipId,
      });

      if (res && res.isSuccess !== false && res.statusCode !== 403) {
        toast.success(ISSUE_MESSAGES.CREATE_SUCCESS);
        setOpenIssueForm(false);
        setIssueForm({ title: '', description: '', stakeholderId: '' });
        fetchIssues();
      } else {
        const errorMsg =
          res?.data?.errors?.[0] ||
          res?.errors?.[0] ||
          res?.message ||
          ISSUE_MESSAGES.CREATE_FAILED;

        if (res?.status === 403 || res?.statusCode === 403) {
          toast.error(errorMsg || 'You do not have permission to perform this action');
        } else {
          toast.error(errorMsg);
        }
      }
    } catch (err) {
      console.error('Error saving issue:', err);
      toast.error(ISSUE_MESSAGES.CREATE_FAILED);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await StakeholderIssueService.delete(id);
      if (res && res.isSuccess !== false && res.statusCode !== 403) {
        toast.success(ISSUE_MESSAGES.DELETE_SUCCESS);
        fetchIssues();
      } else {
        const errorMsg =
          res?.data?.errors?.[0] ||
          res?.errors?.[0] ||
          res?.message ||
          ISSUE_MESSAGES.DELETE_FAILED;

        if (res?.status === 403 || res?.statusCode === 403) {
          toast.error(errorMsg || 'You do not have permission to perform this action');
        } else {
          toast.error(errorMsg);
        }
      }
    } catch (error) {
      console.error('Error deleting issue:', error);
      toast.error(ISSUE_MESSAGES.DELETE_FAILED);
    }
  };

  const handleToggleStatus = async (issue) => {
    try {
      const currentStatus = Number(issue.status);
      const newStatus =
        currentStatus === ISSUE_STATUS.RESOLVED ? ISSUE_STATUS.OPEN : ISSUE_STATUS.RESOLVED;

      const res = await StakeholderIssueService.updateStatus(issue.id, newStatus);

      if (res && res.isSuccess === false) {
        toast.error(res.message || ISSUE_MESSAGES.UPDATE_STATUS_FAILED);
        return;
      }

      toast.success(
        newStatus === ISSUE_STATUS.RESOLVED ? ISSUE_MESSAGES.RESOLVED : ISSUE_MESSAGES.REOPENED
      );

      fetchIssues();
    } catch (err) {
      console.error('Update status error:', err);
      toast.error(ISSUE_MESSAGES.UPDATE_STATUS_FAILED);
    }
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  return {
    internshipId,
    issues: issueData?.items || [],
    stakeholders,
    loading,
    search,
    setSearch: handleSearchChange, // Wrapped for page reset
    page,
    setPage,
    pageSize,
    setPageSize,
    total: issueData?.total || 0,
    openIssueForm,
    setOpenIssueForm,
    issueForm,
    setIssueForm,
    issueDetail,
    setIssueDetail,
    handleViewDetail,
    handleSaveIssue,
    handleDelete,
    handleToggleStatus,
    tableBodyRef,
    fetchIssues,
  };
}
