import { UI_TEXT } from '@/lib/UI_Text';

export default function EnterpriseDashboard() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">
        {UI_TEXT.ENTERPRISE.DASHBOARD_TITLE}
      </h1>
      <p className="text-gray-600">{UI_TEXT.ENTERPRISE.DASHBOARD_WELCOME}</p>
    </div>
  );
}
