import Card from '@/shared/components/Card';

const DATA = [
  {
    id: 1,
    name: 'Trần Gia Đạt',
    email: 'dattg.ce190694@gmail.com',
    dob: '31/05/2005',
    gender: 'Nam',
  },
  {
    id: 2,
    name: 'Trần Công Minh',
    email: 'minhtc.ce190895@gmail.com',
    dob: '01/01/2000',
    gender: 'Nam',
  },
  {
    id: 3,
    name: 'Lê Thuận Phát',
    email: 'thuanphat.ce191406@gmail.com',
    dob: '13/05/2005',
    gender: 'Nam',
  },
];

export default function StudentList() {
  return (
    <section className='space-y-6'>
      <h1 className='text-2xl font-bold text-slate-900'>Sinh viên</h1>
      <Card>
        <div className='p-6 pb-4'>
          <div className='relative w-70'>
            <input
              type='text'
              placeholder='Tìm kiếm theo tên'
              className='w-full rounded-full bg-white py-2 pl-3 pr-4 border border-slate-300 text-sm text-slate-700 placeholder:text-slate-400
              focus:border-primary focus:ring-2 focus:ring-primary/20'
            />
          </div>
        </div>

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
              {DATA.map((s, i) => (
                <tr key={s.id}>
                  <td className='px-7 py-4 text-sm font-medium'>{i + 1}</td>
                  <td className='px-4 py-4'>
                    <Avatar name={s.name} />
                  </td>
                  <td className='px-1 py-4 text-sm font-medium'>{s.name}</td>
                  <td className='px-6 py-4 text-sm text-slate-500'>{s.email}</td>
                  <td className='px-6 py-4 text-sm'>{s.dob}</td>
                  <td className='px-6 py-4 text-sm'>{s.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {/* <div className='rounded-2xl bg-white shadow-sm'>
        <div className='p-6 pb-4'>
          <div className='relative w-70'>
            <input
              type='text'
              placeholder='Tìm kiếm theo tên'
              className='w-full rounded-full bg-white py-2 pl-3 pr-4 border border-slate-300 text-sm text-slate-700 placeholder:text-slate-400
              focus:border-primary focus:ring-2 focus:ring-primary/20'
            />
          </div>
        </div>

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
              {DATA.map((s, i) => (
                <tr key={s.id}>
                  <td className='px-7 py-4 text-sm font-medium'>{i + 1}</td>
                  <td className='px-4 py-4'>
                    <Avatar name={s.name} />
                  </td>
                  <td className='px-1 py-4 text-sm font-medium'>{s.name}</td>
                  <td className='px-6 py-4 text-sm text-slate-500'>{s.email}</td>
                  <td className='px-6 py-4 text-sm'>{s.dob}</td>
                  <td className='px-6 py-4 text-sm'>{s.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
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
