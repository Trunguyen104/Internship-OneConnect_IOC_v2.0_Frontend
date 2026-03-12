'use client';

import React from 'react';
import { Row, Col, Input, Select, Button, Space, Tag } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { STATUS_CONFIG, MOCK_MENTORS } from '../constants/internshipData';

const InternshipFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  mentorFilter,
  onMentorChange,
  onQuickStatusChange,
}) => {
  return (
    <Space direction='vertical' size='middle' style={{ width: '100%', marginBottom: 24 }}>
      {/* Search + Filters */}
      <Row gutter={[16, 16]} align='middle'>
        <Col xs={24} md={10}>
          <Input
            placeholder='Search students by name, email or major...'
            prefix={<SearchOutlined />}
            allowClear
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Col>

        <Col xs={24} md={14}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }} wrap>
            <Select
              style={{ minWidth: 160 }}
              value={statusFilter}
              onChange={onStatusChange}
              options={[
                { label: 'All Statuses', value: 'ALL' },
                { label: 'Pending', value: 'PENDING' },
                { label: 'Accepted', value: 'ACCEPTED' },
                { label: 'Rejected', value: 'REJECTED' },
                { label: 'Revoked', value: 'REVOKED' },
              ]}
            />

            <Select
              style={{ minWidth: 160 }}
              placeholder='Mentor'
              value={mentorFilter}
              allowClear
              onChange={onMentorChange}
              options={MOCK_MENTORS.map((m) => ({
                label: m.name,
                value: m.id,
              }))}
            />

            <Button icon={<FilterOutlined />}>Filters</Button>
          </Space>
        </Col>
      </Row>

      {/* Quick Status Filter */}
      <Space wrap>
        <Tag
          color={statusFilter === 'ALL' ? 'blue' : 'default'}
          style={{
            cursor: 'pointer',
            padding: '4px 12px',
            fontSize: '13px',
            borderRadius: '16px',
            transition: 'all 0.3s',
          }}
          onClick={() => onQuickStatusChange('ALL')}
        >
          All Students
        </Tag>

        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <Tag
            key={key}
            color={statusFilter === key ? config.color : 'default'}
            style={{
              cursor: 'pointer',
              padding: '4px 12px',
              fontSize: '13px',
              borderRadius: '16px',
              transition: 'all 0.3s',
              opacity: statusFilter === 'ALL' || statusFilter === key ? 1 : 0.6,
            }}
            onClick={() => onQuickStatusChange(key)}
          >
            {config.label}
          </Tag>
        ))}
      </Space>
    </Space>
  );
};

export default InternshipFilters;
