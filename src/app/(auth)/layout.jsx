export default function LoginLayout({ children }) {
  return (
    <div
      className="h-screen w-full overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at top left, var(--primary-100) 0%, var(--color-surface) 65%)',
      }}
    >
      <div className="flex h-full items-center justify-center px-4">
        <div className="w-full max-w-md p-5 rounded-2xl border border-gray-200 bg-white shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
