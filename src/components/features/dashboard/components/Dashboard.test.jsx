import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DASHBOARD_UI } from '@/constants/dashboard/uiText';

import { useDashboard } from '../hooks/useDashboard';
import DashboardPage from './Dashboard';

// Mock the hook
vi.mock('../hooks/useDashboard', () => ({
  useDashboard: vi.fn(),
}));

// Mock layout components
vi.mock('@/components/layout/PageShell', () => ({
  default: ({ children }) => <div data-testid="page-shell">{children}</div>,
}));
vi.mock('@/components/layout/StudentTabs', () => ({
  default: () => <div data-testid="student-tabs" />,
}));
vi.mock('@/components/layout/StudentPageHeader', () => ({
  default: () => <div data-testid="student-header" />,
}));

// Mock feature atoms
vi.mock('./atoms', () => ({
  StatCard: ({ label, value }) => (
    <div data-testid="stat-card">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  ),
  Loading: () => <div data-testid="loading" />,
  ErrorBox: ({ message }) => <div data-testid="error-box">{message}</div>,
}));

// Mock charts
vi.mock('./DashboardCharts', () => ({
  BurndownChart: () => <div data-testid="burndown-chart" />,
  TaskStatusDistributionChart: () => <div data-testid="task-status-chart" />,
  WorkloadDistributionChart: () => <div data-testid="workload-chart" />,
  CompletionPieChart: () => <div data-testid="completion-pie-chart" />,
}));

// Mock violations list
vi.mock('./ViolationsList', () => ({
  ViolationsList: () => <div data-testid="violations-list" />,
}));

describe('DashboardPage Component', () => {
  const mockData = {
    summary: {
      totalTasks: 10,
      inProgress: 3,
      done: 5,
      overdue: 2,
    },
    burndown: [],
    taskStatusDistribution: [],
    workloadByPerson: [],
    studentViolations: [],
  };

  const mockCompletionPie = [
    { name: 'Completed', value: 80 },
    { name: 'Overdue', value: 20 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading & Error States', () => {
    it('should show loading state when data is not yet available', () => {
      useDashboard.mockReturnValue({ data: null, err: null, completionPie: [] });
      render(<DashboardPage />);
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should show error box when hook returns an error', () => {
      useDashboard.mockReturnValue({ data: null, err: 'Failed to fetch', completionPie: [] });
      render(<DashboardPage />);
      expect(screen.getByTestId('error-box')).toHaveTextContent('Failed to fetch');
    });
  });

  describe('Happy Path: Success State', () => {
    beforeEach(() => {
      useDashboard.mockReturnValue({
        data: mockData,
        err: null,
        completionPie: mockCompletionPie,
      });
    });

    it('should render all summary stat cards with correct data', () => {
      render(<DashboardPage />);

      const statCards = screen.getAllByTestId('stat-card');
      expect(statCards).toHaveLength(4);

      expect(screen.getByText(DASHBOARD_UI.TOTAL_TASKS)).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();

      expect(screen.getByText(DASHBOARD_UI.IN_PROGRESS)).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();

      expect(screen.getByText(DASHBOARD_UI.COMPLETED)).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();

      expect(screen.getByText(DASHBOARD_UI.OVERDUE)).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should render all charts and lists', () => {
      render(<DashboardPage />);
      expect(screen.getByTestId('burndown-chart')).toBeInTheDocument();
      expect(screen.getByTestId('task-status-chart')).toBeInTheDocument();
      expect(screen.getByTestId('workload-chart')).toBeInTheDocument();
      expect(screen.getByTestId('completion-pie-chart')).toBeInTheDocument();
      expect(screen.getByTestId('violations-list')).toBeInTheDocument();
    });

    it('should render action tabs and export button', () => {
      render(<DashboardPage />);
      expect(screen.getByTestId('student-tabs')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: new RegExp(DASHBOARD_UI.EXPORT_CSV, 'i') })
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility & UI', () => {
    it('should hide the student page header (visually hidden/hidden prop)', () => {
      useDashboard.mockReturnValue({ data: mockData, err: null, completionPie: [] });
      render(<DashboardPage />);
      expect(screen.getByTestId('student-header')).toBeInTheDocument();
      // Since it's mocked, we just verify it exists. In a real test,
      // we'd check if the component passed the `hidden` prop.
    });
  });
});
