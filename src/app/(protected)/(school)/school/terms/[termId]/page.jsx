import { redirect } from 'next/navigation';

/**
 * Entering /school/terms/[termId] sends users to the term overview (dashboard shell).
 */
export default async function TermIndexPage({ params }) {
  const { termId } = await params;
  redirect(`/school/terms/${termId}/enrollments`);
}
