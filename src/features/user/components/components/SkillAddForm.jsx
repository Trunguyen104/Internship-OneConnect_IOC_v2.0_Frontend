'use client';

import { Form, Input, Select, Button, Row, Col, Typography } from 'antd';

const { Text } = Typography;

export default function SkillAddForm({
  newSkill,
  setNewSkill,
  skillError,
  setSkillError,
  handleAddSkill,
}) {
  return (
    <div className='rounded-lg border border-slate-200 bg-slate-50 p-6'>
      <Form layout='vertical'>
        <Row gutter={16} align='bottom'>
          <Col flex='auto'>
            <Form.Item
              style={{ marginBottom: 0 }}
              label={
                <>
                  Skill <Text type='secondary'>({newSkill.name.length}/30)</Text>
                </>
              }
            >
              <Input
                value={newSkill.name}
                maxLength={30}
                placeholder='VD: React, Java, SQL'
                onChange={(e) => {
                  setNewSkill({ ...newSkill, name: e.target.value });
                  if (skillError) setSkillError('');
                }}
              />
            </Form.Item>
          </Col>

          <Col style={{ width: 200 }}>
            <Form.Item style={{ marginBottom: 0 }} label='Level'>
              <Select
                value={newSkill.level || undefined}
                placeholder='Không bắt buộc'
                onChange={(value) => setNewSkill({ ...newSkill, level: value })}
                options={[
                  { value: 'Beginner', label: 'Beginner' },
                  { value: 'Intermediate', label: 'Intermediate' },
                  { value: 'Advanced', label: 'Advanced' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type='primary' danger onClick={handleAddSkill}>
                Add
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {skillError && <Text type='danger'>{skillError}</Text>}
    </div>
  );
}
