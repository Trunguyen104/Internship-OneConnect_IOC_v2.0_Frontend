import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const SimpleDetailItem = ({ label, value }) => (
  <div className='flex flex-col gap-0.5'>
    <Text className='font-mono text-[9px] font-black tracking-widest uppercase opacity-40'>
      {label}
    </Text>
    <div className='text-text text-[13px] font-bold'>{value}</div>
  </div>
);

export default SimpleDetailItem;
