import { Typography, Tag } from 'antd';
import { WarningOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import AppTable from '@/components/ui/AppTable';
import { VIOLATION_UI } from '@/constants/violation/uiText';

const { Text } = Typography;

export default function ViolationTable({ data, page, pageSize, sortOrder, onSort }) {
  const columns = [
    {
      title: VIOLATION_UI.TABLE.INDEX,
      width: 70,
      align: 'center',
      render: (_, __, index) => (
        <Text type='secondary' className='text-xs font-medium'>
          {(page - 1) * pageSize + index + 1}
        </Text>
      ),
    },
    {
      title: VIOLATION_UI.TABLE.TYPE,
      dataIndex: 'type',
      key: 'type',
      width: 200,
      render: (text) => (
        <span className='text-text flex items-center gap-2 font-bold tracking-tight'>
          <WarningOutlined className='text-warning' />
          {text}
        </span>
      ),
    },
    {
      title: VIOLATION_UI.TABLE.DESCRIPTION,
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: (text) => (
        <Text className='text-muted text-sm italic' ellipsis={{ tooltip: text }}>
          {text}
        </Text>
      ),
    },
    {
      title: VIOLATION_UI.TABLE.TIME,
      dataIndex: 'violationTime',
      key: 'violationTime',
      width: 180,
      render: (date) => (
        <Text className='text-muted text-xs font-medium'>
          {date
            ? new Date(date).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : VIOLATION_UI.TABLE.EMPTY}
        </Text>
      ),
    },
    {
      title: VIOLATION_UI.TABLE.REPORTER,
      dataIndex: 'reporter',
      key: 'reporter',
      width: 150,
      render: (text) => (
        <Tag
          color='cyan'
          variant='filled'
          className='rounded-full border-none px-3 text-[10px] font-bold uppercase'
        >
          {text}
        </Tag>
      ),
    },
    {
      title: (
        <div
          className='hover:text-info flex cursor-pointer items-center gap-1 transition-colors'
          onClick={onSort}
        >
          {VIOLATION_UI.TABLE.CREATED_DATE}
          <div className='flex flex-col text-[10px]'>
            <CaretUpOutlined className={sortOrder === 'asc' ? 'text-info' : 'text-muted/30'} />
            <CaretDownOutlined className={sortOrder === 'desc' ? 'text-info' : 'text-muted/30'} />
          </div>
        </div>
      ),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => (
        <Text className='text-text text-sm font-bold'>
          {date ? new Date(date).toLocaleDateString('en-GB') : VIOLATION_UI.TABLE.EMPTY}
        </Text>
      ),
    },
  ];

  return (
    <div className='border-border/60 bg-surface overflow-hidden rounded-xl border shadow-sm'>
      <AppTable
        columns={columns}
        data={data}
        rowKey='id'
        pagination={false}
        emptyText={VIOLATION_UI.TABLE.EMPTY}
      />
    </div>
  );
}
