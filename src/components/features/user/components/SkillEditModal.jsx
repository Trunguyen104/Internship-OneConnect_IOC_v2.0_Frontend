'use client';

import { Modal, Form, Input, Select, Button, Typography, Space } from 'antd';

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
      title='Edit Skill'
      onCancel={() => setEditingSkill(null)}
      footer={null}
      centered
    >
      <Form layout='vertical'>
        <Form.Item
          label={
            <>
              Skill Name <Text type='secondary'>({editForm.name?.length || 0}/30)</Text>
            </>
          }
        >
          <Input
            value={editForm.name}
            maxLength={30}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
        </Form.Item>

        <Form.Item label='Level'>
          <Select
            value={editForm.level || undefined}
            placeholder='Không bắt buộc'
            onChange={(value) => setEditForm({ ...editForm, level: value })}
            options={[
              { value: 'Beginner', label: 'Beginner' },
              { value: 'Intermediate', label: 'Intermediate' },
              { value: 'Advanced', label: 'Advanced' },
            ]}
          />
        </Form.Item>

        <div className='mt-6 flex justify-between'>
          <Button danger type='link' onClick={() => deleteSkill(editingSkill)}>
            Delete
          </Button>

          <Space>
            <Button onClick={() => setEditingSkill(null)}>Cancel</Button>

            <Button type='primary' danger onClick={updateSkill}>
              Save Changes
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
}
