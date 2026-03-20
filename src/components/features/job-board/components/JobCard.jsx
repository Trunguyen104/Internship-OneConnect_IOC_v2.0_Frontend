'use client';
import { EnvironmentOutlined, HeartOutlined } from '@ant-design/icons';
import { Card, Tag, Typography } from 'antd';

import { JOB_BOARD_UI } from '@/constants/job-board/uiText';

const { Text } = Typography;

export default function JobCard({ title, company, salary, location }) {
  return (
    <Card
      hoverable
      className="rounded-xl border-none shadow-sm transition hover:shadow-md"
      styles={{ body: { padding: 16 } }}
    >
      <div className="flex h-full gap-4">
        {/* LOGO */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-300">
          LOGO
        </div>

        {/* CONTENT */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <Text strong className="hover:text-success line-clamp-2 cursor-pointer text-[15px]">
                {title || JOB_BOARD_UI.DEFAULT_TITLE}
              </Text>

              <HeartOutlined className="hover:text-danger cursor-pointer text-gray-400" />
            </div>

            <Text className="mb-2 block truncate text-[12px] text-gray-400 uppercase">
              {company || JOB_BOARD_UI.DEFAULT_COMPANY}
            </Text>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <Tag className="bg-success-surface text-success m-0 border-none font-medium">
              {salary || JOB_BOARD_UI.DEFAULT_SALARY}
            </Tag>

            <Text type="secondary" className="flex items-center text-[12px]">
              <EnvironmentOutlined className="mr-1" />
              {location || JOB_BOARD_UI.DEFAULT_LOCATION}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
}
