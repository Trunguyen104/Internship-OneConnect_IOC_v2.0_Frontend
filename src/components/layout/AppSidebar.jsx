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
import { useAuthStore } from '@/store/useAuthStore';
import { useLayoutStore } from '@/store/useLayoutStore';

const { Sider } = Layout;

/**
 * AppSidebar — Unified, context-aware sidebar.
 *
 * Context switching priority (first match wins):
 *  1. /school/terms/[termId]/*   → Term workspace sidebar (UniAdmin)
 *  2. /company/phases/[phaseId]/* → Phase workspace sidebar (HR/Mentor/EntAdmin)
 *  3. /internship-groups/[internshipGroupId]/* → Group workspace sidebar (Student/HR/Mentor)
 *  4. /profile                    → Profile sub-navigation
 *  5. role-based main menu        → SuperAdmin only (other roles use TopNav)
 */
export default function AppSidebar() {
  const user = useAuthStore((state) => state.user);
  const { isSidebarCollapsed } = useLayoutStore();
  const router = useRouter();
  const pathname = usePathname();

  const role = user?.role;

  // ─── Helper: home URL per role ───────────────────────────────────────────
  const getDashboardHref = useCallback((userRole) => {
    const nRole = Number(userRole);
    if (nRole === USER_ROLE.SUPER_ADMIN || nRole === USER_ROLE.MODERATOR) return '/admin/dashboard';
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

  // ─── Menu builder ────────────────────────────────────────────────────────
  const getRoutes = useCallback(
    (userRole) => {
      // ══════════════════════════════════════════════════════
      // CONTEXT 1 — TERM WORKSPACE  /school/terms/[termId]/*
      // ══════════════════════════════════════════════════════
      const termWorkspaceMatch = pathname.match(/^\/school\/terms\/([^/]+)/);
      if (termWorkspaceMatch) {
        const termId = termWorkspaceMatch[1];
        const p = `/school/terms/${termId}`;
        return [
          { key: 'back-to-terms', icon: <ArrowLeft className="size-4" />, label: 'Back to Terms' },
          { type: 'divider' },
          { key: `${p}/overview`, icon: <LayoutDashboard className="size-4" />, label: 'Overview' },
          { key: `${p}/enrollments`, icon: <Users className="size-4" />, label: 'Students' },
          { key: `${p}/groups`, icon: <Briefcase className="size-4" />, label: 'Groups' },
        ];
      }

      // ══════════════════════════════════════════════════════
      // CONTEXT 2 — PHASE WORKSPACE  /company/phases/[phaseId]/*
      // ══════════════════════════════════════════════════════
      const phaseWorkspaceMatch = pathname.match(/^\/company\/phases\/([^/]+)/);
      if (phaseWorkspaceMatch) {
        const phaseId = phaseWorkspaceMatch[1];
        const p = `/company/phases/${phaseId}`;
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
          { key: `${p}/groups`, icon: <Briefcase className="size-4" />, label: 'Groups' },
          { key: `${p}/students`, icon: <Users className="size-4" />, label: 'Students' },
          {
            key: `${p}/evaluation`,
            icon: <ClipboardCheck className="size-4" />,
            label: 'Evaluation',
          },
          {
            key: `${p}/violations`,
            icon: <AlertOctagon className="size-4" />,
            label: 'Violations',
          },
        ];
      }

      // ══════════════════════════════════════════════════════
      // Internship groups list (no group id in URL)
      // ══════════════════════════════════════════════════════
      if (pathname === '/internship-groups') {
        const nRole = Number(userRole);
        const homeHref =
          nRole === USER_ROLE.STUDENT || userRole === 'student' ? '/student/home' : '/company/home';
        return [
          { key: homeHref, icon: <ArrowLeft className="size-4" />, label: 'Back to dashboard' },
        ];
      }

      // ══════════════════════════════════════════════════════
      // CONTEXT — STUDENT PORTAL  /student/*
      // (Same Ant Design Sider + Menu chrome as SuperAdmin /admin/*)
      // ══════════════════════════════════════════════════════
      if (pathname.startsWith('/student')) {
        const nRole = Number(userRole);
        const isStudent =
          nRole === USER_ROLE.STUDENT ||
          userRole === 'student' ||
          String(userRole).toLowerCase() === 'student';
        if (isStudent) {
          return [
            { key: '/student/home', icon: <LayoutDashboard className="size-4" />, label: 'Home' },
            { key: '/student/jobs', icon: <Briefcase className="size-4" />, label: 'Jobs' },
          ];
        }
      }

      // ══════════════════════════════════════════════════════
      // CONTEXT 3 — GROUP WORKSPACE  /internship-groups/[internshipGroupId]/*
      // ══════════════════════════════════════════════════════
      const groupWorkspaceMatch = pathname.match(/^\/internship-groups\/([^/]+)/);
      if (groupWorkspaceMatch) {
        const groupId = groupWorkspaceMatch[1];
        const p = `/internship-groups/${groupId}`;
        return [
          { key: 'back-to-home', icon: <ArrowLeft className="size-4" />, label: 'Back to Groups' },
          { type: 'divider' },
          { key: `${p}/space`, icon: <LayoutDashboard className="size-4" />, label: 'Space' },
          { key: `${p}/general-info`, icon: <Info className="size-4" />, label: 'General Info' },
          { key: `${p}/project`, icon: <FolderKanban className="size-4" />, label: 'Project' },
          { key: `${p}/studentlist`, icon: <Users className="size-4" />, label: 'Students' },
          {
            key: `${p}/daily-report`,
            icon: <CalendarCheck className="size-4" />,
            label: 'Daily Report',
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

      // ══════════════════════════════════════════════════════
      // CONTEXT 5 — SUPER ADMIN MAIN MENU  /admin/*
      // (only role that uses sidebar for home navigation)
      // ══════════════════════════════════════════════════════
      const nRole = Number(userRole);
      const isSuperAdmin =
        userRole === 'superadmin' ||
        userRole === 'super_admin' ||
        nRole === USER_ROLE.SUPER_ADMIN ||
        userRole === 'moderator' ||
        nRole === USER_ROLE.MODERATOR;

      if (isSuperAdmin) {
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

      // Other roles (school/company/student) use TopNav for home — no sidebar here
      return [];
    },
    [pathname]
  );

  const menuItems = useMemo(() => getRoutes(role), [role, getRoutes]);

  // ─── Selected key detection ───────────────────────────────────────────────
  const selectedKeys = useMemo(() => {
    const active = menuItems.find(
      (item) => item.key && (pathname === item.key || pathname.startsWith(item.key + '/'))
    );
    return active ? [active.key] : [];
  }, [pathname, menuItems]);

  // ─── onClick handler ─────────────────────────────────────────────────────
  const handleMenuClick = useCallback(
    (info) => {
      if (info.key === 'back-to-app') return router.push(getDashboardHref(role));
      if (info.key === 'back-to-terms') return router.push('/school/terms');
      if (info.key === 'back-to-phases') return router.push('/company/phases');
      if (info.key === 'back-to-home') {
        const nRole = Number(role);
        if (nRole === USER_ROLE.STUDENT || role === 'student') return router.push('/student/home');
        return router.push('/company/home'); // HR, Mentor
      }
      router.push(info.key);
    },
    [role, router, getDashboardHref]
  );

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={isSidebarCollapsed}
      onCollapse={(collapsed) => useLayoutStore.setSidebarCollapsed(collapsed)}
      theme="light"
      width={260}
      collapsedWidth={80}
      className="border-r border-gray-100 sticky top-0 h-screen flex flex-col"
    >
      {/* LOGO */}
      <div
        className={`flex flex-col items-center border-b border-gray-50 transition-all duration-300 ${isSidebarCollapsed ? 'py-4 px-2' : 'py-6 px-8'}`}
      >
        {isSidebarCollapsed ? (
          <div className="relative size-10 m-2 flex items-center justify-center animate-in fade-in zoom-in duration-300">
            <Image
              src="/assets/images/logo.png"
              alt="IOC Mini"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
        ) : (
          <div className="relative flex h-10 w-32 items-center justify-center overflow-hidden transition-all duration-300">
            <Image
              src="/assets/images/logo.svg"
              alt="IOC Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden pt-1 scrollbar-none">
        <Menu
          mode="inline"
          theme="light"
          selectedKeys={selectedKeys}
          items={menuItems}
          inlineIndent={12}
          onClick={handleMenuClick}
          className="border-none px-1 space-y-0.5 font-semibold"
        />
      </div>
    </Sider>
  );
}
