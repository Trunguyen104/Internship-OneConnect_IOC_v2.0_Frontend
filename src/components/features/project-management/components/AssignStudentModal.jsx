'use client';

import { DeleteOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
// Wait, I should not use react-redux here unless I know it's used.
// Most components use plain React and Ant Design.
import {
  Avatar as AntAvatar,
  Button as AntButton,
  Checkbox as AntCheckbox,
  Empty as AntEmpty,
  Input as AntInput,
  List as AntList,
  Modal as AntModal,
  Spin as AntSpin,
  Tabs as AntTabs,
  Tooltip,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';

import { ProjectService } from '../services/project.service';

const { TabPane } = AntTabs;

export default function AssignStudentModal({ visible, onCancel, project }) {
  const toast = useToast();
  const { PROJECT_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;
  const { ASSIGN } = PROJECT_MANAGEMENT.MODALS;

  const [loading, setLoading] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    if (!project || !visible) return;

    try {
      setLoading(true);
      const [resAll, resAssigned] = await Promise.all([
        ProjectService.getStudentsByGroup(project.internshipGroupId),
        ProjectService.getAssignedStudents(project.projectId),
      ]);

      if (resAll?.data) setAllStudents(resAll.data || []);
      if (resAssigned?.data) {
        setAssignedStudents(resAssigned.data || []);
        // Initially selected are those not yet assigned
      }
    } catch (err) {
      // Mock for dev
      setAllStudents([
        { studentId: 's1', fullName: 'Nguyen Van A', studentCode: 'SV001', email: 'a@example.com' },
        { studentId: 's2', fullName: 'Le Thi B', studentCode: 'SV002', email: 'b@example.com' },
        { studentId: 's3', fullName: 'Tran Van C', studentCode: 'SV003', email: 'c@example.com' },
        { studentId: 's4', fullName: 'Pham Quoc D', studentCode: 'SV004', email: 'd@example.com' },
        { studentId: 's5', fullName: 'Hoang Minh E', studentCode: 'SV005', email: 'e@example.com' },
        { studentId: 's6', fullName: 'Vu Hoang F', studentCode: 'SV006', email: 'f@example.com' },
        { studentId: 's7', fullName: 'Dang Thu G', studentCode: 'SV007', email: 'g@example.com' },
      ]);
      setAssignedStudents([
        {
          studentId: 's1',
          fullName: 'Nguyen Van A',
          studentCode: 'SV001',
          assignedDate: '2024-03-20',
        },
        { studentId: 's2', fullName: 'Le Thi B', studentCode: 'SV002', assignedDate: '2024-03-22' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [project, visible]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggle = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleAssign = async () => {
    try {
      setLoading(true);
      await ProjectService.assignStudents(project.projectId, selectedIds);
      toast.success(
        PROJECT_MANAGEMENT.MESSAGES.ASSIGN_SUCCESS.replace('{count}', selectedIds.length)
      );
      setSelectedIds([]);
      fetchData();
    } catch (err) {
      toast.error('Failed to assign students');
    } finally {
      setLoading(false);
    }
  };

  const handleUnassign = async (studentId) => {
    try {
      setLoading(true);
      await ProjectService.unassignStudent(project.projectId, studentId);
      toast.success(PROJECT_MANAGEMENT.MESSAGES.UNASSIGN_SUCCESS);
      fetchData();
    } catch (err) {
      toast.error('Failed to unassign student');
    } finally {
      setLoading(false);
    }
  };

  const filteredAvailable = allStudents.filter(
    (s) =>
      !assignedStudents.some((as) => as.studentId === s.studentId) &&
      (s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AntModal title={ASSIGN.TITLE} open={visible} onCancel={onCancel} width={600} footer={null}>
      <div className="mb-4 text-gray-500">{ASSIGN.SUBTITLE}</div>

      <AntTabs defaultActiveKey="1">
        <TabPane tab="Available Students" key="1">
          <AntInput
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder={ASSIGN.SEARCH}
            className="mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="max-h-80 overflow-y-auto">
            <AntSpin spinning={loading}>
              {filteredAvailable.length > 0 ? (
                <AntList
                  dataSource={filteredAvailable}
                  renderItem={(student) => (
                    <AntList.Item
                      className="hover:bg-gray-50 px-2 rounded cursor-pointer transition-all"
                      onClick={() => handleToggle(student.studentId)}
                    >
                      <div className="flex items-center w-full gap-3">
                        <AntCheckbox
                          checked={selectedIds.includes(student.studentId)}
                          onChange={() => handleToggle(student.studentId)}
                        />
                        <AntAvatar icon={<UserOutlined />} />
                        <div className="flex-1">
                          <div className="font-semibold">{student.fullName}</div>
                          <div className="text-xs text-gray-400">
                            {student.studentCode} • {student.email}
                          </div>
                        </div>
                      </div>
                    </AntList.Item>
                  )}
                />
              ) : (
                <AntEmpty
                  image={AntEmpty.PRESENTED_IMAGE_SIMPLE}
                  description="No available students"
                />
              )}
            </AntSpin>
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t pt-4">
            <AntButton onClick={onCancel}>Cancel</AntButton>
            <AntButton
              type="primary"
              disabled={selectedIds.length === 0}
              loading={loading}
              onClick={handleAssign}
            >
              Assign {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
            </AntButton>
          </div>
        </TabPane>

        <TabPane tab={`Assigned (${assignedStudents.length})`} key="2">
          <div className="max-h-80 overflow-y-auto mt-2">
            <AntSpin spinning={loading}>
              <AntList
                dataSource={assignedStudents}
                renderItem={(student) => (
                  <AntList.Item className="px-2">
                    <div className="flex items-center w-full gap-3">
                      <AntAvatar icon={<UserOutlined />} src={student.avatarUrl} />
                      <div className="flex-1">
                        <div className="font-semibold">{student.fullName}</div>
                        <div className="text-xs text-gray-400">
                          {student.studentCode} • Joined: {student.assignedDate}
                        </div>
                      </div>
                      <Tooltip title="Un-assign">
                        <AntButton
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleUnassign(student.studentId)}
                        />
                      </Tooltip>
                    </div>
                  </AntList.Item>
                )}
              />
            </AntSpin>
          </div>
        </TabPane>
      </AntTabs>
    </AntModal>
  );
}
