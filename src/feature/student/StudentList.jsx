'use client';

import { useEffect, useState, useRef } from 'react';
import Card from '@/shared/components/Card';
import { getStudentList } from '@/mocks/mockStudentList';
import SearchBar from '@/shared/components/SearchBar';
import Footer from '@/shared/components/Footer';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const tableRef = useRef(null);

  useEffect(() => {
    async function fetchStudents() {
      const res = await getStudentList();
      setStudents(res.data || []);
    }
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const total = filteredStudents.length;
  const totalPages = Math.ceil(total / pageSize);
  const paginatedStudents = filteredStudents.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    tableRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, pageSize]);

  return (
    <section className='space-y-6'>
      <h1 className='text-2xl font-bold text-slate-900'>Sinh viên</h1>

      <Card>
        <div className='p-2'>
          <SearchBar
            placeholder='Tìm kiếm theo tên'
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
          />
        </div>

        <div className='overflow-auto max-h-[500px] mt-4 border-t border-slate-200' ref={tableRef}>
          <table className='w-full text-left border-collapse'>
            <thead className='sticky top-0 z-10 bg-slate-50 border-b border-slate-300 text-xs font-semibold text-slate-500 uppercase tracking-wider'>
              <tr>
                <th className='px-6 py-4 text-center w-16'>STT</th>
                <th className='px-6 py-4'>Avatar</th>
                <th className='px-6 py-4'>Họ và tên</th>
                <th className='px-6 py-4'>Email</th>
                <th className='px-6 py-4 text-center'>Ngày sinh</th>
                <th className='px-6 py-4 text-center'>Giới tính</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-slate-200 text-slate-700 bg-white'>
              {paginatedStudents.map((s, i) => (
                <tr key={s.id} className='hover:bg-slate-50 transition-colors'>
                  <td className='px-6 py-4 text-sm text-center font-medium text-slate-400'>
                    {(page - 1) * pageSize + i + 1}
                  </td>
                  <td className='px-6 py-4'>
                    <Avatar name={s.name} />
                  </td>
                  <td className='px-6 py-4 text-sm font-semibold text-slate-900'>{s.name}</td>
                  <td className='px-6 py-4 text-sm text-slate-500 font-light'>{s.email}</td>
                  <td className='px-6 py-4 text-sm text-center'>{formatDate(s.dob)}</td>
                  <td className='px-6 py-4 text-sm text-center'>
                    <span>{s.gender}</span>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className='px-6 py-10 text-center text-sm text-slate-400 italic'>
                    Không tìm thấy sinh viên nào phù hợp
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

function Avatar({ name }) {
  return (
    <div className='flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-600 text-xs shadow-inner'>
      {name.split(' ').pop().charAt(0)}
    </div>
  );
}

function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('vi-VN');
}
