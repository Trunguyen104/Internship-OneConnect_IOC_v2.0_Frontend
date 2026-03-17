export default function PageShell({ title, children }) {
  return (
    <div className='text-text min-h-screen'>
      <div className='p-4 md:p-6'>
        <div className='mb-4'>
          <h1 className='text-xl font-semibold'>{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
