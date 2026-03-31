'use client';

import { Button, Drawer, Form, Space, Spin } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';

import { useProfile } from '@/components/features/user/hooks/useProfile';
import {
  PROJECT_MANAGEMENT,
  VISIBILITY_STATUS,
} from '@/constants/project-management/project-management';
import { useToast } from '@/providers/ToastProvider';

import { ProjectService } from '../services/project.service';
import ProjectBasicInfoFields from './ProjectBasicInfoFields';
import ProjectDescriptionFields from './ProjectDescriptionFields';
import ProjectResourceFields from './ProjectResourceFields';

export default function ProjectFormModal({
  visible,
  onCancel,
  onSave,
  editingRecord,
  loading,
  viewOnly,
  groups = [],
}) {
  const [form] = Form.useForm();
  const { FORM = {} } = PROJECT_MANAGEMENT;
  const { userInfo } = useProfile();
  const toast = useToast();

  const enterpriseName = useMemo(() => {
    const name = userInfo?.enterpriseName || userInfo?.EnterpriseName || 'ENT';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }, [userInfo]);

  const [dataLoading, setDataLoading] = useState(false);
  const [deletedResourceIds, setDeletedResourceIds] = useState([]);
  const [existingResources, setExistingResources] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!visible || !editingRecord?.projectId) return;

      try {
        setDataLoading(true);
        const res = await ProjectService.getById(editingRecord.projectId);
        const fullRecord = res?.data || res;

        if (fullRecord) {
          const groupId = fullRecord.internshipId || fullRecord.internshipGroupId;
          const isEmptyGuid = groupId === '00000000-0000-0000-0000-000000000000';

          // Track existing resources for UI management
          setExistingResources(fullRecord.projectResources || []);
          setDeletedResourceIds([]);

          form.setFieldsValue({
            ...fullRecord,
            name: fullRecord.projectName || fullRecord.name,
            code: fullRecord.projectCode || fullRecord.code,
            internshipGroupId: isEmptyGuid ? null : groupId,
            startDate: fullRecord.startDate ? dayjs(fullRecord.startDate) : null,
            endDate: fullRecord.endDate ? dayjs(fullRecord.endDate) : null,
            template:
              typeof fullRecord.template === 'string'
                ? FORM.TEMPLATE_MAP?.[fullRecord.template]
                : fullRecord.template,
            description: fullRecord.description || fullRecord.projectDescription,
            requirements: fullRecord.requirements || fullRecord.technicalRequirements,
            deliverables: fullRecord.deliverables || fullRecord.outcomes,
            attachments: [
              ...(fullRecord.resources?.attachments || []),
              ...(fullRecord.projectResources || [])
                .filter((r) => {
                  const rType = String(r.resourceType || '')
                    .toUpperCase()
                    .trim();
                  return rType === '1' || rType === 'FILE' || rType === 'ATTACHMENT';
                })
                .map((r) => ({
                  uid: r.projectId + r.resourceName + r.resourceType,
                  name: r.resourceName,
                  status: 'done',
                  url: r.resourceUrl,
                })),
            ],
            links: [
              ...(fullRecord.resources?.links || []),
              ...(fullRecord.projectResources || [])
                .filter((r) => {
                  const rType = String(r.resourceType || '')
                    .toUpperCase()
                    .trim();
                  return (
                    rType === '10' || rType === '8' || rType === 'LINK' || rType === 'EXTERNAL'
                  );
                })
                .map((r) => ({
                  title: r.resourceName,
                  url: r.resourceUrl,
                })),
            ],
          });
        }
      } catch (err) {
        toast.error(PROJECT_MANAGEMENT.MESSAGES?.ERROR_FETCH_DETAIL);
      } finally {
        setDataLoading(false);
      }
    };

    if (visible) {
      if (editingRecord) {
        fetchDetail();
      } else {
        form.resetFields();
        setDeletedResourceIds([]);
        setExistingResources([]);
      }
    }
  }, [visible, editingRecord, form, FORM.TEMPLATE_MAP, toast]);

  const handleValuesChange = (changedValues, allValues) => {
    // 1. Auto-generate Code (New project only)
    if (!editingRecord && (changedValues.name || changedValues.internshipGroupId)) {
      const projectName = allValues.name || '';
      const groupId = allValues.internshipGroupId;
      const group = groups.find((g) => (g.internshipId || g.id) === groupId);

      let termPart = 'TERM';
      if (group?.groupName) {
        const termMatch = group.groupName.match(/(SPRING|SUMMER|FALL)\D*(\d{4})/i);
        if (termMatch) {
          termPart = `${termMatch[1].toUpperCase()}${termMatch[2]}`;
        }
      }

      const namePart = projectName
        .trim()
        .split(' ')
        .map((w) => w[0] || '')
        .join('')
        .toUpperCase();

      if (projectName) {
        form.setFieldsValue({
          code: `PRJ-${enterpriseName}_${termPart}_${namePart}`,
        });
      }
    }

    // 2. Auto-set Dates from Intern Phase (AC-08)
    if (changedValues.internshipGroupId) {
      const groupId = changedValues.internshipGroupId;
      const group = groups.find((g) => (g.internshipId || g.id) === groupId);
      if (group?.startDate && group?.endDate) {
        form.setFieldsValue({
          startDate: dayjs(group.startDate),
          endDate: dayjs(group.endDate),
        });
      }
    }

    // 3. Mark form as dirty (AC-08 optimization)
    if (!viewOnly) {
      const isActuallyDirty = Object.keys(changedValues).length > 0;
      if (isActuallyDirty) {
        form.setFieldsValue({ _isDirty: true });
      }
    }
  };

  const handleSubmit = (isDraft = true) => {
    form
      .validateFields()
      .then((values) => {
        onSave({ ...values, resourceDeleteIds: deletedResourceIds }, isDraft);
      })
      .catch(() => {});
  };

  // AC-02: Auto-save on close if creating new project and name is entered
  const handleModalClose = () => {
    if (loading) return;

    const values = form.getFieldsValue(true);
    const hasContent = values.name && values.name.trim().length > 0;
    const isDirty = values._isDirty === true;

    // AC-02/AC-08: Auto-save on close if name is entered AND changes were made
    if (!viewOnly && hasContent && isDirty) {
      const isNew = !editingRecord;
      const visStatus = editingRecord?.visibilityStatus ?? VISIBILITY_STATUS.DRAFT; // Default to Draft if uncertain
      const isDraftStatus = visStatus === VISIBILITY_STATUS.DRAFT;

      if (isNew || isDraftStatus) {
        // Auto-save as draft
        onSave({ ...values, template: values.template ?? 2 }, true);
        return;
      }

      // For Published projects, we just save the content without changing status
      if (visStatus === VISIBILITY_STATUS.PUBLISHED) {
        onSave({ ...values, template: values.template ?? 2 }, false);
        return;
      }
    }
    onCancel();
  };

  if (!mounted) return null;

  return (
    <Drawer
      title={
        <div>
          <h3 className="mb-0 text-lg font-bold">
            {editingRecord ? (viewOnly ? FORM.TITLE_VIEW : FORM.TITLE_EDIT) : FORM.TITLE_ADD}
          </h3>
          {!viewOnly && <p className="mt-1 text-xs font-normal text-gray-400">{FORM.DESC}</p>}
        </div>
      }
      open={visible}
      onClose={handleModalClose}
      size={640}
      footer={
        !viewOnly && (
          <div className="flex justify-between px-4 py-2">
            <Button onClick={onCancel}>{FORM.CANCEL_BTN}</Button>
            <Space>
              <Button type="primary" onClick={() => handleSubmit(false)} loading={loading}>
                {editingRecord ? FORM.SAVE_CHANGES || 'Save Changes' : FORM.PUBLISH || 'Save'}
              </Button>
            </Space>
          </div>
        )
      }
    >
      <Spin spinning={dataLoading} description={PROJECT_MANAGEMENT.COMMON.LOADING}>
        <Form
          form={form}
          layout="vertical"
          disabled={viewOnly || dataLoading}
          initialValues={{
            template: 'None',
            links: [],
            attachments: [],
          }}
          onValuesChange={handleValuesChange}
          className="pb-10"
        >
          <ProjectBasicInfoFields
            FORM={FORM}
            groups={groups}
            userInfo={userInfo}
            editingRecord={editingRecord}
          />

          <ProjectDescriptionFields FORM={FORM} />

          <ProjectResourceFields
            FORM={FORM}
            PROJECT_MANAGEMENT={PROJECT_MANAGEMENT}
            existingResources={existingResources}
            deletedResourceIds={deletedResourceIds}
            onDeleteExisting={(rid) => setDeletedResourceIds((prev) => [...prev, rid])}
          />
        </Form>
      </Spin>
    </Drawer>
  );
}
