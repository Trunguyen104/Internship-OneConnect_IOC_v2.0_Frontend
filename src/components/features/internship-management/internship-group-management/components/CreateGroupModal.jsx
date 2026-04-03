import { InfoCircleOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Form, Select, Typography } from 'antd';
import React, { memo, useEffect } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { UI_TEXT } from '@/lib/UI_Text';

import { EnterpriseStudentService } from '../../../internship-student-management/services/enterprise-student.service';
import { AddStudentsTable } from './AddStudentsTable';
import { GroupFormFields } from './GroupFormFields';

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
    const { GROUP_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI;
    const { MODALS } = GROUP_MANAGEMENT;
    const { CREATE } = MODALS;

    const isEdit = !!group;
    const selectedStudentIds = Form.useWatch('studentIds', form);
    const [studentSearch, setStudentSearch] = React.useState('');

    // Prevent infinite resets by stringifying initialStudents map and group map
    const initialStudentsStr = React.useMemo(
      () => JSON.stringify(initialStudents.map((s) => s.id || s.studentId)),
      [initialStudents]
    );
    const groupMembersStr = React.useMemo(
      () => (group ? JSON.stringify(group.members) : ''),
      [group]
    );
    const groupId = group?.id;

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
          });
        } else if (group) {
          form.setFieldsValue({
            groupName: group.name,
            description: group.description || '',
            mentorId: group.mentorId ? String(group.mentorId) : undefined,
            studentIds: (group.members || []).map((s) =>
              String(s.studentId || s.id || s.applicationId || s.StudentId)
            ),
          });
        }
      }
    }, [
      open,
      isEdit,
      form,
      group,
      groupId,
      groupMembersStr,
      CREATE.DEFAULT_NAME_PREFIX,
      initialStudentsStr,
      existingGroups?.length,
    ]);

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
          : undefined,
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
        label: name,
        value: String(m.userId || m.mentorId || m.id || ''),
        searchValue: `${name} ${m.email || ''} ${m.department || ''}`,
        display: (
          <div className="flex items-center gap-2 py-1">
            <Avatar size="small" src={m.avatar} icon={<UserOutlined />} />
            <div className="flex flex-col leading-tight grow">
              <span className="text-xs font-bold">{name}</span>
              <span className="text-muted text-[10px] opacity-60 italic">{sub}</span>
            </div>
          </div>
        ),
      };
    });

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
        label: `${fullName} (${code})`,
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
                    {CREATE.IN_GROUP || 'In Group'} {s.assignedGroupName || s.groupName || 'Active'}
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
              ? GROUP_MANAGEMENT.ACTIONS.ADD_TO_GROUP
              : isEdit
                ? CREATE.TITLE_EDIT
                : CREATE.TITLE
          }
          subtitle={
            isAddingStudents
              ? CREATE.SUBTITLE_EDIT
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
                <span className="text-muted/60 text-[9px] font-bold uppercase tracking-widest leading-none">
                  {GROUP_MANAGEMENT.MODALS.VIEW.TARGET_GROUP_LABEL || 'Target Group'}
                </span>
                <span className="text-primary text-sm font-black tracking-tight leading-tight">
                  {group.groupName || group.name}
                </span>
              </div>
              <div className="bg-success-surface px-2 py-1 rounded-lg text-success text-[10px] font-bold uppercase tracking-tighter shadow-sm">
                {GROUP_MANAGEMENT.MODALS.VIEW.ACTIVE_GROUP_LABEL || 'Active'}
              </div>
            </div>
          )}

          {!isAddingStudents && (
            <GroupFormFields
              CREATE={CREATE}
              mentorOptions={mentorOptions}
              loadingMentors={loadingMentors}
            />
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
                <AddStudentsTable
                  students={combinedStudentList}
                  value={selectedStudentIds}
                  onChange={(nextIds) => form.setFieldsValue({ studentIds: nextIds })}
                  searchQuery={studentSearch}
                  onSearchChange={setStudentSearch}
                  groupPhaseId={group?.phaseId || group?.termId}
                  UI_TEXT={UI_TEXT}
                  CREATE={CREATE}
                />
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
              <span className="text-warning-text text-[13px] leading-relaxed">
                {CREATE.EMPTY_STUDENTS}
              </span>
            </div>
          )}

          <CompoundModal.Footer
            cancelText={CREATE.CANCEL}
            confirmText={
              isAddingStudents ? CREATE.SUBMIT_ADD : isEdit ? CREATE.SUBMIT_EDIT : CREATE.SUBMIT
            }
            onCancel={handleCancel}
            onConfirm={() => form.submit()}
            confirmDisabled={
              (students.length === 0 && !isEdit) ||
              (() => {
                const selectedInfo = combinedStudentList.filter((s) =>
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
