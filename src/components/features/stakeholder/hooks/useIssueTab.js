'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import StakeholderIssueService from '@/components/features/stakeholder/services/stakeholderIssue';
import { StakeholderService } from '@/components/features/stakeholder/services/stakeholder';
import { ProjectService } from '@/components/features/project/services/projectService';
import { useToast } from '@/providers/ToastProvider';
import { ISSUE_MESSAGES } from '@/constants/stakeholderIssue/messages';
import { ISSUE_STATUS } from '../constants/issueStatus';

export function useIssueTab() {
  const toast = useToast();
  const [internshipId, setInternshipId] = useState(null);
  const [issues, setIssues] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

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

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  const tableBodyRef = useRef(null);

  useEffect(() => {
    tableBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, pageSize]);

  const handleSaveIssue = async () => {
    if (!issueForm.title?.trim() || !issueForm.stakeholderId || !issueForm.description?.trim()) {
      toast.warning(ISSUE_MESSAGES.REQUIRED_FIELDS.GENERAL);
      return;
    }

    try {
      await StakeholderIssueService.create({
        title: issueForm.title,
        description: issueForm.description,
        stakeholderId: issueForm.stakeholderId,
        internshipId,
      });

      toast.success(ISSUE_MESSAGES.CREATE_SUCCESS);

      setOpenIssueForm(false);
      setIssueForm({ title: '', description: '', stakeholderId: '' });
      fetchIssues();
    } catch {
      toast.error(ISSUE_MESSAGES.CREATE_FAILED);
    }
  };

  const handleDelete = async (id) => {
    try {
      await StakeholderIssueService.delete(id);
      toast.success(ISSUE_MESSAGES.DELETE_SUCCESS);
      fetchIssues();
    } catch {
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
        newStatus === ISSUE_STATUS.RESOLVED ? ISSUE_MESSAGES.RESOLVED : ISSUE_MESSAGES.REOPENED,
      );

      fetchIssues();
    } catch (err) {
      console.error('Update status error:', err);
      toast.error(ISSUE_MESSAGES.UPDATE_STATUS_FAILED);
    }
  };

  useEffect(() => {
    const fetchProjectId = async () => {
      try {
        const res = await ProjectService.getAll({
          PageNumber: 1,
          PageSize: 1,
        });

        if (res?.data?.items?.length > 0) {
          setInternshipId(res.data.items[0].internshipId);
        }
      } catch {
        toast.error(ISSUE_MESSAGES.LOAD_PROJECT_FAILED);
      }
    };

    fetchProjectId();
  }, [toast]);

  const fetchStakeholders = useCallback(async () => {
    if (!internshipId) return;

    try {
      const res = await StakeholderService.getByProject(internshipId);
      if (res?.data?.items) {
        setStakeholders(res.data.items);
      }
    } catch {
      // toast.error('Failed to load stakeholders');
    }
  }, [internshipId]);

  const fetchIssues = useCallback(async () => {
    if (!internshipId) return;

    try {
      setLoading(true);

      const params = {
        internshipId,
        PageIndex: page,
        PageSize: pageSize,
        OrderBy: 'createdAt desc',
      };

      if (debouncedSearch) {
        params.Search = debouncedSearch;
      }

      const res = await StakeholderIssueService.getAll(params);

      if (res?.data?.items) {
        const normalizedItems = res.data.items.map((item) => ({
          ...item,
          status:
            typeof item.status === 'string'
              ? (ISSUE_STATUS[item.status.toUpperCase()] ?? item.status)
              : item.status,
        }));
        setIssues(normalizedItems);
        setTotal(res.data.totalCount || 0);
      }
    } finally {
      setLoading(false);
    }
  }, [internshipId, page, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchStakeholders();
  }, [fetchStakeholders]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return {
    internshipId,
    issues,
    stakeholders,
    loading,
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
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
