'use client';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import PageTitle from '@/components/ui/PageTitle';
import { usePageHeader } from '@/providers/PageHeaderProvider';

export default function Space({ children }) {
  const { headerConfig } = usePageHeader();

  return (
    <div className='flex h-screen overflow-hidden'>
      <Sidebar />

      <div className='flex h-full min-w-0 flex-1 flex-col overflow-hidden'>
        <Header />

        <main className='flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-100 p-6 2xl:px-10'>
          <div className='mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col 2xl:max-w-[2200px]'>
            {!headerConfig.hidden && headerConfig.title && (
              <PageTitle
                title={headerConfig.title}
                subtitle={headerConfig.subtitle}
                extra={headerConfig.extra}
              />
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// 'use client';

// import Header from '@/components/layout/Header';
// import Sidebar from '@/components/layout/Sidebar';
// import PageTitle from '@/components/ui/PageTitle';
// import { usePageHeader } from '@/providers/PageHeaderProvider';

// export default function Space({ children }) {
//   const { headerConfig } = usePageHeader();

//   return (
//     <div className='flex h-screen overflow-hidden'>
//       <Sidebar />

//       <div className='flex h-full min-w-0 flex-1 flex-col overflow-hidden'>
//         <Header />

//         <main className='flex-1 overflow-y-auto bg-gray-100 p-6'>
//           <div className='w-full max-w-[1800px] mx-auto px-6'>
//             {!headerConfig.hidden && headerConfig.title && (
//               <PageTitle
//                 title={headerConfig.title}
//                 subtitle={headerConfig.subtitle}
//                 extra={headerConfig.extra}
//               />
//             )}

//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
