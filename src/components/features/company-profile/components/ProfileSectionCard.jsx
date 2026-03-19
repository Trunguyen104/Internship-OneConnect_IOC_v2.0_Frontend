'use client';

import { Card, CardHeader } from '@/components/ui/atoms';

export function ProfileSectionCard({ title, icon, children, extra }) {
  return (
    <Card className='h-full min-h-0'>
      <CardHeader title={title} icon={icon} right={extra} />
      <div className='flex min-h-0 flex-1 flex-col p-6'>{children}</div>
    </Card>
  );
}
