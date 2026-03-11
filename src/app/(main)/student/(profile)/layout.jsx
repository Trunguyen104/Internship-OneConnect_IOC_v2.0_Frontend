// import Sidebar from '@/components/shared/Sidebar';

export default function Profile({ children }) {
  return (
    <div className='flex min-h-screen'>
      {/* <Sidebar /> */}

      <main className='flex-1 p-6 bg-gray-100 '>{children}</main>
    </div>
  );
}
