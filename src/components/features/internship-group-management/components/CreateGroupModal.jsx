import { EditOutlined, InfoCircleOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, DatePicker, Form, Input, Select, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { memo, useEffect } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { Text } = Typography;

export const CreateGroupModal = memo(
  ({
    open,
    group = null,
    initialStudents = [],
    students = [],
    mentors = [],
    existingGroups = [],
    loadingStudents = false,
    loadingMentors = false,
    onCancel,
    onFinish,
    isAddingStudents = false,
  }) => {
    const [form] = Form.useForm();
    const { CREATE } = INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.MODALS;
    const isEdit = !!group;
    const groupNameValue = Form.useWatch('groupName', form);
    const selectedStudentIds = Form.useWatch('studentIds', form);

    useEffect(() => {
      if (open) {
        if (!isEdit) {
          form.resetFields();
          const ids = initialStudents.map((s) => s.id || s.studentId || s.applicationId);
          form.setFieldsValue({
            groupName: `${CREATE.DEFAULT_NAME_PREFIX}`,
            studentIds: ids,
            startDate: dayjs(),
            endDate: dayjs().add(1, 'month'),
          });
        } else {
          form.setFieldsValue({
            groupName: group.name,
            description: group.description || '',
            mentorId: group.mentorId,
            studentIds: (group.members || []).map((s) => s.id || s.studentId || s.applicationId),
            startDate: group.startDate ? dayjs(group.startDate) : undefined,
            endDate: group.endDate ? dayjs(group.endDate) : undefined,
          });
        }
      }
    }, [
      open,
      form,
      group,
      isEdit,
      initialStudents,
      CREATE.DEFAULT_NAME_PREFIX,
      existingGroups.length,
    ]);

    const handleCancel = () => {
      onCancel();
    };

    const handleFinish = (values) => {
      const studentIds =
        values.studentIds && values.studentIds.length > 0
          ? values.studentIds
          : initialStudents.map((s) => s.id || s.studentId || s.applicationId);

      const payload = {
        ...values,
        students: studentIds.map((id) => ({ studentId: id, role: 1 })),
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
      };
      delete payload.studentIds;

      onFinish(payload);
      form.resetFields();
    };

    const mentorOptions = mentors.map((m) => ({
      label: (
        <div className="flex items-center gap-2 py-1">
          <Avatar size="small" src={m.avatar} icon={<UserOutlined />} />
          <div className="flex flex-col leading-tight">
            <Text className="text-xs font-bold">{m.fullName || m.name || 'Unknown Mentor'}</Text>
            <Text className="text-muted text-[10px] opacity-60">
              {m.department || m.email || 'Mentor'}
            </Text>
          </div>
        </div>
      ),
      value: m.id || m.mentorId,
      searchValue: `${m.fullName || ''} ${m.email || ''}`,
    }));

    const combinedStudentList = [...students];
    if (isEdit && group?.members) {
      group.members.forEach((m) => {
        const id = m.id || m.studentId || m.applicationId;
        if (!combinedStudentList.find((s) => (s.id || s.studentId || s.applicationId) === id)) {
          combinedStudentList.push(m);
        }
      });
    }

    const studentOptions = combinedStudentList.map((s) => ({
      label: (
        <div className="flex items-center gap-2 py-1">
          <Avatar size="small" src={s.avatar} icon={<UserOutlined />} />
          <div className="flex flex-col leading-tight">
            <Text className="text-xs font-bold">
              {s.studentFullName || s.fullName || s.name || 'Unknown Student'}
            </Text>
            <Text className="text-muted text-[10px] uppercase opacity-60">
              {s.studentCode || s.code || 'No Code'} {CREATE.BULLET} {s.major || 'No Major'}
            </Text>
          </div>
        </div>
      ),
      value: s.studentId || s.StudentId || s.id || s.applicationId,
      searchValue: `${s.studentFullName || s.fullName || ''} ${s.name || ''} ${s.studentCode || s.code || ''}`,
    }));

    return (
      <CompoundModal
        open={open}
        onCancel={handleCancel}
        width={640}
        destroyOnHidden
        closable={false}
      >
        <CompoundModal.Header
          icon={<TeamOutlined />}
          title={
            isAddingStudents
              ? INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.ACTIONS.ADD_TO_GROUP
              : isEdit
                ? CREATE.TITLE_EDIT
                : CREATE.TITLE
          }
          subtitle={
            isAddingStudents
              ? INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.MODALS.GROUP_ACTION.STUDENT_LABEL
              : isEdit
                ? CREATE.SUBTITLE_EDIT
                : CREATE.SUBTITLE
          }
        />

        {(() => {
          const selectedInfo = combinedStudentList.filter((s) =>
            selectedStudentIds?.includes(s.studentId || s.StudentId || s.id || s.applicationId)
          );
          const uniqueTerms = new Set(selectedInfo.map((s) => s.termId).filter(Boolean));
          const hasTermConflict = uniqueTerms.size > 1;

          return (
            hasTermConflict && (
              <div className="mx-6 mt-4 mb-2 rounded-xl bg-danger/5 border border-danger/20 p-3 flex items-start gap-3 animate-in shake duration-500">
                <InfoCircleOutlined className="text-danger text-base mt-0.5" />
                <div className="flex flex-col gap-1">
                  <Text className="text-danger text-xs font-bold uppercase tracking-wider">
                    Conflict detected
                  </Text>
                  <Text className="text-danger/80 text-[11px] leading-relaxed">
                    {CREATE.MULTI_TERM_ERROR}
                  </Text>
                </div>
              </div>
            )
          );
        })()}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="px-6 py-4"
          requiredMark={false}
        >
          <div className="grid grid-cols-2 gap-4 mb-3">
            <Form.Item
              label={
                <span className="text-text text-[11px] font-bold tracking-wider uppercase">
                  {CREATE.NAME_LABEL}
                </span>
              }
              name="groupName"
              rules={[{ required: true, message: CREATE.NAME_REQUIRED }]}
              className="mb-0"
            >
              <Input
                prefix={<EditOutlined className="text-muted" />}
                placeholder={CREATE.NAME_PLACEHOLDER}
                className="bg-surface border-border h-10 rounded-xl hover:border-primary focus:border-primary transition-all shadow-sm"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-text text-[11px] font-bold tracking-wider uppercase">
                  {CREATE.MENTOR_LABEL}
                </span>
              }
              name="mentorId"
              className="mb-0"
            >
              <Select
                allowClear
                showSearch
                placeholder={CREATE.MENTOR_PLACEHOLDER}
                className="h-10 w-full rounded-xl"
                loading={loadingMentors}
                options={mentorOptions}
                optionFilterProp="searchValue"
                suffixIcon={<UserOutlined className="text-muted" />}
              />
            </Form.Item>
          </div>

          {!isEdit &&
            groupNameValue &&
            existingGroups.some(
              (g) => g.name?.toLowerCase() === groupNameValue.trim().toLowerCase()
            ) && (
              <div className="mb-3 text-[11px] font-medium text-amber-600 flex items-center gap-1.5 px-1 animate-in fade-in slide-in-from-top-1">
                <InfoCircleOutlined className="text-[12px]" />
                {CREATE.DUPLICATE_NAME_WARNING}
              </div>
            )}

          <Form.Item
            label={
              <span className="text-text text-[11px] font-bold tracking-wider uppercase">
                {CREATE.DESCRIPTION_LABEL}
              </span>
            }
            name="description"
            className="mb-3"
          >
            <Input.TextArea
              placeholder={CREATE.DESCRIPTION_PLACEHOLDER}
              className="bg-surface border-border rounded-xl hover:border-primary focus:border-primary transition-all shadow-sm py-2"
              autoSize={{ minRows: 1, maxRows: 2 }}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <Form.Item
              label={
                <span className="text-text text-[11px] font-bold tracking-wider uppercase">
                  {CREATE.START_DATE_LABEL}
                </span>
              }
              name="startDate"
              rules={[{ required: true, message: 'Select start date' }]}
              className="mb-0"
            >
              <DatePicker
                className="h-10 w-full rounded-xl bg-surface border-border shadow-sm text-xs"
                disabled={isEdit}
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-text text-[11px] font-bold tracking-wider uppercase">
                  {CREATE.END_DATE_LABEL}
                </span>
              }
              name="endDate"
              rules={[{ required: true, message: 'Select end date' }]}
              className="mb-0"
            >
              <DatePicker
                className="h-10 w-full rounded-xl bg-surface border-border shadow-sm text-xs"
                disabled={isEdit}
              />
            </Form.Item>
          </div>

          <Form.Item
            label={
              <span className="text-text text-[11px] font-bold tracking-wider uppercase">
                {CREATE.STUDENTS_LABEL}
              </span>
            }
            name="studentIds"
            rules={[{ required: true, message: CREATE.STUDENTS_REQUIRED }]}
            className="mb-3"
          >
            <Select
              mode="multiple"
              placeholder={CREATE.STUDENTS_PLACEHOLDER}
              className="min-h-10 w-full rounded-xl"
              loading={loadingStudents}
              options={studentOptions}
              optionFilterProp="searchValue"
              maxTagCount="responsive"
              disabled={initialStudents.length > 0 && !isEdit}
              suffixIcon={<TeamOutlined className="text-muted" />}
            />
          </Form.Item>

          {students.length === 0 && !loadingStudents && !isEdit && (
            <div className="mb-4 rounded-xl bg-orange-50/50 p-4 border border-orange-100 flex items-center gap-3">
              <InfoCircleOutlined className="text-orange-400 text-lg" />
              <Text className="text-orange-700 text-[13px] leading-relaxed">
                {INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.FILTERS.EMPTY_TEXT ||
                  'No students are currently available.'}
              </Text>
            </div>
          )}

          <CompoundModal.Footer
            cancelText={CREATE.CANCEL}
            confirmText={isEdit ? CREATE.SUBMIT_EDIT : CREATE.SUBMIT}
            onCancel={handleCancel}
            onConfirm={() => form.submit()}
            confirmDisabled={
              (students.length === 0 && !isEdit) ||
              (() => {
                const selectedInfo = initialStudents
                  .concat(students)
                  .filter((s) =>
                    selectedStudentIds?.includes(
                      s.studentId || s.StudentId || s.id || s.applicationId
                    )
                  );
                const uniqueTerms = new Set(selectedInfo.map((s) => s.termId).filter(Boolean));
                return uniqueTerms.size > 1;
              })()
            }
          />
        </Form>
      </CompoundModal>
    );
  }
);
CreateGroupModal.displayName = 'CreateGroupModal';

export default CreateGroupModal;
