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
import {
  UploadOutlined,
  FileTextOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { PROJECT_MESSAGES } from '@/constants/project/messages';
import { PROJECT_UI } from '@/constants/project/uiText';
import { RESOURCE_TYPES } from '@/constants/project/resourceTypes';

const { Title, Text, Paragraph } = Typography;

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
      message.error(PROJECT_MESSAGES.ERROR.LOAD_RESOURCES);
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
      message.warning(PROJECT_MESSAGES.WARNING.FILE_REQUIRED);
      return;
    }

    setUploading(true);
    const file = fileList[0];

    const formData = new FormData();
    formData.append('ProjectId', projectId);
    formData.append('ResourceName', values.resourceName || file.name);
    formData.append('ResourceType', values.resourceType || 1);
    formData.append('File', file.originFileObj || file);

    try {
      await createProjectResource(formData);
      await loadResources(projectId);
      setFileList([]);
      form.resetFields();
      message.success(PROJECT_MESSAGES.SUCCESS.UPLOAD);
    } catch (err) {
      console.error('Upload error:', err);
      message.error(PROJECT_MESSAGES.ERROR.UPLOAD_FAILED);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProjectResource(id);
      message.success(PROJECT_MESSAGES.SUCCESS.DELETE);
      await loadResources(projectId);
    } catch (err) {
      console.error('Delete error:', err);
      message.error(PROJECT_MESSAGES.ERROR.DELETE_FAILED);
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
      await updateProjectResource(editingResource.projectResourceId, {
        projectId: projectId,
        resourceName: values.resourceName,
        resourceType: values.resourceType || editingResource.resourceType || 1,
      });
      message.success(PROJECT_MESSAGES.SUCCESS.UPDATE);
      setIsEditModalVisible(false);
      await loadResources(projectId);
    } catch (err) {
      console.error('Update error:', err);
      message.error(PROJECT_MESSAGES.ERROR.UPDATE_FAILED);
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
        message.error(PROJECT_MESSAGES.ERROR.INVALID_FILE_TYPE);
        return Upload.LIST_IGNORE;
      }

      const isLt10M = file.size / 1024 / 1024 <= 10;
      if (!isLt10M) {
        message.error(PROJECT_MESSAGES.ERROR.FILE_TOO_LARGE);
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
            Thông tin dự án
          </Title>
          <Text type='secondary'>
            Xem thông tin chi tiết, các phân hệ và quản lý tài liệu đính kèm dự án.
          </Text>
        </div>

        <Card variant='borderless' className='shadow-sm' style={{ borderRadius: 12 }}>
          <Descriptions
            title={
              <Title level={4} style={{ margin: 0 }}>
                Tổng quan
              </Title>
            }
            bordered
            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label='Tên dự án'>
              <Text strong>IOC Version 2</Text>
            </Descriptions.Item>
            <Descriptions.Item label='Lĩnh vực'>
              <Tag color='blue'>Công nghệ thông tin</Tag>
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Space orientation='vertical' size='large' style={{ width: '100%' }}>
            <div>
              <Title level={5} style={{ color: '#1890ff' }}>
                1. Tổng quan dự án
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
                2. Chi tiết các Phân hệ (Modules)
              </Title>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                  <Card
                    title='Phân hệ Nhà trường'
                    size='small'
                    type='inner'
                    style={{ height: '100%' }}
                  >
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
                3. Các tính năng nâng cao
              </Title>
              <ul style={{ paddingLeft: 20, marginBottom: 0, lineHeight: 1.8 }}>
                <li>
                  <Text>Hợp đồng điện tử (E-Sign)</Text>
                </li>
                <li>
                  <Text>AI Matching giữa CV & JD</Text>
                </li>
                <li>
                  <Text>Tích hợp Google Calendar</Text>
                </li>
              </ul>
            </div>
          </Space>
        </Card>

        <Card
          variant='borderless'
          title={
            <Title level={4} style={{ margin: 0 }}>
              Tài liệu dự án
            </Title>
          }
          className='shadow-sm'
          style={{ borderRadius: 12 }}
        >
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={9} xl={8}>
              <Card
                type='inner'
                title={PROJECT_UI.TITLE.ADD_RESOURCE}
                variant='borderless'
                style={{ background: '#fafafa' }}
              >
                <Form form={form} layout='vertical' onFinish={handleUpload}>
                  <Form.Item
                    label={PROJECT_UI.FORM.RESOURCE_NAME}
                    name='resourceName'
                    tooltip='Nếu để trống sẽ sử dụng tên file đính kèm'
                  >
                    <Input placeholder={PROJECT_UI.PLACEHOLDER.RESOURCE_NAME} />
                  </Form.Item>

                  <Form.Item
                    label={PROJECT_UI.FORM.RESOURCE_TYPE}
                    name='resourceType'
                    initialValue={1}
                    required
                  >
                    <Select options={RESOURCE_TYPES} />
                  </Form.Item>

                  <Form.Item label={PROJECT_UI.FORM.ATTACH_FILE} required>
                    <Upload {...uploadProps}>
                      <Button icon={<UploadOutlined />}>{PROJECT_UI.BUTTON.SELECT_FILE}</Button>
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
                      {PROJECT_UI.BUTTON.UPLOAD}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            <Col xs={24} lg={15} xl={16}>
              <Space style={{ marginBottom: 16 }} size='small' align='center'>
                <Title level={5} style={{ margin: 0 }}>
                  {PROJECT_UI.TITLE.RESOURCE_LIST}
                </Title>
                <Tag color='geekblue'>{resources.length} files</Tag>
              </Space>

              <List
                itemLayout='horizontal'
                dataSource={resources}
                loading={loading}
                locale={{ emptyText: PROJECT_UI.EMPTY.NO_RESOURCE }}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        key='download'
                        type='link'
                        icon={<DownloadOutlined />}
                        href={item.resourceUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {PROJECT_UI.BUTTON.DOWNLOAD}
                      </Button>,
                      <Button
                        key='edit'
                        type='link'
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(item)}
                      >
                        {PROJECT_UI.BUTTON.EDIT}
                      </Button>,
                      <Popconfirm
                        key='delete'
                        title={PROJECT_UI.CONFIRM.DELETE_RESOURCE}
                        onConfirm={() => handleDelete(item.projectResourceId)}
                        okText='Yes'
                        cancelText='No'
                      >
                        <Button type='link' danger icon={<DeleteOutlined />}>
                          {PROJECT_UI.BUTTON.DELETE}
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
                      description={`Type: ${RESOURCE_TYPES.find((t) => t.value === item.resourceType)?.label || 'Other'}`}
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Card>
      </Space>

      <Modal
        title={PROJECT_UI.TITLE.EDIT_RESOURCE}
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={() => editForm.submit()}
        okText={PROJECT_UI.BUTTON.UPDATE}
        cancelText={PROJECT_UI.BUTTON.CANCEL}
      >
        <Form form={editForm} layout='vertical' onFinish={handleUpdate}>
          <Form.Item
            name='resourceName'
            label={PROJECT_UI.FORM.RESOURCE_NAME}
            rules={[{ required: true, message: 'Vui lòng nhập tên tài liệu!' }]}
          >
            <Input placeholder={PROJECT_UI.PLACEHOLDER.RESOURCE_NAME} />
          </Form.Item>

          <Form.Item
            name='resourceType'
            label={PROJECT_UI.FORM.RESOURCE_TYPE}
            rules={[{ required: true, message: 'Vui lòng chọn loại tài liệu!' }]}
          >
            <Select options={RESOURCE_TYPES} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
