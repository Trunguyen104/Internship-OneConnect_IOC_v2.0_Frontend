'use client';

import { useEffect, useState } from 'react';
import Board from '@/components/features/backlog/components/Board';

export default function ClientBoard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return <Board />;
}

