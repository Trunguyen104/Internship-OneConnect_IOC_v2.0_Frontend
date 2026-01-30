'use client';

import { useEffect, useState } from 'react';
import Card from '@/shared/components/Card';
import { getStudentList } from '@/mocks/mockStudentList';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchStudents() {
      const res = await getStudentList();
      setStudents(res.data);
    }

    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className='space-y-6'>
      <h1 className='text-2xl font-bold text-slate-900'>Sinh viên</h1>

      <Card>
        {/* Search */}
        <div className='p-6 pb-4'>
          <div className='relative w-70'>
            <input
              type='text'
              placeholder='Tìm kiếm theo tên'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full rounded-full bg-white py-2 pl-3 pr-4 border border-slate-300 text-sm text-slate-700 placeholder:text-slate-400
              focus:border-primary focus:ring-2 focus:ring-primary/20'
            />
          </div>
        </div>

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className='w-full text-left'>
            <thead className='border-b border-slate-300 text-xs text-slate-400'>
              <tr>
                <th className='px-5 py-3'>STT</th>
                <th className='px-4 py-3'>Avatar</th>
                <th className='px-1 py-3'>Họ và tên</th>
                <th className='px-6 py-4'>Email</th>
                <th className='px-6 py-4'>Ngày sinh</th>
                <th className='px-6 py-4'>Giới tính</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-slate-300 text-gray-800'>
              {filteredStudents.map((s, i) => (
                <tr key={s.id}>
                  <td className='px-7 py-4 text-sm font-medium'>{i + 1}</td>
                  <td className='px-4 py-4'>
                    <Avatar name={s.name} />
                  </td>
                  <td className='px-1 py-4 text-sm font-medium'>{s.name}</td>
                  <td className='px-6 py-4 text-sm text-slate-500'>{s.email}</td>
                  <td className='px-6 py-4 text-sm'>{formatDate(s.dob)}</td>
                  <td className='px-6 py-4 text-sm'>{s.gender}</td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className='px-6 py-6 text-center text-sm text-slate-400'>
                    Không tìm thấy sinh viên
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}

function Avatar({ name }) {
  return (
    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600'>
      {name.charAt(0)}
    </div>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('vi-VN');
}
