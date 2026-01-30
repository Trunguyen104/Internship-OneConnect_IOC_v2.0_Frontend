export default function PageShell({ title, children }) {
  return (
    <div className='min-h-screen bg-bg text-text'>
      <div className='p-4 md:p-6'>
        <div className='mb-4'>
          <h1 className='text-xl font-semibold'>{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
