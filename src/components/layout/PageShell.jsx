export default function PageShell({ title, children }) {
  return (
    <div className='bg-bg text-text flex min-h-0 flex-1 flex-col overflow-hidden'>
      <div className='flex min-h-0 flex-1 flex-col overflow-y-auto p-4 md:p-6'>
        <div className='mb-4'>
          <h1 className='text-xl font-semibold'>{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
