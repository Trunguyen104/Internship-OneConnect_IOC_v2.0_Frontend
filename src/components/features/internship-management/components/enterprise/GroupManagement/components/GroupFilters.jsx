'use client';

import React from 'react';
import { Input, Segmented, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export function GroupFilters({ activeTab, onTabChange, search, onSearchChange, groupCount }) {
  return (
    <Row justify='space-between' align='middle' gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col>
        <Segmented
          value={activeTab}
          onChange={onTabChange}
          options={[
            { label: `All Groups (${groupCount})`, value: 'ALL' },
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Archived', value: 'ARCHIVED' },
          ]}
        />
      </Col>

      <Col>
        <Input
          placeholder='Search groups...'
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 260 }}
        />
      </Col>
    </Row>
  );
}
