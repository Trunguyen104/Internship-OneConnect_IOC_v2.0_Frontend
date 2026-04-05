import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Select, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

export const GroupFormFields = ({ CREATE, mentorOptions, loadingMentors }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-2">
        <Form.Item
          label={
            <span className="text-muted/60 text-[10px] font-bold tracking-widest uppercase ml-1">
              {CREATE.NAME_LABEL}
            </span>
          }
          name="groupName"
          rules={[{ required: true, message: CREATE.NAME_REQUIRED }]}
          className="mb-0"
        >
          <Input
            prefix={<EditOutlined className="text-muted/40 text-[10px]" />}
            placeholder={CREATE.NAME_PLACEHOLDER}
            className="bg-slate-50/50 border-slate-100 h-9 rounded-lg hover:border-primary/50 focus:border-primary/50 transition-all text-xs font-semibold"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-muted/60 text-[10px] font-bold tracking-widest uppercase ml-2">
              {CREATE.MENTOR_LABEL}
            </span>
          }
          name="mentorId"
          className="mb-0"
        >
          <Select
            allowClear
            showSearch
            placeholder={CREATE.MENTOR_PLACEHOLDER}
            className="h-9 w-full rounded-lg bg-slate-50/50"
            loading={loadingMentors}
            options={mentorOptions}
            optionLabelProp="label"
            optionRender={(option) => option.data.display}
            optionFilterProp="searchValue"
            suffixIcon={<UserOutlined className="text-muted/40 text-[10px]" />}
          />
        </Form.Item>
      </div>

      <Form.Item
        label={
          <span className="text-muted/60 text-[10px] font-bold tracking-widest uppercase ml-1">
            {CREATE.DESCRIPTION_LABEL}
          </span>
        }
        name="description"
        className="mb-2"
      >
        <Input.TextArea
          placeholder={CREATE.DESCRIPTION_PLACEHOLDER}
          className="bg-slate-50/50 border-slate-100 rounded-lg hover:border-primary/50 focus:border-primary/50 transition-all py-1.5 text-xs font-semibold"
          autoSize={{ minRows: 1, maxRows: 2 }}
        />
      </Form.Item>
    </>
  );
};
