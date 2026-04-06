import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space, Typography } from 'antd';
import React from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { STUDENT_ACTIVITY_UI } from '@/constants/student-activity/student-activity';
import { UI_TEXT } from '@/lib/UI_Text';

const { Text } = Typography;

export const AddStudentsTable = ({ students, value, onChange, onSelect, loading = false }) => {
  const selectedIds = new Set((value || []).map((s) => String(s.studentId || s.id)));

  const handleSelect = (student) => {
    const studentId = student.studentId || student.id;
    const isSelected = selectedIds.has(String(studentId));

    let newValue;
    if (isSelected) {
      newValue = (value || []).filter((s) => String(s.studentId || s.id) !== String(studentId));
    } else {
      newValue = [...(value || []), student];
    }

    if (onChange) onChange(newValue);
    if (onSelect) onSelect(student, !isSelected);
  };

  if (!students || students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 opacity-40 grayscale italic text-xs">
        <Space orientation="vertical" align="center" size={4}>
          <UserOutlined className="text-2xl" />
          <Text className="text-[10px]">{UI_TEXT.USER_MANAGEMENT.NO_DATA}</Text>
        </Space>
      </div>
    );
  }

  const { NO_MAJOR, PHASE_PREFIX } = INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.MODALS.CREATE;

  return (
    <div className="grid grid-cols-1 gap-2 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
      {students.map((s) => {
        const studentId = s.studentId || s.id;
        const isSelected = selectedIds.has(String(studentId));
        const fullName = s.fullName || s.name || 'Unknown Student';
        const code = s.userCode || s.code || 'N/A';

        return (
          <div
            key={String(studentId)}
            onClick={() => handleSelect(s)}
            className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer select-none ${
              isSelected
                ? 'bg-primary/5 border-primary/40 shadow-sm'
                : 'bg-white border-slate-100 hover:border-primary/30 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <Avatar size="small" src={s.avatar} icon={<UserOutlined />} />

              <div className="flex flex-col leading-tight grow overflow-hidden">
                <Text
                  className={`text-xs font-bold truncate ${isSelected ? 'text-primary' : 'text-text'}`}
                >
                  {fullName}
                </Text>
                <Text className="text-muted text-[9px] uppercase font-medium opacity-60">
                  {code} {UI_TEXT.COMMON.BULLET} {s.major || NO_MAJOR}
                </Text>
                {(s.phaseName || s.termName) && (
                  <Text className="text-primary text-[8px] font-bold opacity-70 italic">
                    {PHASE_PREFIX} {s.phaseName || s.termName}
                    {s.phaseStatus ? ` (${s.phaseStatus})` : ''}
                  </Text>
                )}
              </div>
            </div>

            {isSelected && (
              <div className="text-primary text-[10px] lowercase font-black italic bg-primary/10 px-2 py-0.5 rounded-full">
                {STUDENT_ACTIVITY_UI.LIST_COLUMNS.SELECTED}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
