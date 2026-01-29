"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { getDashboardData } from "@/services/dashboard.service";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .catch((e) => setErr(e?.message || "Load failed"));
  }, []);

  const completionPie = useMemo(() => {
    if (!data) return [];
    return [
      { name: "Đúng hạn", value: data.completionRatio.onTime },
      { name: "Quá hạn", value: data.completionRatio.overdue },
    ];
  }, [data]);

  const studentDonut = useMemo(() => {
    if (!data) return [];
    return data.studentStatus.map((x) => ({ name: x.status, value: x.count }));
  }, [data]);

  if (err)
    return (
      <PageShell title="Tổng quan">
        <ErrorBox message={err} />
      </PageShell>
    );
  if (!data)
    return (
      <PageShell title="Tổng quan">
        <Loading />
      </PageShell>
    );

  return (
    <PageShell title="Tổng quan">
      {/* Top actions */}
      <div className="flex items-center justify-between mb-4">
        <Tabs
          items={[
            { key: "overview", label: "Tóm tắt" },
            { key: "board", label: "Bảng công việc" },
            { key: "backlog", label: "Backlog" },
            { key: "list", label: "Danh sách công việc" },
          ]}
          activeKey="overview"
        />
        <button className="text-sm px-3 py-2 rounded-lg border hover:bg-gray-50">
          Xuất CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <StatCard label="Tổng công việc" value={data.summary.totalTasks} />
        <StatCard label="Đang thực hiện" value={data.summary.inProgress} />
        <StatCard label="Hoàn thành" value={data.summary.done} />
        <StatCard label="Quá hạn" value={data.summary.overdue} />
      </div>

      {/* Row 1: Burndown + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Burndown" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.burndown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => formatShortDate(d)}
                  minTickGap={16}
                />
                <YAxis />
                <Tooltip labelFormatter={(d) => formatFullDate(d)} />
                <Area
                  type="monotone"
                  dataKey="remaining"
                  strokeWidth={2}
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Tỷ lệ Hoàn thành/Quá hạn" />
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                />
                <Pie
                  data={completionPie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {completionPie.map((_, idx) => (
                    <Cell key={idx} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 2: Status bar + Workload bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader title="Phân bố Trạng thái" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.taskStatusDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" interval={0} tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Phân bổ Nhân sự" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.workloadByPerson}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  tick={{ fontSize: 11 }}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 3: Student status donut + Violations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Trạng thái sinh viên" />
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                />
                <Pie
                  data={studentDonut}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {studentDonut.map((_, idx) => (
                    <Cell key={idx} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Vi phạm của sinh viên" />
          {data.studentViolations?.length ? (
            <div className="p-2">
              <ul className="divide-y">
                {data.studentViolations.map((v) => (
                  <li
                    key={v.type}
                    className="py-3 flex items-center justify-between"
                  >
                    <div className="text-sm">{v.type}</div>
                    <span className="text-sm font-semibold">{v.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <EmptyState text="Không có dữ liệu" />
          )}
        </Card>
      </div>
    </PageShell>
  );
}

/* ---------------- UI atoms ---------------- */

function PageShell({ title, children }) {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-3">
        <div className="text-xs text-gray-500">Space</div>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      {children}
    </div>
  );
}

function Tabs({ items, activeKey }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <button
          key={t.key}
          className={`text-sm px-3 py-2 rounded-lg border ${
            t.key === activeKey ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-3xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl border bg-white ${className}`}>{children}</div>
  );
}

function CardHeader({ title }) {
  return (
    <div className="px-4 py-3 border-b">
      <div className="text-sm font-medium">{title}</div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="h-80 flex items-center justify-center text-sm text-gray-500">
      {text}
    </div>
  );
}

function Loading() {
  return (
    <div className="rounded-xl border bg-white p-6 text-sm text-gray-600">
      Đang tải dữ liệu dashboard...
    </div>
  );
}

function ErrorBox({ message }) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="text-sm font-semibold">Lỗi</div>
      <div className="text-sm text-gray-600 mt-1">{message}</div>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function formatShortDate(iso) {
  // "2026-01-19" -> "19/01"
  const [y, m, d] = iso.split("-");
  return `${d}/${m}`;
}

function formatFullDate(iso) {
  // "2026-01-19" -> "19/01/2026"
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
