import {
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, DatePicker, Form, Input, Select, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { memo, useEffect } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { UI_TEXT } from '@/lib/UI_Text';

import { ENTERPRISE_GROUP_UI } from '../constants/enterprise-group.constants';

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
    const GROUP_CREATE = ENTERPRISE_GROUP_UI.MODALS.CREATE;
    const isEdit = !!group;
    const groupNameValue = Form.useWatch('groupName', form);
    const selectedStudentIds = Form.useWatch('studentIds', form);
    const [studentSearch, setStudentSearch] = React.useState('');

    useEffect(() => {
      if (open) {
        if (!isEdit) {
          form.resetFields();
          const ids = initialStudents.map((s) => String(s.studentId || s.id || s.applicationId));
          const nextNumber = (existingGroups?.length || 0) + 1;
          const defaultName = `${CREATE.DEFAULT_NAME_PREFIX}${String(nextNumber).padStart(2, '0')}`;

          form.setFieldsValue({
            groupName: defaultName,
            studentIds: ids,
            startDate: undefined,
            endDate: undefined,
          });
        } else if (group) {
          form.setFieldsValue({
            groupName: group.name,
            description: group.description || '',
            mentorId: group.mentorId ? String(group.mentorId) : undefined,
            // studentIds is not needed for Edit mode anymore as we hide the field,
            // but we still set it for consistency if needed by handleUpdateGroup
            studentIds: (group.members || []).map((s) =>
              String(s.studentId || s.id || s.applicationId || s.StudentId)
            ),
            startDate: group.startDate ? dayjs(group.startDate) : undefined,
            endDate: group.endDate ? dayjs(group.endDate) : undefined,
          });
        }
      }
    }, [open, isEdit, form, group]); // Only re-run when modal opens or edit mode changes

    const handleCancel = () => {
      onCancel();
    };

    const handleFinish = (values) => {
      const studentIds = values.studentIds || [];
      const firstId = studentIds[0];
      const studentWithPhase = combinedStudentList.find((s) => {
        const sid = String(s.studentId || s.id || s.applicationId || s.StudentId);
        return sid === String(firstId);
      });

      const phaseId =
        values.phaseId ||
        studentWithPhase?.phaseId ||
        studentWithPhase?.termId ||
        studentWithPhase?.internshipPhaseId;

      const payload = {
        ...values,
        phaseId,
        termId: phaseId,
        students: !isEdit
          ? studentIds.map((id) => {
              const studentObj = combinedStudentList.find(
                (s) => String(s.id || s.studentId || s.applicationId) === String(id)
              );
              const roleValue = studentObj?.role || studentObj?.Role || 1;
              const roleInt = roleValue === 'Leader' || roleValue === 2 ? 2 : 1;
              return { studentId: id, role: roleInt };
            })
          : undefined, // Don't sync students if field is hidden in Edit mode
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
      };

      if (!isAddingStudents) {
        delete payload.studentIds;
      }

      onFinish(payload);
      form.resetFields();
    };

    const mentorOptions = mentors.map((m) => {
      const name = m.fullName || m.name || CREATE.UNKNOWN_MENTOR;
      const sub = m.department || m.email || CREATE.MENTOR_LABEL;
      return {
        label: name, // Compact for selected view
        value: String(m.userId || m.mentorId || m.id || ''),
        searchValue: `${name} ${m.email || ''} ${m.department || ''}`,
        display: (
          <div className="flex items-center gap-2 py-1">
            <Avatar size="small" src={m.avatar} icon={<UserOutlined />} />
            <div className="flex flex-col leading-tight grow">
              <Text className="text-xs font-bold">{name}</Text>
              <Text className="text-muted text-[10px] opacity-60 italic">{sub}</Text>
            </div>
          </div>
        ),
      };
    });

    // CRITICAL: Ensure initialStudents (Flow 2) are included in the available options
    const combinedStudentList = [...students];
    initialStudents.forEach((s) => {
      const id = s.id || s.studentId || s.applicationId;
      if (
        !combinedStudentList.find(
          (item) => (item.id || item.studentId || item.applicationId) === id
        )
      ) {
        combinedStudentList.push(s);
      }
    });

    if (isEdit && group?.members) {
      group.members.forEach((m) => {
        // Use mapApplication to standardize member object
        const mapped = EnterpriseStudentService.mapApplication(m);
        const id = mapped.studentId || mapped.id;
        if (
          !combinedStudentList.find(
            (s) => String(s.id || s.studentId || s.applicationId) === String(id)
          )
        ) {
          combinedStudentList.push(mapped);
        }
      });
    }

    const studentOptions = combinedStudentList.map((s) => {
      const isAssigned = s.isAssignedToGroup || !!s.assignedGroupId || !!s.groupId;
      const fullName = s.studentFullName || s.fullName || s.name || CREATE.UNKNOWN_STUDENT;
      const code = s.studentCode || s.code || CREATE.NO_CODE;

      return {
        label: `${fullName} (${code})`, // Selected tag format
        value: String(s.studentId || s.id || s.applicationId),
        disabled: isAssigned && !isEdit,
        searchValue: `${fullName} ${code} ${s.name || ''} ${s.email || ''}`,
        display: (
          <div className="flex items-center gap-2 py-1">
            <Avatar size="small" src={s.avatar} icon={<UserOutlined />} />
            <div className="flex flex-col leading-tight grow">
              <div className="flex items-center justify-between font-bold">
                <Text className={`text-xs ${isAssigned ? 'text-muted opacity-60' : ''}`}>
                  {fullName}
                </Text>
                {isAssigned && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-danger/10 text-danger font-bold uppercase tracking-tighter">
                    {CREATE.IN_GROUP} {s.assignedGroupName || s.groupName || CREATE.ACTIVE_LABEL}
                  </span>
                )}
              </div>
              <Text className="text-muted text-[10px] uppercase opacity-60">
                {code} {CREATE.BULLET} {s.major || CREATE.NO_MAJOR}
              </Text>
            </div>
          </div>
        ),
      };
    });

    return (
      <CompoundModal
        open={open}
        onCancel={handleCancel}
        width={500}
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
          const uniquePhases = new Set(
            selectedInfo.map((s) => s.phaseId || s.termId).filter(Boolean)
          );
          const hasPhaseConflict = uniquePhases.size > 1;

          return (
            hasPhaseConflict && (
              <div className="mx-6 mt-4 mb-2 rounded-xl bg-danger/5 border border-danger/20 p-3 flex items-start gap-3 animate-in shake duration-500">
                <InfoCircleOutlined className="text-danger text-base mt-0.5" />
                <div className="flex flex-col gap-1">
                  <Text className="text-danger text-xs font-bold uppercase tracking-wider">
                    {CREATE.CONFLICT_DETECTED}
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
          className="px-5 py-3"
          requiredMark={false}
        >
          {isAddingStudents && group && (
            <div className="mb-4 bg-primary-surface border border-primary/10 rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Text className="text-muted/60 text-[9px] font-bold uppercase tracking-widest leading-none">
                  {GROUP_CREATE.TARGET_GROUP_LABEL}
                </Text>
                <Text className="text-primary text-sm font-black tracking-tight leading-tight">
                  {group.groupName || group.name}
                </Text>
              </div>
              <div className="bg-success-surface px-2 py-1 rounded-lg text-success text-[10px] font-bold uppercase tracking-tighter shadow-sm">
                {GROUP_CREATE.ACTIVE_GROUP_LABEL}
              </div>
            </div>
          )}
          {!isAddingStudents && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-2">
                <Form.Item
                  label={
                    <span className="text-muted/60 text-[10px] font-bold tracking-widest uppercase ml-1">
                      {CREATE.NAME_LABEL}
                    </span>
                  }
                  name="groupName"
                  rules={[{ required: true, message: CREATE.NAME_REQUIRED }]}
                  className="mb-0"
                >
                  <Input
                    prefix={<EditOutlined className="text-muted/40 text-[10px]" />}
                    placeholder={CREATE.NAME_PLACEHOLDER}
                    className="bg-slate-50/50 border-slate-100 h-9 rounded-lg hover:border-primary/50 focus:border-primary/50 transition-all text-xs font-semibold"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-muted/60 text-[10px] font-bold tracking-widest uppercase ml-2">
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
                    className="h-9 w-full rounded-lg bg-slate-50/50"
                    loading={loadingMentors}
                    options={mentorOptions}
                    optionLabelProp="label"
                    optionRender={(option) => option.data.display}
                    optionFilterProp="searchValue"
                    suffixIcon={<UserOutlined className="text-muted/40 text-[10px]" />}
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={
                  <span className="text-muted/60 text-[10px] font-bold tracking-widest uppercase ml-1">
                    {CREATE.DESCRIPTION_LABEL}
                  </span>
                }
                name="description"
                className="mb-2"
              >
                <Input.TextArea
                  placeholder={CREATE.DESCRIPTION_PLACEHOLDER}
                  className="bg-slate-50/50 border-slate-100 rounded-lg hover:border-primary/50 focus:border-primary/50 transition-all py-1.5 text-xs font-semibold"
                  autoSize={{ minRows: 1, maxRows: 2 }}
                />
              </Form.Item>

              <div className="grid grid-cols-2 gap-3 mb-2">
                <Form.Item
                  label={
                    <span className="text-muted/60 text-[10px] font-bold tracking-widest uppercase ml-1">
                      {CREATE.START_DATE_LABEL}
                    </span>
                  }
                  name="startDate"
                  rules={[{ required: true, message: CREATE.START_DATE_REQUIRED }]}
                  className="mb-0"
                >
                  <DatePicker className="h-9 w-full rounded-lg bg-slate-50/50 border-slate-100 text-xs font-semibold" />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-muted/60 text-[10px] font-bold tracking-widest uppercase ml-1">
                      {CREATE.END_DATE_LABEL}
                    </span>
                  }
                  name="endDate"
                  rules={[{ required: true, message: CREATE.END_DATE_REQUIRED }]}
                  className="mb-0"
                >
                  <DatePicker className="h-9 w-full rounded-lg bg-slate-50/50 border-slate-100 text-xs font-semibold" />
                </Form.Item>
              </div>
            </>
          )}

          {(isAddingStudents || !isEdit) && (
            <Form.Item
              label={
                <span className="text-muted/60 text-[10px] font-bold tracking-widest uppercase ml-1">
                  {CREATE.STUDENTS_LABEL}
                </span>
              }
              name="studentIds"
              rules={[{ required: true, message: CREATE.STUDENTS_REQUIRED }]}
              className="mb-3"
            >
              {isAddingStudents ? (
                <div className="flex flex-col gap-3">
                  <Input
                    prefix={<SearchOutlined className="text-muted/40 text-[11px]" />}
                    placeholder="Search by name or code..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="h-9 rounded-lg border-slate-100 bg-slate-50/50 text-xs font-semibold"
                  />
                  <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar border border-slate-100 rounded-xl p-2 bg-slate-50/30">
                    {combinedStudentList
                      .filter((s) => {
                        const isAssigned =
                          s.isAssignedToGroup || !!s.assignedGroupId || !!s.groupId;
                        if (isAssigned) return false;

                        // Phase match constraint: ensure students belong to the same phase as the group
                        const groupPhaseId =
                          group?.phaseId || group?.termId || group?.internshipPhaseId;
                        const studentPid = s.phaseId || s.termId || s.internshipPhaseId;
                        if (
                          groupPhaseId &&
                          studentPid &&
                          String(groupPhaseId) !== String(studentPid)
                        ) {
                          return false;
                        }

                        const name = (
                          s.studentFullName ||
                          s.fullName ||
                          s.name ||
                          ''
                        ).toLowerCase();
                        const code = (s.studentCode || s.code || '').toLowerCase();
                        const search = studentSearch.toLowerCase();
                        return name.includes(search) || code.includes(search);
                      })
                      .map((s) => {
                        const id = String(s.studentId || s.id || s.applicationId);
                        const isSelected = selectedStudentIds?.includes(id);
                        const fullName =
                          s.studentFullName || s.fullName || s.name || CREATE.UNKNOWN_STUDENT;
                        const code = s.studentCode || s.code || CREATE.NO_CODE;

                        return (
                          <div
                            key={id}
                            onClick={() => {
                              const current = selectedStudentIds || [];
                              const next = isSelected
                                ? current.filter((cid) => cid !== id)
                                : [...current, id];
                              form.setFieldsValue({ studentIds: next });
                            }}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-primary/5 border-primary/20 shadow-sm'
                                : 'bg-white border-slate-100 hover:border-primary/30 hover:bg-slate-50'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-primary border-primary'
                                  : 'bg-white border-slate-300'
                              }`}
                            >
                              {isSelected && (
                                <span className="text-white text-[10px] font-black italic">
                                  {UI_TEXT.COMMON.CHECKMARK}
                                </span>
                              )}
                            </div>

                            <Avatar size="small" src={s.avatar} icon={<UserOutlined />} />

                            <div className="flex flex-col leading-tight grow overflow-hidden">
                              <Text
                                className={`text-xs font-bold truncate ${isSelected ? 'text-primary' : 'text-text'}`}
                              >
                                {fullName}
                              </Text>
                              <Text className="text-muted text-[9px] uppercase font-medium opacity-60">
                                {code} {UI_TEXT.COMMON.BULLET} {s.major || CREATE.NO_MAJOR}
                              </Text>
                            </div>
                          </div>
                        );
                      })}
                    {combinedStudentList.filter(
                      (s) => !(s.isAssignedToGroup || !!s.assignedGroupId || !!s.groupId)
                    ).length === 0 && (
                      <div className="py-8 text-center flex flex-col items-center gap-2">
                        <TeamOutlined className="text-muted/20 text-3xl" />
                        <Text className="text-muted/60 text-xs italic">
                          {CREATE.EMPTY_STUDENTS}
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Select
                  mode="multiple"
                  placeholder={CREATE.STUDENTS_PLACEHOLDER}
                  className="min-h-9 w-full rounded-lg bg-slate-50/50 overflow-hidden"
                  loading={loadingStudents}
                  options={studentOptions}
                  optionLabelProp="label"
                  optionRender={(option) => option.data.display}
                  optionFilterProp="searchValue"
                  maxTagCount="responsive"
                  disabled={initialStudents.length > 0 && !isEdit}
                  suffixIcon={<TeamOutlined className="text-muted/40 text-[10px]" />}
                />
              )}
            </Form.Item>
          )}

          {students.length === 0 && !loadingStudents && !isEdit && (
            <div className="mb-4 rounded-xl bg-warning-surface p-4 border border-warning/20 flex items-center gap-3">
              <InfoCircleOutlined className="text-warning text-lg" />
              <Text className="text-warning-text text-[13px] leading-relaxed">
                {CREATE.EMPTY_STUDENTS}
              </Text>
            </div>
          )}

          <CompoundModal.Footer
            cancelText={CREATE.CANCEL}
            confirmText={
              isAddingStudents
                ? GROUP_CREATE.SUBMIT_ADD
                : isEdit
                  ? CREATE.SUBMIT_EDIT
                  : CREATE.SUBMIT
            }
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
                const uniquePhases = new Set(
                  selectedInfo.map((s) => s.phaseId || s.termId).filter(Boolean)
                );
                return uniquePhases.size > 1;
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
