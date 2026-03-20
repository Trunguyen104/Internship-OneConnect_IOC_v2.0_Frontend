'use client';

import { Col, Row } from 'antd';

import FilterBar from './FilterBar';
import JobCard from './JobCard';
import SearchBar from './SearchBar';

const MOCK_JOBS = Array(6).fill({
  title: 'Nhân Viên Kinh Doanh',
  company: 'CÔNG TY TNHH ABC',
  salary: '10 - 20 triệu',
  location: 'Hồ Chí Minh',
});

export default function JobBoardPage() {
  return (
    <div className="bg-bg min-h-screen">
      <SearchBar />

      <div className="mx-auto mt-4 max-w-6xl px-4">
        <FilterBar />

        <Row gutter={[16, 16]} className="mt-4 pb-20">
          {MOCK_JOBS.map((job, index) => (
            <Col xs={24} md={12} lg={8} key={index}>
              <JobCard {...job} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
