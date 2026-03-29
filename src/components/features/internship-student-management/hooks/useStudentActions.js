import { useCallback, useState } from 'react';
import { useToast } from '@/providers/ToastProvider';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { EnterpriseGroupService } from '../../internship-group-management/services/enterprise-group.service';
import { EnterpriseStudentService } from '../services/enterprise-student.service';

export const useStudentActions = ({ refetchStudents, phaseId, enterpriseId }) => {
  const toast = useToast();
  const { MESSAGES } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST;

  const [rejectModal, setRejectModal] = useState({ open: false, student: null });
  const [assignModal, setAssignModal] = useState({ open: false, student: null });
  const [groupModal, setGroupModal] = useState({ open: false, students: [], type: 'ADD' });
  const [detailModal, setDetailModal] = useState({ open: false, student: null });
  const [createModal, setCreateModal] = useState({ open: false, students: [] });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);

  const handleViewStudent = useCallback(async (student) => {
    if (!student?.applicationId) {
      setDetailModal({ open: true, student });
      return;
    }

    try {
      setViewLoading(true);
      const res = await EnterpriseStudentService.getApplicationDetail(student.applicationId);
      const fullData = res?.data || res;
      setDetailModal({
        open: true,
        student: {
          ...student,
          ...fullData,
          studentEmail: fullData.email || student.studentEmail,
          phone: fullData.phone || student.phone,
          dob: fullData.dob || student.dob,
        },
      });
    } catch (err) {
      setDetailModal({ open: true, student });
    } finally {
      setViewLoading(false);
    }
  }, []);

  const handleAssignMentor = useCallback(
    async (studentId, values) => {
      try {
        await EnterpriseStudentService.assignMentor(studentId, values);
        setAssignModal({ open: false, student: null });
        toast.success(MESSAGES.ASSIGN_SUCCESS);
        refetchStudents();
      } catch (err) {
        toast.error('Failed to assign mentor');
      }
    },
    [toast, MESSAGES, refetchStudents]
  );

  const handleGroupSubmit = useCallback(
    async (values) => {
      const { students, type } = groupModal;
      if (!students?.length) return;

      try {
        const sourceGroups = students.reduce((acc, s) => {
          const gid = s.groupId || 'NO_GROUP';
          if (!acc[gid]) acc[gid] = [];
          acc[gid].push(s);
          return acc;
        }, {});

        for (const [sourceGroupId, groupStudents] of Object.entries(sourceGroups)) {
          const isNoGroup = sourceGroupId === 'NO_GROUP';
          const personIds = groupStudents.map((s) => s.studentId);

          if (type === 'ADD' || isNoGroup) {
            await EnterpriseGroupService.addStudents(
              values.groupId,
              groupStudents.map((s) => ({
                studentId: s.studentId,
                role: 1,
              }))
            );
          } else {
            if (sourceGroupId === values.groupId) continue;
            await EnterpriseGroupService.moveStudents({
              fromGroupId: sourceGroupId,
              toGroupId: values.groupId,
              studentIds: personIds,
            });

            if (values.mentorId) {
              const assignPromises = personIds.map((stId) =>
                EnterpriseStudentService.assignMentor(stId, {
                  mentorId: values.mentorId,
                })
              );
              await Promise.all(assignPromises);
            }
          }
        }

        toast.success(
          type === 'ADD' ? `Đã thêm ${students.length} sinh viên.` : MESSAGES.GROUP_CHANGE_SUCCESS
        );

        if (type === 'CHANGE') {
          students.forEach((s) => {
            toast.info(
              `Sinh viên ${s.studentFullName} đã được chuyển nhóm. Quyền truy cập dự án cũ đã bị thu hồi và cấp mới cho nhóm mới.`,
              { duration: 5 }
            );
          });
        }
      } catch (err) {
        if (err.status === 400 || err.status === 500) {
          const errorMsg =
            err?.response?.data?.message ||
            err?.message ||
            'Sinh viên đã có nhóm khác hoặc dữ liệu không đồng bộ.';
          toast.warning(errorMsg);
        } else {
          toast.error('Failed to update group');
          throw err;
        }
      } finally {
        setGroupModal({ open: false, students: [], type: 'ADD' });
        refetchStudents();
        window.dispatchEvent(
          new CustomEvent(INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.REFRESH_EVENT)
        );
      }
    },
    [groupModal, toast, MESSAGES, refetchStudents]
  );

  const handleCreateGroup = useCallback(
    async (payload) => {
      const selectedStudents = createModal.students || [];
      const phaseIds = new Set(selectedStudents.map((s) => s.phaseId || s.termId).filter(Boolean));

      if (phaseIds.size > 1) {
        toast.error(
          'Sinh viên được chọn thuộc nhiều giai đoạn khác nhau. Vui lòng chỉ chọn sinh viên trong cùng một giai đoạn.'
        );
        return;
      }

      const firstStudent = selectedStudents[0];
      const targetPhaseId = firstStudent?.phaseId || firstStudent?.termId || phaseId;

      try {
        await EnterpriseGroupService.createGroup({
          ...payload,
          phaseId: targetPhaseId,
          termId: targetPhaseId,
          enterpriseId: enterpriseId,
        });
        toast.success('Group created successfully');
        setCreateModal({ open: false, students: [] });
        refetchStudents();
        window.dispatchEvent(
          new CustomEvent(INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.REFRESH_EVENT)
        );
      } catch (err) {
        const errorMsg = err?.response?.data?.message || err?.message || 'Failed to create group';
        toast.error(errorMsg);
      }
    },
    [phaseId, refetchStudents, toast, createModal.students, enterpriseId]
  );

  return {
    rejectModal,
    setRejectModal,
    assignModal,
    setAssignModal,
    groupModal,
    setGroupModal,
    detailModal,
    setDetailModal,
    createModal,
    setCreateModal,
    selectedRowKeys,
    setSelectedRowKeys,
    viewLoading,
    handleViewStudent,
    handleAssignMentor,
    handleGroupSubmit,
    handleCreateGroup,
  };
};
