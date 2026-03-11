import { STUDENT_STATUS_MAP } from '../constants/statusMap';

export default function StudentStatusTag({ status }) {
  const s = STUDENT_STATUS_MAP[status] || {
    label: 'Unknown',
    style: 'bg-gray-100 text-gray-600',
    dot: 'bg-gray-400',
  };

  return (
    <div className='flex items-center gap-2'>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      <span className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${s.style}`}>{s.label}</span>
    </div>
  );
}
