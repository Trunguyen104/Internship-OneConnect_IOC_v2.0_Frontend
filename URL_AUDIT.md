# URL/Route Audit theo FEATURE (để tránh trùng/lệch URL)

Ngày audit: 2026-03-20  
Scope: map `src/app` → URL + liệt kê nơi đang generate/điều hướng tới các URL đó (Sidebar/Menu/Link/router.push/redirect).

---

# 1. Danh sách feature

1) Entry / Root  
2) Auth  
3) Unauthorized  
4) Enterprise Portal  
5) Super Admin  
6) University Admin  
7) Internship Groups (Landing)  
8) Internship Group Workspace (dynamic `[internshipGroupId]`)  
9) Profile (Personal)  
10) Job Board  
11) API/Auth/Proxy/Uploads (route handlers)

---

# 2. URL theo từng feature (source of truth + nơi generate)

## 2.1 Entry / Root

**URL (từ `src/app`):**
- `src/app/page.js` → `/` (redirect → `/login`)

**Nơi generate/điều hướng:**
- `src/app/page.js`: `redirect('/login')`

---

## 2.2 Auth

**URL (từ `src/app`):** *(route group `(auth)` không lên URL)*
- `src/app/(auth)/login/page.jsx` → `/login`
- `src/app/(auth)/forgot-password/page.jsx` → `/forgot-password`

**Nơi generate/điều hướng:**
- `src/components/features/auth/components/LoginPage.jsx`: Link → `/forgot-password`
- `src/components/features/auth/components/LoginForm.jsx`: Link → `/forgot-password`
- `src/components/features/auth/components/ForgotPassword.jsx`: Link → `/login`
- `src/components/features/auth/hooks/useLogin.js`: `router.push(...)` sau login:
  - SUPER_ADMIN/MODERATOR → `/admin-users`
  - SCHOOL_ADMIN → `/admin-dashboard`
  - ENTERPRISE_ADMIN/HR/MENTOR → `/dashboard`
  - STUDENT (và fallback) → `/internship-groups`

**Nguy cơ lệch/trùng:**
- Hard-code string URL ở nhiều file → nên gom route constants.

---

## 2.3 Unauthorized

**URL (từ `src/app`):**
- `src/app/unauthorized/page.jsx` → `/unauthorized`

**Nơi generate/điều hướng:**
- `src/app/unauthorized/page.jsx`: Link → `/login`

**Nguy cơ lệch/trùng:**
- Chưa thấy chỗ nào redirect/router.push vào `/unauthorized` (có thể route “để đó” nhưng chưa dùng).

---

## 2.4 Enterprise Portal

**URL (từ `src/app`):** *(route groups `(main)` + `(enterprise)` không lên URL)*
- `src/app/(main)/(enterprise)/dashboard/page.jsx` → `/dashboard`
- `src/app/(main)/(enterprise)/internship-student-management/page.jsx` → `/internship-student-management`
- `src/app/(main)/(enterprise)/internship-group-management/page.jsx` → `/internship-group-management`

**Nơi generate/điều hướng:**
- `src/components/layout/EnterpriseSidebar.jsx` menu:
  - `/dashboard`
  - `/internship-student-management`
  - `/internship-group-management`
- `src/components/features/auth/hooks/useLogin.js`: enterprise roles → `/dashboard`
- `src/components/layout/Header.jsx` dropdown:
  - Profile → `/profile` hoặc `/internship-groups/:internshipGroupId/profile`
  - Settings → `/settings` *(⚠️ không có route trong `src/app`)*
  - Logout → `/login`

**Lệch chắc chắn:**
- ⚠️ `/settings` đang được push nhưng **không tồn tại** trong `src/app`.

**Nguy cơ trùng domain:**
- Cùng domain “internship groups” nhưng URL bị tách: student dùng `/internship-groups/*`, enterprise dùng `*-management`.

---

## 2.5 Super Admin

**URL (từ `src/app`):** *(route groups `(main)` + `(super-admin)` không lên URL)*
- `src/app/(main)/(super-admin)/admin-users/page.jsx` → `/admin-users`
- `src/app/(main)/(super-admin)/universities/page.jsx` → `/universities`
- `src/app/(main)/(super-admin)/enterprises/page.jsx` → `/enterprises`

**Nơi generate/điều hướng:**
- `src/components/layout/SidebarSuperAdmin.jsx` menu:
  - `/admin-users`, `/universities`, `/enterprises`
- `src/components/features/auth/hooks/useLogin.js`: superadmin/moderator → `/admin-users`

**Nguy cơ lệch/trùng:**
- Prefix không đồng bộ: `/admin-users` nhưng `/universities`, `/enterprises` không có namespace.

---

## 2.6 University Admin

**URL (từ `src/app`):** *(route groups `(main)` + `(uni-admin)` không lên URL)*
- `src/app/(main)/(uni-admin)/admin-dashboard/page.jsx` → `/admin-dashboard`
- `src/app/(main)/(uni-admin)/internship-terms/page.jsx` → `/internship-terms`
- `src/app/(main)/(uni-admin)/enrollments/page.jsx` → `/enrollments`

**Nơi generate/điều hướng:**
- `src/components/layout/SidebarAdmin.jsx` menu:
  - `/admin-dashboard`, `/internship-terms`, `/enrollments`
- `src/components/features/auth/hooks/useLogin.js`: school admin → `/admin-dashboard`

**Nguy cơ lệch/trùng:**
- `/admin-dashboard` không cùng namespace với `/internship-terms` & `/enrollments`.

