'use client';

import React from 'react';
import { Card, Typography, Row, Col, Divider, Tag, Descriptions, Space } from 'antd';

const { Title, Text, Paragraph } = Typography;

export default function ProjectOverview() {
  return (
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
            Internship OneConnect (IOC) là nền tảng chuyển đổi số toàn diện quy trình thực tập, giải
            quyết bài toán kết nối rườm rà giữa ba bên: Nhà trường – Doanh nghiệp – Sinh viên. Hệ
            thống thay thế các quy trình giấy tờ thủ công bằng workflow tự động, minh bạch và hiệu
            quả cao.
          </Paragraph>
        </div>

        <div>
          <Title level={5} style={{ color: '#1890ff' }}>
            2. Chi tiết các Phân hệ (Modules)
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card title='Phân hệ Nhà trường' size='small' type='inner' style={{ height: '100%' }}>
                <ul style={{ paddingLeft: 20, margin: 0, lineHeight: 1.8 }}>
                  <li>
                    Quản lý Kỳ thực tập: Tạo và cấu hình các đợt thực tập, thiết lập timeline, tiêu
                    chí đánh giá.
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
              <Card title='Phân hệ Sinh viên' size='small' type='inner' style={{ height: '100%' }}>
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
  );
}

