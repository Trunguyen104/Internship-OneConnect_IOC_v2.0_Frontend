'use client';

import { Layout, Menu } from 'antd';
import {
  AlertOctagon,
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarCheck,
  ClipboardCheck,
  FileText,
  FolderKanban,
  GraduationCap,
  Info,
  LayoutDashboard,
  Lock,
  UserCircle,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';

import { USER_ROLE } from '@/constants/user-management/enums';
import { useInternshipStatus } from '@/hooks/useInternshipStatus';
import { useAuthStore } from '@/store/useAuthStore';
import { useLayoutStore } from '@/store/useLayoutStore';

const { Sider } = Layout;

export default function AppSidebar() {
  const user = useAuthStore((state) => state.user);
  const isSidebarCollapsed = useLayoutStore((s) => s.isSidebarCollapsed);
  const router = useRouter();
  const pathname = usePathname();
  const { isEnrolled, isPlaced, hasCv, hasActiveApp } = useInternshipStatus();

  const role = user?.role;

  const getDashboardHref = useCallback((userRole) => {
    const nRole = Number(userRole);
    if (nRole === USER_ROLE.SUPER_ADMIN) return '/admin/dashboard';
    if (nRole === USER_ROLE.SCHOOL_ADMIN) return '/school/home';
    if (
      nRole === USER_ROLE.ENTERPRISE_ADMIN ||
      nRole === USER_ROLE.HR ||
      nRole === USER_ROLE.MENTOR
    )
      return '/company/home';
    if (nRole === USER_ROLE.STUDENT) return '/student/home';
    return '/';
  }, []);

  const getRoutes = useCallback(
    (userRole) => {
      // ══════════════════════════════════════════════════════
      // CONTEXT 1 — TERM WORKSPACE
      // ══════════════════════════════════════════════════════
      const termWorkspaceMatch = pathname.match(/^\/school\/terms\/([^/]+)/);
      if (termWorkspaceMatch) {
        const p = `/school/terms/${termWorkspaceMatch[1]}`;
        return [
          { key: 'back-to-terms', icon: <ArrowLeft className="size-4" />, label: 'Back to Terms' },
          { type: 'divider' },
          { key: `${p}/overview`, icon: <LayoutDashboard className="size-4" />, label: 'Overview' },
          { key: `${p}/enrollments`, icon: <Users className="size-4" />, label: 'Students' },
          // { key: `${p}/groups`, icon: <Briefcase className="size-4" />, label: 'Groups' },
        ];
      }

      // ══════════════════════════════════════════════════════
      // CONTEXT — STUDENT PORTAL (AC Logic)
      // ══════════════════════════════════════════════════════
      if (pathname.startsWith('/student') || pathname === '/my-applications') {
        const isStudent =
          Number(userRole) === USER_ROLE.STUDENT || String(userRole).toLowerCase() === 'student';
        if (isStudent) {
          const menu = [
            { key: '/student/home', icon: <LayoutDashboard className="size-4" />, label: 'Home' },
          ];

          // AC logic: My Applications
          if (isEnrolled && (hasActiveApp || isPlaced)) {
            menu.push({
              key: '/my-applications',
              icon: <FileText className="size-4" />,
              label: 'My Applications',
            });
          }

          // AC logic: Explore Jobs
          if (isEnrolled && hasCv && !isPlaced) {
            menu.push({
              key: '/student/jobs',
              icon: <Briefcase className="size-4" />,
              label: 'Explore Jobs',
            });
          }

          return menu;
        }
      }

      // ══════════════════════════════════════════════════════
      // CONTEXT — PHASE WORKSPACE (Enterprise)
      // ══════════════════════════════════════════════════════
      const phaseWorkspaceMatch = pathname.match(/^\/company\/phases\/([^/]+)/);
      if (phaseWorkspaceMatch) {
        const p = `/company/phases/${phaseWorkspaceMatch[1]}`;
        return [
          {
            key: 'back-to-phases',
            icon: <ArrowLeft className="size-4" />,
            label: 'Back to Phases',
          },
          { type: 'divider' },
          { key: `${p}/overview`, icon: <LayoutDashboard className="size-4" />, label: 'Overview' },
          {
            key: `${p}/applications`,
            icon: <FileText className="size-4" />,
            label: 'Applications',
          },
          { key: `${p}/students`, icon: <Users className="size-4" />, label: 'Students' },
          { key: `${p}/groups`, icon: <FolderKanban className="size-4" />, label: 'Groups' },
          {
            key: `${p}/evaluation`,
            icon: <ClipboardCheck className="size-4" />,
            label: 'Evaluations',
          },
          {
            key: `/company/public-holidays`,
            icon: <CalendarCheck className="size-4" />,
            label: 'Public Holidays',
          },
        ];
      }

      // ══════════════════════════════════════════════════════
      // CONTEXT 3 — GROUP WORKSPACE
      // ══════════════════════════════════════════════════════
      const groupWorkspaceMatch = pathname.match(/^\/internship-groups\/([^/]+)/);
      if (groupWorkspaceMatch) {
        const p = `/internship-groups/${groupWorkspaceMatch[1]}`;
        return [
          { key: 'back-to-home', icon: <ArrowLeft className="size-4" />, label: 'Back to Home' },
          { type: 'divider' },
          { key: `${p}/space`, icon: <LayoutDashboard className="size-4" />, label: 'Space' },
          { key: `${p}/general-info`, icon: <Info className="size-4" />, label: 'General Info' },
          { key: `${p}/project`, icon: <FolderKanban className="size-4" />, label: 'Project' },
          { key: `${p}/studentlist`, icon: <Users className="size-4" />, label: 'Students' },
          {
            key: `${p}/daily-report`,
            icon: <CalendarCheck className="size-4" />,
            label: 'Logbook',
          },
          {
            key: `${p}/evaluate`,
            icon: <ClipboardCheck className="size-4" />,
            label: 'Evaluation',
          },
          {
            key: `${p}/stakeholder`,
            icon: <UserCircle className="size-4" />,
            label: 'Stakeholders',
          },
          { key: `${p}/violation`, icon: <AlertOctagon className="size-4" />, label: 'Violations' },
        ];
      }

      // ══════════════════════════════════════════════════════
      // CONTEXT 4 — PROFILE
      // ══════════════════════════════════════════════════════
      if (pathname.startsWith('/profile')) {
        return [
          {
            key: 'back-to-app',
            icon: <ArrowLeft className="size-4" />,
            label: 'Back to Dashboard',
          },
          { type: 'divider' },
          { key: '/profile', icon: <UserCircle className="size-4" />, label: 'My Profile' },
          {
            key: '/profile/change-password',
            icon: <Lock className="size-4" />,
            label: 'Change Password',
          },
        ];
      }

      const nRole = Number(userRole);
      if (nRole === USER_ROLE.SUPER_ADMIN || nRole === USER_ROLE.MODERATOR) {
        return [
          {
            key: '/admin/dashboard',
            icon: <LayoutDashboard className="size-4" />,
            label: 'Dashboard',
          },
          {
            key: '/admin/universities',
            icon: <GraduationCap className="size-4" />,
            label: 'Universities',
          },
          {
            key: '/admin/enterprises',
            icon: <Building2 className="size-4" />,
            label: 'Enterprises',
          },
          { key: '/admin/users', icon: <Users className="size-4" />, label: 'Users' },
        ];
      }

      if (nRole === USER_ROLE.HR || nRole === USER_ROLE.ENTERPRISE_ADMIN) {
        return [
          {
            key: '/company/home',
            icon: <LayoutDashboard className="size-4" />,
            label: 'Dashboard',
          },
          {
            key: '/company/phases',
            icon: <Briefcase className="size-4" />,
            label: 'Internship Phases',
          },
          {
            key: '/company/public-holidays',
            icon: <CalendarCheck className="size-4" />,
            label: 'Public Holidays',
          },
        ];
      }

      return [];
    },
    [pathname, isEnrolled, isPlaced, hasCv, hasActiveApp]
  );

  const menuItems = useMemo(() => getRoutes(role), [role, getRoutes]);
  const selectedKeys = useMemo(() => {
    // Collect all matching items
    const matches = menuItems.filter(
      (item) => item.key && (pathname === item.key || pathname.startsWith(item.key + '/'))
    );

    if (matches.length === 0) return [];

    // Prefer the longest match to ensure sub-routes (like /profile/change-password)
    // are highlighted instead of generic parent routes (like /profile)
    const longestMatch = matches.reduce((prev, curr) =>
      curr.key.length > prev.key.length ? curr : prev
    );

    return [longestMatch.key];
  }, [pathname, menuItems]);

  const handleMenuClick = useCallback(
    (info) => {
      if (info.key === 'back-to-app') return router.push(getDashboardHref(role));
      if (info.key === 'back-to-terms') return router.push('/school/terms');
      if (info.key === 'back-to-phases') return router.push('/company/phases');
      if (info.key === 'back-to-home') return router.push(getDashboardHref(role));
      if (info.key) router.push(info.key);
    },
    [role, router, getDashboardHref]
  );

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={isSidebarCollapsed}
      theme="light"
      width={260}
      className="border-r border-gray-100 h-screen sticky top-0"
      onCollapse={(collapsed) => useLayoutStore.setSidebarCollapsed(collapsed)}
    >
      <div className={isSidebarCollapsed ? 'p-4' : 'p-6'}>
        <Image
          src={isSidebarCollapsed ? '/assets/images/logo-mini.png' : '/assets/images/logo.svg'}
          alt="Logo"
          width={isSidebarCollapsed ? 32 : 120}
          height={32}
          className="object-contain"
        />
      </div>
      <Menu
        mode="inline"
        theme="light"
        selectedKeys={selectedKeys}
        items={menuItems}
        onClick={handleMenuClick}
        className="border-none font-semibold px-2"
      />
    </Sider>
  );
}
