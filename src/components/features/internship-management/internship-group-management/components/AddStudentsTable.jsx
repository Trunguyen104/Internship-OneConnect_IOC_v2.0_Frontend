import { SearchOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Input, Typography } from 'antd';
import React from 'react';

import { STUDENT_ACTIVITY_UI } from '@/constants/student-activity/student-activity';

const { Text } = Typography;

export const AddStudentsTable = ({
  students,
  value,
  onChange,
  selectedIds,
  onSelect,
  searchQuery,
  onSearchChange,
  groupPhaseId,
  UI_TEXT,
  CREATE,
}) => {
  const [localSelected, setLocalSelected] = React.useState(value || selectedIds || []);

  // Sync with external value if it changes
  React.useEffect(() => {
    if (value !== undefined) {
      setLocalSelected(value || []);
    } else if (selectedIds !== undefined) {
      setLocalSelected(selectedIds || []);
    }
  }, [value, selectedIds]);

  const handleSelectToggle = (id) => {
    const next = localSelected.includes(id)
      ? localSelected.filter((cid) => cid !== id)
      : [...localSelected, id];

    // Instant UI update
    setLocalSelected(next);

    // Sync upwards to AntD Form
    if (onChange) {
      onChange(next);
    }
    if (onSelect) {
      onSelect(id);
    }
  };

  const filteredStudents = students.filter((s) => {
    // 1. Availability check
    const isAssigned = s.isAssignedToGroup || !!s.assignedGroupId || !!s.groupId;
    if (isAssigned) return false;

    // 2. Phase match constraint
    const studentPid = s.phaseId || s.termId || s.internshipPhaseId;
    if (groupPhaseId && studentPid && String(groupPhaseId) !== String(studentPid)) {
      return false;
    }

    // 3. Search filter
    const name = (s.studentFullName || s.fullName || s.name || '').toLowerCase();
    const code = (s.studentCode || s.code || '').toLowerCase();
    const search = searchQuery.toLowerCase();
    return name.includes(search) || code.includes(search);
  });

  return (
    <div className="flex flex-col gap-3">
      <Input
        prefix={<SearchOutlined className="text-muted/40 text-[11px]" />}
        placeholder="Search by name or code..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="h-9 rounded-lg border-slate-100 bg-slate-50/50 text-xs font-semibold"
      />
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar border border-slate-100 rounded-xl p-2 bg-slate-50/30">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((s) => {
            const id = String(s.studentId || s.id || s.applicationId);
            const isSelected = localSelected.includes(id);
            const fullName = s.studentFullName || s.fullName || s.name || CREATE.UNKNOWN_STUDENT;
            const code = s.studentCode || s.code || CREATE.NO_CODE;

            return (
              <div
                key={id}
                onClick={() => handleSelectToggle(id)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
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
                      {code} {UI_TEXT.COMMON.BULLET} {s.major || CREATE.NO_MAJOR}
                    </Text>
                  </div>
                </div>

                {isSelected && (
                  <div className="text-primary text-[10px] lowercase font-black italic bg-primary/10 px-2 py-0.5 rounded-full">
                    {STUDENT_ACTIVITY_UI.LIST_COLUMNS.SELECTED}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center flex flex-col items-center gap-2">
            <TeamOutlined className="text-muted/20 text-3xl" />
            <Text className="text-muted/60 text-xs italic">{CREATE.EMPTY_STUDENTS}</Text>
          </div>
        )}
      </div>
    </div>
  );
};
