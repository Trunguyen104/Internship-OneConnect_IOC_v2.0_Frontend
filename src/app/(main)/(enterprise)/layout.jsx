import EnterpriseSidebar from '@/components/layout/EnterpriseSidebar';

export default function EnterpriseLayout({ children }) {
  return (
    <div className='flex min-h-screen bg-white'>
      <EnterpriseSidebar />
      <main className='flex-1 overflow-y-auto bg-gray-50'>{children}</main>
    </div>
  );
}
