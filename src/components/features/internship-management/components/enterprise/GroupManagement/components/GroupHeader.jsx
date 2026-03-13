'use client';

import React from 'react';
import { Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export function GroupHeader({ onCreate }) {
  return (
    <Row justify='space-between' align='middle' style={{ marginBottom: 32 }}>
      <Col>
        <h1 className='text-2xl font-bold text-slate-900'>Internship Group Management</h1>
      </Col>

      <Col>
        <Button type='primary' size='medium' icon={<PlusOutlined />} onClick={onCreate}>
          Create New Group
        </Button>
      </Col>
    </Row>
  );
}
