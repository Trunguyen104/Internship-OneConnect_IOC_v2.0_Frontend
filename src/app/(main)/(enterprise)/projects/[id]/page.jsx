'use client';

import { useParams } from 'next/navigation';
import React from 'react';

import ProjectDetailView from '@/components/features/project-management/components/ProjectDetailView';

export default function ProjectDetailViewPage() {
  const { id } = useParams();

  return <ProjectDetailView id={id} />;
}
