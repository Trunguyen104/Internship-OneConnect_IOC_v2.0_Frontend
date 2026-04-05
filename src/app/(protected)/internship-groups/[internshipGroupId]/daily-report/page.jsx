import LogbookPage from '@/components/features/logbook/components/LogbookPage';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Logbook | IOCv2',
  description: 'Manage and submit your daily internship logbook.',
};

export default function Page() {
  return <LogbookPage />;
}
