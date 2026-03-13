'use client';

import { useEffect } from 'react';
import { usePageHeader } from '@/providers/PageHeaderProvider';

export default function StudentPageHeader({ title, subtitle, extra, hidden }) {
  const { setHeaderConfig } = usePageHeader();

  useEffect(() => {
    setHeaderConfig({
      title,
      subtitle,
      extra,
      hidden: !!hidden,
    });

    return () => {
      setHeaderConfig({});
    };
  }, [title, subtitle, extra, hidden, setHeaderConfig]);

  return null;
}
