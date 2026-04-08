import StudentActivityList from '@/components/features/internship-student-activity/components/StudentActivityList';

/**
 * Entering /school/terms/[termId] shows the term overview (dashboard).
 */
export default async function TermIndexPage({ params }) {
  const { termId } = await params;

  return (
    <div className="flex-1 overflow-auto">
      <StudentActivityList termId={termId} hideTitle />
    </div>
  );
}
