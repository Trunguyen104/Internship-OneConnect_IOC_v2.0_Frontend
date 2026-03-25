'use client';

import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { useEnterpriseGroups } from '../../internship-group-management/hooks/useEnterpriseGroups';
import { EnterpriseMentorService } from '../services/enterprise-mentor.service';

const GroupActionModal = ({ open, students = [], type, onCancel, onConfirm }) => {
  const [form] = Form.useForm();
  const { GROUP_ACTION } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.MODALS;
  const [mentors, setMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(false);

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (type === 'CHANGE' && students.length > 0) {
        form.setFieldsValue({
          mentorId: students[0].mentorId,
          projectName: students[0].projectName,
        });
      }
      fetchMentors();
    }
  }, [open]); // Narrow dependency to prevent resetting on every student prop change

  const fetchMentors = async () => {
    try {
      setLoadingMentors(true);
      const res = await EnterpriseMentorService.getMentors();
      const items = res?.data?.items || res?.items || res?.data || [];
      setMentors(
        (Array.isArray(items) ? items : []).map((m) => ({
          label: `${m.fullName || m.name || ''} (${m.email || ''})`,
          value: String(m.id || m.mentorId || m.userId),
        }))
      );
    } catch (err) {
      // Silent error
    } finally {
      setLoadingMentors(false);
    }
  };

  const groupFilters = React.useMemo(() => ({ status: undefined, includeArchived: true }), []);
  const groupPagination = React.useMemo(() => ({ current: 1, pageSize: 100 }), []);

  const { data: activeGroups, loading: fetchingGroups } = useEnterpriseGroups({
    termId: students[0]?.termId, // Use the first student's termId, mock will fall back if undefined
    filters: groupFilters,
    pagination: groupPagination,
    search: '',
  });

  const currentGroupIds = React.useMemo(() => {
    return students.map((s) => s.groupId).filter(Boolean);
  }, [students]);

  const handleFinish = (values) => {
    if (type === 'CHANGE') {
      const newGroup = activeGroups.find((g) => g.id === values.groupId);
      const oldGroupNames = Array.from(new Set(students.map((s) => s.groupName))).join(', ');
      const studentNames =
        students.length === 1
          ? students[0]?.studentFullName || students[0]?.fullName
          : `${students.length} ${GROUP_ACTION.STUDENTS_SELECTED}`;

      showDeleteConfirm({
        title: GROUP_ACTION.CHANGE_CONFIRM_TITLE,
        content: GROUP_ACTION.CHANGE_CONFIRM_CONTENT.replace('{student}', studentNames)
          .replace(
            '{oldGroup}',
            oldGroupNames || INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.TABLE.NOT_ASSIGNED
          )
          .replace(
            '{newGroup}',
            newGroup?.name || INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.TABLE.NOT_ASSIGNED
          ),
        okText: GROUP_ACTION.SUBMIT_CHANGE,
        type: 'warning',
        onOk: () => onConfirm(values),
      });
    } else {
      onConfirm(values);
    }
  };

  return (
    <CompoundModal open={open} onCancel={onCancel} width={560} destroyOnHidden closable={false}>
      <CompoundModal.Header
        icon={<UserOutlined />}
        title={type === 'ADD' ? GROUP_ACTION.TITLE_ADD : GROUP_ACTION.TITLE_CHANGE}
        subtitle={
          <div className="flex items-center gap-2">
            <span className="opacity-70">{GROUP_ACTION.STUDENT_LABEL}</span>
            <span className="text-text font-bold">
              {students.length === 1
                ? students[0]?.studentFullName || students[0]?.fullName
                : `${students.length} ${GROUP_ACTION.STUDENTS_SELECTED}`}
            </span>
          </div>
        }
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="px-6 py-4"
        requiredMark={false}
      >
        <Form.Item
          label={
            <span className="text-text text-[11px] font-bold tracking-wider uppercase">
              {GROUP_ACTION.GROUP_LABEL}
            </span>
          }
          name="groupId"
          rules={[{ required: true, message: GROUP_ACTION.GROUP_REQUIRED }]}
          className="mb-3"
        >
          <Select
            showSearch
            placeholder={GROUP_ACTION.GROUP_PLACEHOLDER}
            className="h-10 w-full rounded-xl"
            suffixIcon={<SearchOutlined className="text-muted" />}
            loading={fetchingGroups}
            notFoundContent={
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <span className="text-muted text-xs font-medium mb-1">
                  {GROUP_ACTION.EMPTY_STATE}
                </span>
                <span className="text-[10px] text-muted opacity-60">
                  {GROUP_ACTION.EMPTY_SUGGESTION}
                </span>
              </div>
            }
            options={activeGroups.map((g) => {
              const isCurrent = currentGroupIds.includes(g.id);
              const mentor = g.mentorName || GROUP_ACTION.NO_MENTOR;
              const count = `${g.memberCount} ${GROUP_ACTION.STUDENTS_SUFFIX}`;

              return {
                label: (
                  <div
                    className={`flex justify-between items-center w-full px-1 py-0.5 rounded ${isCurrent ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      <span
                        className={`text-xs font-bold leading-none ${isCurrent ? 'text-primary' : 'text-text'}`}
                      >
                        {g.name}
                      </span>
                      <span className="text-[10px] text-muted/60 font-medium truncate">
                        {mentor}
                        {GROUP_ACTION.SEPARATOR}
                        {count}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="bg-primary text-white rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter whitespace-nowrap ml-2">
                        {GROUP_ACTION.CURRENT_GROUP}
                      </span>
                    )}
                  </div>
                ),
                value: g.id,
                disabled: isCurrent,
              };
            })}
            filterOption={(input, option) => {
              const group = activeGroups.find((g) => g.id === option.value);
              const searchStr = `${group?.name || ''} ${group?.mentorName || ''}`.toLowerCase();
              return searchStr.includes(input.toLowerCase());
            }}
          />
          {type === 'CHANGE' &&
            activeGroups.length > 0 &&
            activeGroups.every((g) => currentGroupIds.includes(g.id)) && (
              <div className="mt-2 text-[11px] font-medium text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200/50 shadow-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                <span className="mt-0.5 opacity-70">{GROUP_ACTION.BULLET}</span>
                <span className="italic leading-relaxed">{GROUP_ACTION.ONLY_GROUP_ERROR}</span>
              </div>
            )}
        </Form.Item>

        {type === 'CHANGE' && (
          <div className="animate-in fade-in slide-in-from-bottom-1 duration-500">
            <Form.Item
              label={
                <span className="text-text text-[11px] font-bold tracking-wider uppercase">
                  {INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.MODALS.ASSIGN.MENTOR_LABEL}
                </span>
              }
              name="mentorId"
              className="mb-3"
            >
              <Select
                placeholder={
                  INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.MODALS.ASSIGN.MENTOR_PLACEHOLDER
                }
                className="h-10 w-full rounded-xl"
                loading={loadingMentors}
                options={mentors}
                showSearch
                optionFilterProp="label"
                notFoundContent={loadingMentors ? <Spin size="small" /> : null}
              />
            </Form.Item>
          </div>
        )}

        <CompoundModal.Footer
          cancelText={GROUP_ACTION.CANCEL}
          confirmText={type === 'ADD' ? GROUP_ACTION.SUBMIT_ADD : GROUP_ACTION.SUBMIT_CHANGE}
          onCancel={onCancel}
          onConfirm={() => form.submit()}
          confirmDisabled={
            activeGroups.length === 0 ||
            (type === 'CHANGE' && activeGroups.every((g) => currentGroupIds.includes(g.id)))
          }
        />
        {activeGroups.length === 0 && !fetchingGroups && (
          <div className="mt-4 rounded-xl bg-orange-50/50 p-4 border border-orange-100 italic text-[11px] text-orange-600 leading-relaxed">
            {GROUP_ACTION.EMPTY_SUGGESTION}
          </div>
        )}
      </Form>
    </CompoundModal>
  );
};

export default GroupActionModal;
