'use client';

import { Button, Col, Form, Input, Row, Select, Typography } from 'antd';

import { PROFILE_UI } from '@/constants/user/uiText';

const { Text } = Typography;

export default function SkillAddForm({
  newSkill,
  setNewSkill,
  skillError,
  setSkillError,
  handleAddSkill,
}) {
  return (
    <div className="border-border bg-surface rounded-lg border p-6">
      <Form layout="vertical">
        <Row gutter={16} align="bottom">
          <Col flex="auto">
            <Form.Item
              style={{ marginBottom: 0 }}
              label={
                <>
                  {PROFILE_UI.SKILLS.ADD_LABEL}{' '}
                  <Text type="secondary">
                    {PROFILE_UI.SKILLS.MAX_LENGTH_HINT(newSkill.name.length, 30)}
                  </Text>
                </>
              }
            >
              <Input
                value={newSkill.name}
                maxLength={30}
                placeholder={PROFILE_UI.SKILLS.PLACEHOLDER}
                onChange={(e) => {
                  setNewSkill({ ...newSkill, name: e.target.value });
                  if (skillError) setSkillError('');
                }}
              />
            </Form.Item>
          </Col>

          <Col style={{ width: 200 }}>
            <Form.Item style={{ marginBottom: 0 }} label={PROFILE_UI.SKILLS.LEVEL_LABEL}>
              <Select
                value={newSkill.level || undefined}
                placeholder={PROFILE_UI.SKILLS.LEVEL_PLACEHOLDER}
                onChange={(value) => setNewSkill({ ...newSkill, level: value })}
                options={PROFILE_UI.SKILLS.LEVELS}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" danger onClick={handleAddSkill}>
                {PROFILE_UI.BUTTONS.ADD}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {skillError && <Text type="danger">{skillError}</Text>}
    </div>
  );
}
