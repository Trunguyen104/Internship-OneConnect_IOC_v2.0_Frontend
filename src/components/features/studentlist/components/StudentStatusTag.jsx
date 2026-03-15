import { STUDENT_STATUS_MAP } from '../constants/statusMap';
import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';

export default function StudentStatusTag({ status }) {
  const s = STUDENT_STATUS_MAP[status] || {
    label: STUDENT_LIST_UI.STATUS.UNKNOWN,
    style: 'bg-muted/10 text-muted',
    dot: 'bg-muted/50',
  };

  return (
    <div className='flex w-fit items-center gap-2 whitespace-nowrap'>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      <span className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${s.style}`}>{s.label}</span>
    </div>
  );
}