---

## 2.7 Internship Groups (Landing)

**URL (từ `src/app`):**
- `src/app/(main)/internship-groups/page.jsx` → `/internship-groups`

**Nơi generate/điều hướng:**
- `src/components/features/auth/hooks/useLogin.js`: student → `/internship-groups`
- `src/components/features/internship/InternshipDashboard.jsx`:
  - Link vào workspace: `/internship-groups/:internshipGroupId/space`

---

## 2.8 Internship Group Workspace (dynamic)

**URL (từ `src/app`):**
- Index redirect:
  - `src/app/(main)/internship-groups/[internshipGroupId]/page.jsx` → `/internship-groups/:internshipGroupId` (redirect → `/internship-groups/:internshipGroupId/space`)
- Sub routes:
  - `.../space/page.jsx` → `/internship-groups/:internshipGroupId/space`
  - `.../work-board/page.jsx` → `/internship-groups/:internshipGroupId/work-board`
  - `.../backlog/page.jsx` → `/internship-groups/:internshipGroupId/backlog`
  - `.../daily-report/page.jsx` → `/internship-groups/:internshipGroupId/daily-report`
  - `.../evaluate/page.jsx` → `/internship-groups/:internshipGroupId/evaluate`
  - `.../general-info/page.jsx` → `/internship-groups/:internshipGroupId/general-info`
  - `.../project/page.jsx` → `/internship-groups/:internshipGroupId/project`
  - `.../stakeholder/page.jsx` → `/internship-groups/:internshipGroupId/stakeholder`
  - `.../studentlist/page.jsx` → `/internship-groups/:internshipGroupId/studentlist`
  - `.../violation/page.jsx` → `/internship-groups/:internshipGroupId/violation`
  - `.../profile/page.jsx` → `/internship-groups/:internshipGroupId/profile`
  - `.../profile/change-password/page.jsx` → `/internship-groups/:internshipGroupId/profile/change-password`

**Nơi generate/điều hướng:**
- `src/app/(main)/internship-groups/[internshipGroupId]/page.jsx`: redirect → `/internship-groups/:id/space`
- `src/components/layout/Sidebar.jsx` menu:
  - `/internship-groups/:id/{space,general-info,project,studentlist,daily-report,evaluate,stakeholder,violation}`
  - `/internship-groups/:id/profile`
  - `/internship-groups/:id/profile/change-password`
- `src/components/layout/StudentTabs.jsx`:
  - `/internship-groups/:id/{space,work-board,backlog}`
- `src/components/layout/Header.jsx`:
  - Profile (khi có param) → `/internship-groups/:id/profile`
- `src/components/features/work-board/components/EmptySprintState.jsx`:
  - Link backlog → `/internship-groups/:id/backlog`

**Nguy cơ lệch/trùng:**
- `studentlist` không theo kebab-case và dễ “lệch naming” với các chỗ khác → nên chuẩn hoá thành `students` hoặc `student-list` (đổi thì phải update tất cả sources ở trên).

---

## 2.9 Profile (Personal)

**URL (từ `src/app`):**
- `src/app/(main)/profile/page.jsx` → `/profile`

**Nơi generate/điều hướng:**
- `src/components/layout/Header.jsx`:
  - Profile (không có param) → `/profile`
- `src/components/layout/Sidebar.jsx`:
  - Profile → `/profile`
  - ⚠️ Change Password → `/profile/change-password` *(không có route)*

**Lệch chắc chắn:**
- ⚠️ `/profile/change-password` đang được generate nhưng **không tồn tại** trong `src/app`.
  - Hiện chỉ có change-password ở workspace: `/internship-groups/:id/profile/change-password`.

---

## 2.10 Job Board

**URL (từ `src/app`):**
- `src/app/(main)/job-board/page.jsx` → `/job-board`

**Nơi generate/điều hướng:**
- `src/components/features/internship/components/InternshipCard.jsx`: `Button href="/job-board"`

---

## 2.11 API/Auth/Proxy/Uploads (route handlers)

**URL (từ `src/app`):**
- `src/app/api/auth/route.js` → `/api/auth`
- `src/app/api/auth/change-password/route.js` → `/api/auth/change-password`
- `src/app/api/proxy/[...path]/route.js` → `/api/proxy/*`
- `src/app/uploads/[...path]/route.js` → `/uploads/*`

**Nơi đang gọi (sources):**
- `src/services/httpClient.js`: `/api/proxy`, `/api/auth`
- `src/components/features/user/components/ChangePass.jsx`: `/api/auth/change-password`

---

# 3. Quick list: URL đang được generate nhưng không có route

- ⚠️ `/settings` (source: `src/components/layout/Header.jsx`)
- ⚠️ `/profile/change-password` (source: `src/components/layout/Sidebar.jsx`)

---

# 4. Convention tối thiểu để khỏi trùng URL (khuyến nghị)

- Tạo 1 file route constants (ví dụ `src/constants/routes.js`) và chỉ dùng nó trong UI:
  - `ROUTES.AUTH.LOGIN`, `ROUTES.AUTH.FORGOT_PASSWORD`, `ROUTES.PROFILE.ROOT`, `ROUTES.JOB_BOARD`, ...
  - `ROUTES.INTERNSHIP_GROUP.space(id)`, `ROUTES.INTERNSHIP_GROUP.profile(id)`, ...
- Segment URL dùng kebab-case (đặc biệt: cân nhắc đổi `studentlist` → `students`).

