'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Table,
  Button,
  Popconfirm,
  message,
  Spin,
  Empty,
  Typography,
  Avatar,
  Tooltip,
  Tag,
  Input,
} from 'antd';
import {
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { InternshipGroupService } from '@/services/internshipGroup.service';

const { Title, Text } = Typography;

export default function StudentList() {
  const [messageApi, contextHolder] = message.useMessage();
  const searchParams = useSearchParams();
  const internshipId = searchParams.get('id');

  const [groupDetail, setGroupDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // const [adding, setAdding] = useState(false);
  // const [form] = Form.useForm();

  const [currentId, setCurrentId] = useState(internshipId);
  // Thêm state vào component
  const [searchText, setSearchText] = useState('');

  // Filter dữ liệu trước khi đưa vào Table
  const filteredMembers = (groupDetail?.members || []).filter(
    (m) =>
      m.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchText.toLowerCase()),
  );

  const fetchGroupDetail = useCallback(async () => {
    let idToFetch = currentId || internshipId;
    setLoading(true);

    try {
      if (!idToFetch) {
        const groupsRes = await InternshipGroupService.getAll();
        if (groupsRes && groupsRes.isSuccess !== false && groupsRes.data) {
          const items = groupsRes.data.items || groupsRes.items || [];
          if (items.length > 0) {
            idToFetch = items[0].internshipId;
            setCurrentId(idToFetch);
          }
        }
      }

      if (!idToFetch) {
        setLoading(false);
        return;
      }

      const res = await InternshipGroupService.getById(idToFetch);
      if (res && res.isSuccess !== false) {
        setGroupDetail(res.data);
      } else {
        messageApi.error(
          res?.message || res?.data?.message || 'Failed to fetch internship group details',
        );
      }
    } catch (error) {
      console.error('Error fetching group detail:', error);
      messageApi.error('An error occurred while fetching group details');
    } finally {
      setLoading(false);
    }
  }, [internshipId, currentId, messageApi]);

  useEffect(() => {
    fetchGroupDetail();
  }, [fetchGroupDetail]);

  // const handleAddStudent = async (values) => {
  //   const targetId = currentId || internshipId;
  //   if (!targetId) return;
  //   setAdding(true);
  //   try {
  //     const payload = {
  //       students: [
  //         {
  //           studentId: values.studentId,
  //           role: values.role || 0,
  //         },
  //       ],
  //     };

  //     const res = await InternshipGroupService.addStudents(targetId, payload);
  //     if (res && res.isSuccess !== false) {
  //       messageApi.success('Student added successfully!');
  //       setIsModalOpen(false);
  //       form.resetFields();
  //       fetchGroupDetail();
  //     } else {
  //       messageApi.error(res?.message || res?.data?.message || 'Failed to add student');
  //     }
  //   } catch (error) {
  //     console.error('Error adding student:', error);
  //     messageApi.error('An error occurred while adding student');
  //   } finally {
  //     setAdding(false);
  //   }
  // };

  const handleDeleteStudent = async (studentId) => {
    const targetId = currentId || internshipId;
    if (!targetId) return;
    try {
      const payload = {
        studentIds: [studentId],
      };
      const res = await InternshipGroupService.removeStudents(targetId, payload);
      if (res && res.isSuccess !== false) {
        messageApi.success('Student removed successfully!');
        fetchGroupDetail();
      } else {
        messageApi.error(res?.message || res?.data?.message || 'Failed to remove student');
      }
    } catch (error) {
      console.error('Error removing student:', error);
      messageApi.error('An error occurred while removing student');
    }
  };

  const columns = [
    {
      title: 'Student',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <div className='flex items-center gap-3'>
          <Avatar
            className='bg-[var(--primary-100)] text-[var(--primary-700)] font-semibold border border-[var(--primary-200)]'
            size='large'
          >
            {text ? text.charAt(0).toUpperCase() : <UserOutlined />}
          </Avatar>
          <div className='flex flex-col'>
            <Text className='font-semibold text-gray-900 text-[15px]'>{text || 'N/A'}</Text>
            <Text className='text-gray-500 text-[13px]'>{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Code',
      dataIndex: 'studentCode',
      key: 'studentCode',
      render: (text) => <Text className='text-gray-600 font-medium'>{text}</Text>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag
          className={`px-3 py-1 rounded-full font-medium border-0 ${
            role === 1 ? 'bg-amber-100 text-amber-700' : 'bg-indigo-50 text-indigo-600'
          }`}
        >
          {role === 1 ? 'Leader' : 'Member'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const style =
          status === 1
            ? 'bg-emerald-50 text-emerald-600'
            : status === 0
              ? 'bg-orange-50 text-orange-600'
              : 'bg-gray-100 text-gray-600';

        const label = status === 1 ? 'Active' : status === 0 ? 'Pending' : 'Unknown';

        return (
          <div className='flex items-center gap-2'>
            <span
              className={`w-2 h-2 rounded-full ${status === 1 ? 'bg-emerald-500' : status === 0 ? 'bg-orange-500' : 'bg-gray-400'}`}
            ></span>
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${style}`}>
              {label}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Joined At',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      render: (date) => (
        <span className='text-gray-500 text-sm'>
          {date ? new Date(date).toLocaleDateString('en-GB') : 'N/A'}
        </span>
      ),
    },
    {
      title: '',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Tooltip title='Remove student'>
          <Popconfirm
            title='Remove student'
            description='Are you sure you want to remove this student from the group?'
            onConfirm={() => handleDeleteStudent(record.studentId)}
            okText='Yes'
            cancelText='No'
            okButtonProps={{ danger: true, shape: 'round' }}
            cancelButtonProps={{ shape: 'round' }}
            placement='topLeft'
          >
            <Button
              danger
              type='text'
              icon={<DeleteOutlined />}
              className='text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded-lg'
            />
          </Popconfirm>
        </Tooltip>
      ),
    },
  ];

  if (!internshipId && !currentId && !loading && !groupDetail) {
    return (
      <div className='flex h-[400px] items-center justify-center bg-gray-50/50 rounded-3xl border border-gray-200/50 m-6'>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className='my-auto'
          description={
            <span className='text-gray-500 font-medium'>
              No internship group found.
              <br />
              You might not be assigned to any group yet.
            </span>
          }
        />
      </div>
    );
  }

  return (
    <div className='space-y-6 max-w-[1400px] mx-auto'>
      {contextHolder}
      <Spin spinning={loading} size='large'>
        {groupDetail && (
          <div className='bg-white rounded-[24px] border border-gray-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] mb-8 overflow-hidden transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] hover:border-gray-200'>
            <div className='px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 bg-gray-50/30'>
              <div className='flex items-start gap-5'>
                <div>
                  <Title level={3} className='!mb-1.5 !font-bold text-gray-900 tracking-tight'>
                    {groupDetail.groupName || 'Unnamed Group'}
                  </Title>
                  <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-gray-500 font-medium'>
                    <span className='flex items-center gap-1.5'>
                      <BankOutlined className='text-gray-400' />
                      {groupDetail.enterpriseName || 'N/A Enterprise'}
                    </span>
                    <span className='w-1 h-1 rounded-full bg-gray-300'></span>
                    <span className='flex items-center gap-1.5'>
                      <UserOutlined className='text-gray-400' />
                      Mentor:{' '}
                      <span className='text-gray-700'>{groupDetail.mentorName || 'N/A'}</span>
                    </span>
                    <span className='w-1 h-1 rounded-full bg-gray-300'></span>
                    <span className='flex items-center gap-1.5'>
                      <CalendarOutlined className='text-gray-400' />
                      {groupDetail.startDate
                        ? new Date(groupDetail.startDate).toLocaleDateString('en-GB')
                        : 'N/A'}{' '}
                      -{' '}
                      {groupDetail.endDate
                        ? new Date(groupDetail.endDate).toLocaleDateString('en-GB')
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
                  groupDetail.status === 2
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : groupDetail.status === 1
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-orange-50 text-orange-700 border-orange-200'
                }`}
              >
                {groupDetail.status === 2
                  ? 'Completed'
                  : groupDetail.status === 1
                    ? 'Active'
                    : 'Initializing'}
              </div>
            </div>
          </div>
        )}

        <div className='bg-white rounded-[24px] border border-gray-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden'>
          <div className='px-8 py-5 border-b border-gray-100 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100'>
                <TeamOutlined className='text-gray-500 text-lg' />
              </div>
              <div>
                <h3 className='text-lg font-bold text-gray-900 m-0'>Group Members</h3>
                <p className='text-sm text-gray-500 m-0 mt-0.5 font-medium'>
                  {groupDetail?.members?.length || 0} students total
                </p>
              </div>
            </div>
          </div>

          <div className='px-4 pb-4'>
            <Input.Search
              placeholder='Search by name or email'
              onChange={(e) => setSearchText(e.target.value)}
              className='w-full md:w-64 mb-4'
            />
            <Table
              dataSource={filteredMembers}
              columns={columns}
              rowKey='studentId'
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                className: 'px-6 mb-2',
              }}
              rowClassName='hover:bg-gray-50/50 transition-colors cursor-default'
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <span className='text-gray-400'>No members in this group yet</span>
                    }
                  />
                ),
              }}
            />
          </div>
        </div>
      </Spin>
    </div>
  );
}
