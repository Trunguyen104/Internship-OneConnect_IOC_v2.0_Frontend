'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Space,
  Divider,
  Button,
  Input,
  Upload,
  List,
  message,
  Descriptions,
  Tag,
  Form,
  Modal,
  Popconfirm,
  Select,
} from 'antd';
import {
  getProjectResources,
  createProjectResource,
  deleteProjectResource,
  updateProjectResource,
} from '@/services/projectResources';
import { ProjectService } from '@/services/projectService';
import { UploadOutlined, FileTextOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const RESOURCE_TYPES = [
  { value: 'PDF', label: 'Tài liệu hướng dẫn (PDF)' },
  { value: 'DOCX', label: 'Biểu mẫu (DOCX)' },
  { value: 'PNG', label: 'Hình ảnh (PNG)' },
  { value: 'JPG', label: 'Hình ảnh (JPG)' },
  { value: 'PPTX', label: 'Slide trình bày (PPTX)' },
  { value: 'ZIP', label: 'Mã nguồn/File nén (ZIP)' },
  { value: 'RAR', label: 'Mã nguồn/File nén (RAR)' },
];

export default function Project() {
  const [projectId, setProjectId] = useState(null);

  const [resources, setResources] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [editForm] = Form.useForm();

  const loadResources = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getProjectResources(id);
      setResources(data?.data?.items || []);
    } catch (err) {
      console.error('Load resources error:', err);
      message.error('Lỗi khi tải danh sách tài liệu.');
    } finally {
      setLoading(false);
    }
  };

  const initProject = async () => {
    try {
      setLoading(true);
      const res = await ProjectService.getAll();
      if (res && res.data && res.data.items && res.data.items.length > 0) {
        const id = res.data.items[0].projectId;
        setProjectId(id);
        await loadResources(id);
      }
    } catch (error) {
      console.error('Failed to init project', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initProject();
  }, []);

  const handleUpload = async (values) => {
    if (fileList.length === 0) {
      message.warning('Vui lòng chọn file đính kèm!');
      return;
    }

    setUploading(true);
    const file = fileList[0];

    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('resourceName', values.resourceName || file.name);
    formData.append('resourceType', values.resourceType || 'PDF');
    formData.append('file', file.originFileObj || file);

    try {
      await createProjectResource(formData);
      await loadResources(projectId);
      setFileList([]);
      form.resetFields();
      message.success('Tải lên tài liệu thành công!');
    } catch (err) {
      console.error('Upload error:', err);
      message.error('Tải lên tài liệu thất bại!');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProjectResource(id);
      message.success('Xóa tài liệu thành công!');
      await loadResources(projectId);
    } catch (err) {
      console.error('Delete error:', err);
      message.error('Lỗi khi xóa tài liệu!');
    }
  };

  const openEditModal = (resource) => {
    setEditingResource(resource);
    editForm.setFieldsValue({
      resourceName: resource.resourceName,
      resourceType: resource.resourceType,
    });
    setIsEditModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      const updateData = {
        projectResourceId: editingResource.projectResourceId,
        projectId: projectId,
        resourceName: values.resourceName,
        resourceType: values.resourceType || editingResource.resourceType || 'PDF',
      };

      await updateProjectResource(editingResource.projectResourceId, updateData);
      message.success('Cập nhật tài liệu thành công!');
      setIsEditModalVisible(false);
      await loadResources(projectId);
    } catch (err) {
      console.error('Update error:', err);
      message.error('Lỗi khi cập nhật tài liệu!');
    }
  };

  const uploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      const allowedExtensions = [
        'pdf',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'ppt',
        'pptx',
        'png',
        'jpg',
        'jpeg',
        'zip',
        'rar',
        'mp4',
      ];
      const currentExt = file.name.split('.').pop().toLowerCase();
      const isAllowed = allowedExtensions.includes(currentExt);
      if (!isAllowed) {
        message.error(`Không hỗ trợ định dạng file .${currentExt}! Chỉ cho phép loại file cơ bản.`);
        return Upload.LIST_IGNORE;
      }

      const isLt10M = file.size / 1024 / 1024 <= 10;
      if (!isLt10M) {
        message.error('Dung lượng file vượt quá giới hạn 10MB!');
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      return false;
    },
    fileList,
    maxCount: 1,
  };

  return (
    <div style={{ paddingBottom: 40, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      <Space orientation='vertical' size='large' style={{ width: '100%' }}>
        <div style={{ padding: '0 8px' }}>
          <Title level={2} style={{ margin: 0 }}>
            Project Information
          </Title>
          <Text type='secondary'>
            View detailed information, modules, and manage attached project documents.
          </Text>
        </div>

        <Card variant='borderless' className='shadow-sm' style={{ borderRadius: 12 }}>
          <Descriptions
            title={
              <Title level={4} style={{ margin: 0 }}>
                Overview
              </Title>
            }
            bordered
            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label='Tên dự án'>
              <Text strong>IOC Version 2</Text>
            </Descriptions.Item>
            <Descriptions.Item label='Lĩnh vực'>
              <Tag color='blue'>Information Technology</Tag>
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Space orientation='vertical' size='large' style={{ width: '100%' }}>
            <div>
              <Title level={5} style={{ color: '#1890ff' }}>
                1. Project Overview
              </Title>
              <Paragraph style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 0 }}>
                Internship OneConnect (IOC) là nền tảng chuyển đổi số toàn diện quy trình thực tập,
                giải quyết bài toán kết nối rườm rà giữa ba bên: Nhà trường – Doanh nghiệp – Sinh
                viên. Hệ thống thay thế các quy trình giấy tờ thủ công bằng workflow tự động, minh
                bạch và hiệu quả cao.
              </Paragraph>
            </div>

            <div>
              <Title level={5} style={{ color: '#1890ff' }}>
                2. Detailed Modules
              </Title>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                  <Card title='School Module' size='small' type='inner' style={{ height: '100%' }}>
                    <ul style={{ paddingLeft: 20, margin: 0, lineHeight: 1.8 }}>
                      <li>
                        Quản lý Kỳ thực tập: Tạo và cấu hình các đợt thực tập, thiết lập timeline,
                        tiêu chí đánh giá.
                      </li>
                      <li>
                        Quản lý Sinh viên: Import danh sách sinh viên, theo dõi trạng thái thực tập.
                      </li>
                      <li>Phân công Giảng viên hướng dẫn.</li>
                      <li>
                        Thống kê & Báo cáo: Dashboard theo dõi tỷ lệ sinh viên, điểm số, phản hồi.
                      </li>
                    </ul>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card
                    title='Phân hệ Doanh nghiệp'
                    size='small'
                    type='inner'
                    style={{ height: '100%' }}
                  >
                    <ul style={{ paddingLeft: 20, margin: 0, lineHeight: 1.8 }}>
                      <li>Hồ sơ Doanh nghiệp & thương hiệu tuyển dụng.</li>
                      <li>Đăng tin tuyển dụng (JD), yêu cầu kỹ năng.</li>
                      <li>Quy trình tuyển dụng: CV, phỏng vấn, Offer Letter.</li>
                      <li>Quản lý OJT: Mentor, duyệt logbook, đánh giá năng lực.</li>
                    </ul>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card
                    title='Phân hệ Sinh viên'
                    size='small'
                    type='inner'
                    style={{ height: '100%' }}
                  >
                    <ul style={{ paddingLeft: 20, margin: 0, lineHeight: 1.8 }}>
                      <li>CV & Portfolio trực tuyến.</li>
                      <li>Tìm kiếm và ứng tuyển vị trí thực tập.</li>
                      <li>Báo cáo Daily / Weekly.</li>
                      <li>Tra cứu kết quả, điểm số, chứng nhận.</li>
                    </ul>
                  </Card>
                </Col>
              </Row>
            </div>

            <div>
              <Title level={5} style={{ color: '#1890ff' }}>
                3. Advanced Features
              </Title>
              <ul style={{ paddingLeft: 20, marginBottom: 0, lineHeight: 1.8 }}>
                <li>
                  <Text>E-Sign Contracts</Text>
                </li>
                <li>
                  <Text>AI Matching giữa CV & JD</Text>
                </li>
                <li>
                  <Text>Google Calendar Integration</Text>
                </li>
              </ul>
            </div>
          </Space>
        </Card>

        <Card
          variant='borderless'
          title={
            <Title level={4} style={{ margin: 0 }}>
              Project Documents
            </Title>
          }
          className='shadow-sm'
          style={{ borderRadius: 12 }}
        >
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={9} xl={8}>
              <Card
                type='inner'
                title='Thêm tài liệu mới'
                variant='borderless'
                style={{ background: '#fafafa' }}
              >
                <Form form={form} layout='vertical' onFinish={handleUpload}>
                  <Form.Item
                    label='Document Name'
                    name='resourceName'
                    tooltip='If left blank, the attached file name will be used'
                  >
                    <Input placeholder='Enter document name (optional)...' />
                  </Form.Item>

                  <Form.Item label='Document Type' name='resourceType' initialValue='PDF' required>
                    <Select options={RESOURCE_TYPES} />
                  </Form.Item>

                  <Form.Item label='Attached File' required>
                    <Upload {...uploadProps}>
                      <Button icon={<UploadOutlined />}>Chọn file</Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      type='primary'
                      htmlType='submit'
                      loading={uploading}
                      disabled={fileList.length === 0}
                      block
                    >
                      Upload
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            <Col xs={24} lg={15} xl={16}>
              <Space style={{ marginBottom: 16 }} size='small' align='center'>
                <Title level={5} style={{ margin: 0 }}>
                  List of documents
                </Title>
                <Tag color='geekblue'>{resources.length} files</Tag>
              </Space>

              <List
                itemLayout='horizontal'
                dataSource={resources}
                loading={loading}
                locale={{ emptyText: 'Chưa có tài liệu nào đính kèm.' }}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        key='edit'
                        type='link'
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(item)}
                      >
                        Edit
                      </Button>,
                      <Popconfirm
                        key='delete'
                        title='Are you sure you want to delete this document?'
                        onConfirm={() => handleDelete(item.projectResourceId)}
                        okText='Yes'
                        cancelText='No'
                      >
                        <Button type='link' danger icon={<DeleteOutlined />}>
                          Delete
                        </Button>
                      </Popconfirm>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <FileTextOutlined
                          style={{
                            fontSize: 28,
                            color: '#1890ff',
                            marginTop: 4,
                          }}
                        />
                      }
                      title={<Text strong>{item.resourceName || 'Untitled Resource'}</Text>}
                      description={`Document Type: ${RESOURCE_TYPES.find((t) => t.value === item.resourceType)?.label || 'Other'}`}
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Card>
      </Space>

      <Modal
        title='Chỉnh sửa tài liệu'
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={() => editForm.submit()}
        okText='Cập nhật'
        cancelText='Hủy'
      >
        <Form form={editForm} layout='vertical' onFinish={handleUpdate}>
          <Form.Item
            name='resourceName'
            label='Tên tài liệu'
            rules={[{ required: true, message: 'Vui lòng nhập tên tài liệu!' }]}
          >
            <Input placeholder='Nhập tên tài liệu...' />
          </Form.Item>

          <Form.Item
            name='resourceType'
            label='Loại tài liệu'
            rules={[{ required: true, message: 'Vui lòng chọn loại tài liệu!' }]}
          >
            <Select options={RESOURCE_TYPES} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
