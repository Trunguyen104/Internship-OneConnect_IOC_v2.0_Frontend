'use client';

import {
  CalendarOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Col, Divider, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import Card from '@/components/ui/card';

import { VIOLATION_REPORT_UI } from '../constants/violationReportUI';

const { Title, Text } = Typography;

const DetailItem = ({ label, value, icon }) => (
  <div className="mb-4">
    <div className="text-muted mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-60">
      {icon}
      {label}
    </div>
    <div className="text-text text-sm font-bold">{value || 'N/A'}</div>
  </div>
);

export default function ViolationReportDetail({ report }) {
  const { DETAIL } = VIOLATION_REPORT_UI;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-6">
        <Card className="flex-1 border-none bg-white shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl text-primary">
              <UserOutlined className="text-xl" />
            </div>
            <Title level={4} className="!m-0 text-lg font-black">
              {DETAIL.STUDENT_INFO}
            </Title>
          </div>

          <Row gutter={[24, 24]}>
            <Col span={12}>
              <DetailItem label={DETAIL.STUDENT_NAME} value={report.studentName} />
            </Col>
            <Col span={12}>
              <DetailItem label={DETAIL.STUDENT_CODE} value={report.studentCode} />
            </Col>
            <Col span={12}>
              <DetailItem label={DETAIL.UNIVERSITY} value={report.universityName} />
            </Col>
            <Col span={12}>
              <DetailItem label={DETAIL.INTERN_GROUP} value={report.internGroupName} />
            </Col>
            <Col span={12}>
              <DetailItem label={DETAIL.MENTOR} value={report.createdByName} />
            </Col>
          </Row>
        </Card>

        <Card className="flex-1 border-none bg-white shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-danger/10 flex h-10 w-10 items-center justify-center rounded-xl text-danger">
              <InfoCircleOutlined className="text-xl" />
            </div>
            <Title level={4} className="!m-0 text-lg font-black">
              {DETAIL.VIOLATION_INFO}
            </Title>
          </div>

          <Row gutter={[24, 24]}>
            <Col span={12}>
              <DetailItem
                label={DETAIL.INCIDENT_DATE}
                value={dayjs(report.incidentDate).format('DD MMMM, YYYY')}
                icon={<CalendarOutlined />}
              />
            </Col>
            <Col span={12}>
              <DetailItem
                label={DETAIL.CREATED_TIME}
                value={dayjs(report.createdAt).format('DD/MM/YYYY HH:mm')}
                icon={<ClockCircleOutlined />}
              />
            </Col>
            <Col span={24}>
              <DetailItem label={DETAIL.CREATED_BY} value={report.createdByName} />
            </Col>
          </Row>
        </Card>
      </div>

      <Card className="border-none bg-white shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <Title level={5} className="!m-0 font-bold">
            {DETAIL.DESCRIPTION}
          </Title>
        </div>
        <Divider className="my-4" />
        <div className="bg-gray-50 rounded-xl p-6">
          <Text className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
            {report.description}
          </Text>
        </div>
      </Card>
    </div>
  );
}
