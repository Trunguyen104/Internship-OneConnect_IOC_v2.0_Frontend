'use client';

import { Row, Col } from 'antd';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import JobCard from './components/JobCard';

const MOCK_JOBS = Array(6).fill({
  title: 'Nhân Viên Kinh Doanh',
  company: 'CÔNG TY TNHH ABC',
  salary: '10 - 20 triệu',
  location: 'Hồ Chí Minh',
});

export default function JobBoardPage() {
  return (
    <div className='bg-[#f4f5f5] min-h-screen'>
      <SearchBar />

      <div className='max-w-6xl mx-auto px-4 mt-4'>
        <FilterBar />

        <Row gutter={[16, 16]} className='pb-20 mt-4'>
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
