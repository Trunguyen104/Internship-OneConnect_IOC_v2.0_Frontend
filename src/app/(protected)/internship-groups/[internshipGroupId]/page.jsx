import { redirect } from 'next/navigation';

export default function InternshipGroupIndexPage({ params }) {
  redirect(`/internship-groups/${params.internshipGroupId}/space`);
}
