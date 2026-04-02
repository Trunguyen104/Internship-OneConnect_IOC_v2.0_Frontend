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
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <SearchBar />

      <div className="mx-auto mt-4 w-full max-w-6xl">
        <FilterBar />

        <Row gutter={[16, 16]} className="mt-4 pb-8">
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
