'use client';

import { useEffect, useState, useRef } from 'react';
import Card from '@/shared/components/Card';
import { getViolationList } from '@/mocks/mockViolationList';
import SearchBar from '@/shared/components/SearchBar';
import { PlusOutlined } from '@ant-design/icons';
import Footer from '@/shared/components/Footer';

export default function ViolationList() {
  const [violations, setViolations] = useState([]);
  const [search, setSearch] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const tableRef = useRef(null);

  useEffect(() => {
    tableRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [page, pageSize]);

  const filteredViolations = violations.filter(
    (v) =>
      v.type.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase()),
  );

  const total = filteredViolations.length;
  const totalPages = Math.ceil(total / pageSize);

  const paginatedViolations = filteredViolations.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    async function fetchViolations() {
      const res = await getViolationList();
      setViolations(res.data || []);
    }
    fetchViolations();
  }, []);

  return (
    <section className='flex flex-col h-full space-y-6'>
      <h1 className='text-2xl font-bold text-slate-900'>Vi phạm</h1>
      <Card>
        <SearchBar
          placeholder='Tìm kiếm'
          value={search}
          onChange={setSearch}
          showFilter
          actionIcon={<PlusOutlined />}
        />

        <div className='overflow-x-auto' ref={tableRef}>
          <table className='w-full text-left mt-5'>
            <thead className='border-b border-slate-300 text-xs text-slate-400'>
              <tr>
                <th className='px-6 py-4'>STT</th>
                <th className='px-6 py-4'>Loại vi phạm</th>
                <th className='px-6 py-4'>Mô tả chi tiết</th>
                <th className='px-6 py-4'>Thời gian vi phạm</th>
                <th className='px-6 py-4'>Người ghi nhận</th>
                <th className='px-6 py-4'>Ngày tạo</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-slate-300 text-gray-800'>
              {paginatedViolations.map((v, i) => (
                <tr key={v.id}>
                  <td className='px-6 py-4 text-sm font-medium'>{i + 1}</td>
                  <td className='px-6 py-4 text-sm font-medium'>{v.type}</td>
                  <td className='px-6 py-4 text-sm text-slate-600'>{v.description}</td>
                  <td className='px-6 py-4 text-sm'>{formatDateTime(v.violationTime)}</td>
                  <td className='px-6 py-4 text-sm'>{v.reporter}</td>
                  <td className='px-6 py-4 text-sm'>{formatDate(v.createdAt)}</td>
                </tr>
              ))}

              {filteredViolations.length === 0 && (
                <tr>
                  <td colSpan={6} className='px-6 py-6 text-center text-sm text-slate-400'>
                    Không có vi phạm
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Footer
        total={total}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </section>
  );
}

function formatDate(date) {
  if (!date) return '-';
  return new Date(`${date}T00:00:00`).toLocaleDateString('vi-VN');
}

function formatDateTime(date) {
  if (!date) return '-';
  return new Date(date).toLocaleString('vi-VN');
}
