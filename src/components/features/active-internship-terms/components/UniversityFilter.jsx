import { Select, Typography } from 'antd';
import React from 'react';

import { ACTIVE_TERM_UI } from '../constants/uiText';

const { Text } = Typography;

export const UniversityFilter = ({ value, onChange, universities = [] }) => {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      <Text strong className="text-gray-600">
        {ACTIVE_TERM_UI.FILTER.UNIVERSITY_LABEL}
      </Text>
      <Select
        value={value}
        onChange={onChange}
        placeholder={ACTIVE_TERM_UI.FILTER.ALL_UNIVERSITIES}
        className="w-full min-w-[200px] md:w-auto"
        allowClear
        showSearch
        style={{ width: 280 }}
      >
        <Select.Option value="ALL">{ACTIVE_TERM_UI.FILTER.ALL_UNIVERSITIES}</Select.Option>
        {universities.map((uni) => (
          <Select.Option key={uni.id} value={uni.id}>
            {uni.name}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};
