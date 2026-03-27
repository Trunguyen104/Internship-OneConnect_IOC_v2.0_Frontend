'use client';

import { Button, Drawer, Form, Space } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';

import { useProfile } from '@/components/features/user/hooks/useProfile';
import { PROJECT_MANAGEMENT } from '@/constants/project-management/project-management';
import { useToast } from '@/providers/ToastProvider';

import { ProjectService } from '../services/project.service';
import ProjectBasicInfoFields from './sub-components/ProjectBasicInfoFields';
import ProjectDescriptionFields from './sub-components/ProjectDescriptionFields';
import ProjectResourceFields from './sub-components/ProjectResourceFields';

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
                .filter((r) => r.resourceType === 1)
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
                .filter((r) => r.resourceType === 10)
                .map((r) => ({
                  title: r.resourceName,
                  url: r.resourceUrl,
                })),
            ],
          });
        }
      } catch (err) {
        toast.error('Failed to fetch project details');
      } finally {
        setDataLoading(false);
      }
    };

    if (visible) {
      if (editingRecord) {
        fetchDetail();
      } else {
        form.resetFields();
      }
    }
  }, [visible, editingRecord, form, FORM.TEMPLATE_MAP, toast]);

  const handleValuesChange = (changedValues, allValues) => {
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
  };

  const handleSubmit = (isDraft = true) => {
    form
      .validateFields()
      .then((values) => {
        const selectedGroupId = values.internshipGroupId;
        const selectedGroup = groups.find((g) => (g.internshipId || g.id) === selectedGroupId);
        const groupStatus = selectedGroup?.status || selectedGroup?.groupStatus;
        if (groupStatus === 3 || groupStatus === 2) {
          toast.warning(PROJECT_MANAGEMENT.MESSAGES.ERROR_INACTIVE_GROUP);
          return;
        }
        onSave(values, isDraft);
      })
      .catch(() => {});
  };

  return (
    <Drawer
      loading={dataLoading}
      forceRender={true}
      title={
        <div>
          <h3 className="mb-0 text-lg font-bold">
            {editingRecord ? (viewOnly ? 'Project Details' : FORM.TITLE_EDIT) : FORM.TITLE_ADD}
          </h3>
          {!viewOnly && <p className="mt-1 text-xs font-normal text-gray-400">{FORM.DESC}</p>}
        </div>
      }
      open={visible}
      onClose={onCancel}
      size={640}
      footer={
        !viewOnly && (
          <div className="flex justify-between px-4 py-2">
            <Button onClick={onCancel}>Cancel</Button>
            <Space>
              {editingRecord?.status === 1 ? (
                <Button type="primary" onClick={() => handleSubmit(false)} loading={loading}>
                  {FORM.SAVE_CHANGES || 'Save Changes'}
                </Button>
              ) : (
                <>
                  <Button onClick={() => handleSubmit(true)} loading={loading}>
                    {FORM.SAVE_DRAFT}
                  </Button>
                  <Button type="primary" onClick={() => handleSubmit(false)} loading={loading}>
                    {FORM.PUBLISH}
                  </Button>
                </>
              )}
            </Space>
          </div>
        )
      }
    >
      <Form
        form={form}
        layout="vertical"
        disabled={viewOnly}
        initialValues={{ template: 'None' }}
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

        <ProjectResourceFields FORM={FORM} PROJECT_MANAGEMENT={PROJECT_MANAGEMENT} />
      </Form>
    </Drawer>
  );
}
