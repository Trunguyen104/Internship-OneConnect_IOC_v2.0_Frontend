'use client';

import React from 'react';

import StudentPageHeader from '@/components/layout/StudentPageHeader';
import { cn } from '@/lib/cn';

import Card from './card';
import DataTableToolbar from './datatabletoolbar';
import Pagination from './pagination';

/**
 * Compound Pattern for standardizing Page Layout across the application.
 */
const PageLayout = ({ children, className }) => (
  <section
    className={cn(
      'animate-in fade-in flex min-h-0 flex-1 flex-col space-y-4 duration-500',
      className
    )}
  >
    {children}
  </section>
);

const PageHeader = (props) => <StudentPageHeader {...props} />;

const PageCard = ({ children, className }) => (
  <Card
    className={cn(
      'flex min-h-0 flex-1 flex-col overflow-hidden border-gray-100 p-5 shadow-sm border rounded-2xl bg-white',
      className
    )}
  >
    {children}
  </Card>
);

const PageToolbar = (props) => (
  <DataTableToolbar {...props} className={cn('mb-4 border-0 p-0', props.className)} />
);

const PageContent = ({ children, className }) => (
  <div className={cn('flex min-h-0 flex-1 flex-col overflow-hidden', className)}>{children}</div>
);

const PageFooter = ({ children, className }) => (
  <div className={cn('border-t border-gray-50', className)}>{children}</div>
);

const PagePagination = (props) => (
  <div className="border-t border-gray-50">
    <Pagination {...props} />
  </div>
);

// Assign sub-components to PageLayout
PageLayout.Header = PageHeader;
PageLayout.Card = PageCard;
PageLayout.Toolbar = PageToolbar;
PageLayout.Content = PageContent;
PageLayout.Footer = PageFooter;
PageLayout.Pagination = PagePagination;

export default PageLayout;
export { PageLayout };
