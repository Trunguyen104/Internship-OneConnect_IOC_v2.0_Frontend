'use client';

import { Button, Form, Input, Modal, Select, Space, Typography } from 'antd';

import { PROFILE_UI } from '@/constants/user/uiText';

const { Text } = Typography;

export default function SkillEditModal({
  editingSkill,
  editForm,
  setEditForm,
  setEditingSkill,
  updateSkill,
  deleteSkill,
}) {
  return (
    <Modal
      open={!!editingSkill}
      title={PROFILE_UI.BUTTONS.EDIT + ' ' + PROFILE_UI.SKILLS.ADD_LABEL}
      onCancel={() => setEditingSkill(null)}
      footer={null}
      centered
    >
      <Form layout="vertical">
        <Form.Item
          label={
            <>
              {PROFILE_UI.SKILLS.ADD_LABEL} Name{' '}
              <Text type="secondary">
                {PROFILE_UI.SKILLS.MAX_LENGTH_HINT(editForm.name?.length || 0, 30)}
              </Text>
            </>
          }
        >
          <Input
            value={editForm.name}
            maxLength={30}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
        </Form.Item>

        <Form.Item label={PROFILE_UI.SKILLS.LEVEL_LABEL}>
          <Select
            value={editForm.level || undefined}
            placeholder={PROFILE_UI.SKILLS.LEVEL_PLACEHOLDER}
            onChange={(value) => setEditForm({ ...editForm, level: value })}
            options={PROFILE_UI.SKILLS.LEVELS}
          />
        </Form.Item>

        <div className="mt-6 flex justify-between">
          <Button danger type="link" onClick={() => deleteSkill(editingSkill)}>
            {PROFILE_UI.BUTTONS.DELETE}
          </Button>

          <Space>
            <Button onClick={() => setEditingSkill(null)}>{PROFILE_UI.BUTTONS.CANCEL}</Button>

            <Button type="primary" danger onClick={updateSkill}>
              {PROFILE_UI.BUTTONS.SAVE_CHANGES}
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
}
