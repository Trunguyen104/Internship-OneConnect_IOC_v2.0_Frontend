'use client';

import { useEffect, useState, useRef } from 'react';
import Card from '@/shared/components/Card';
// import { getViolationList } from '@/mocks/mockViolationList';
import SearchBar from '@/shared/components/SearchBar';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import Footer from '@/shared/components/Footer';
import AppTable from '@/shared/components/AppTable';

export default function ViolationList() {
  const [violations] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');

  const tableRef = useRef(null);
  const handleSortDate = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };
  const columns = [
    {
      title: 'STT',
      width: 60,
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: 'Violation Type',
      dataIndex: 'type',
      key: 'type',
      width: 180,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 250,
    },
    {
      title: 'Violation Time',
      dataIndex: 'violationTime',
      key: 'violationTime',
      width: 180,
      render: (text) => formatDateTime(text),
    },
    {
      title: 'Reporter',
      dataIndex: 'reporter',
      key: 'reporter',
      width: 150,
    },
    {
      title: (
        <div className='flex cursor-pointer items-center gap-1' onClick={handleSortDate}>
          Created Date
          <div className='flex flex-col text-[8px]'>
            <CaretUpOutlined className={sortOrder === 'asc' ? 'text-blue-600' : 'text-slate-300'} />
            <CaretDownOutlined
              className={sortOrder === 'desc' ? 'text-blue-600' : 'text-slate-300'}
            />
          </div>
        </div>
      ),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => formatDate(text),
    },
  ];

  useEffect(() => {
    tableRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, pageSize]);

  useEffect(() => {
    // async function fetchViolations() {
    //   const res = await getViolationList();
    //   setViolations(res.data || []);
    // }
    // fetchViolations();
  }, []);

  const filteredViolations = violations.filter(
    (v) =>
      v.type.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase()),
  );

  const sortedViolations = [...filteredViolations].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime() || 0;
    const timeB = new Date(b.createdAt).getTime() || 0;
    return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
  });

  const total = sortedViolations.length;
  const totalPages = Math.ceil(total / pageSize);
  const paginatedViolations = sortedViolations.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section className='flex h-full flex-col space-y-6'>
      <h1 className='text-2xl font-bold text-slate-900'>Violation</h1>
      <Card>
        <div className='mb-5'>
          <SearchBar
            placeholder='Search'
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            showFilter
            // size="large"
            onActionClick={() => {}}
          />
        </div>

        <div className='max-h-96 overflow-auto border-t border-slate-200' ref={tableRef}>
          {/* <table className='w-full text-left table-fixed'>
            <thead className='border-b border-slate-300 text-xs text-slate-400 bg-slate-50 sticky top-0 z-10'>
              <tr>
                <th className='px-6 py-4 w-[60px]'>STT</th>
                <th className='px-6 py-4 w-[180px]'>Violation Type</th>
                <th className='px-6 py-4 w-[250px]'>Description</th>
                <th className='px-6 py-4 w-[180px]'>Violation Time</th>
                <th className='px-6 py-4 w-[150px]'>Reporter</th>
                <th
                  className='px-6 py-4 w-[150px] cursor-pointer hover:bg-slate-100 transition-colors'
                  onClick={handleSortDate}
                >
                  <div className='flex items-center gap-1'>
                    <span>Created Date</span>
                    <div className='flex flex-col text-[8px] leading-none shrink-0'>
                      <CaretUpOutlined
                        className={sortOrder === 'asc' ? 'text-blue-600' : 'text-slate-300'}
                      />
                      <CaretDownOutlined
                        className={sortOrder === 'desc' ? 'text-blue-600' : 'text-slate-300'}
                      />
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-300 text-slate-800 bg-white'>
              {(paginatedViolations || []).map((v, i) => (
                <tr key={v.id} className='hover:bg-slate-50 transition-colors'>
                  <td className='px-6 py-4 text-sm'>{(page - 1) * pageSize + i + 1}</td>
                  <td className='px-6 py-4 text-sm font-medium truncate' title={v.type}>
                    {v.type}
                  </td>
                  <td className='px-6 py-4 text-sm text-slate-600 truncate' title={v.description}>
                    {v.description}
                  </td>
                  <td className='px-6 py-4 text-sm whitespace-nowrap'>
                    {formatDateTime(v.violationTime)}
                  </td>
                  <td className='px-6 py-4 text-sm truncate' title={v.reporter}>
                    {v.reporter}
                  </td>
                  <td className='px-6 py-4 text-sm whitespace-nowrap'>{formatDate(v.createdAt)}</td>
                </tr>
              ))}

              {sortedViolations.length === 0 && (
                <tr>
                  <td colSpan={6} className='px-6 py-10 text-center text-sm text-slate-400'>
                    No violations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table> */}
          <AppTable
            columns={columns}
            data={paginatedViolations}
            rowKey='id'
            pagination={false}
            emptyText='No violations found'
          />
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
