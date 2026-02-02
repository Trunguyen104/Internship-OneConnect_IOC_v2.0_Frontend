'use client';

import { useEffect, useState } from 'react';
import Board from '@/feature/student/Board';

export default function ClientBoard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return <Board />;
}
