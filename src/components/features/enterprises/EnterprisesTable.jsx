import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/emptystate';
import EnterprisesAction from './EnterprisesAction';

export default function EnterprisesTable({ enterprises = [], loading = false }) {
  return (
    <div className='relative w-full overflow-auto'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='pl-8'>Tax ID</TableHead>
            <TableHead>Enterprise</TableHead>
            <TableHead className='hidden lg:table-cell'>Industry</TableHead>
            <TableHead className='pr-8 text-right'>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className='h-[72px] border-slate-50'>
                <TableCell className='w-32 pl-8'>
                  <Skeleton className='h-4 w-20' />
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='size-10 rounded-lg' />
                    <div className='space-y-2'>
                      <Skeleton className='h-4 w-40' />
                      <Skeleton className='h-3 w-32' />
                    </div>
                  </div>
                </TableCell>
                <TableCell className='hidden lg:table-cell'>
                  <Skeleton className='h-6 w-24 rounded-full' />
                </TableCell>
                <TableCell className='pr-8 text-right'>
                  <Skeleton className='ml-auto h-8 w-8 rounded-lg' />
                </TableCell>
              </TableRow>
            ))
          ) : enterprises.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className='p-0'>
                <EmptyState
                  title='No enterprises found'
                  description='Explore and partner with new organizations by refining your search.'
                />
              </TableCell>
            </TableRow>
          ) : (
            enterprises.map((ent) => (
              <TableRow
                key={ent.enterpriseId || ent.id}
                className='group h-[72px] border-slate-50 transition-all duration-200 hover:bg-slate-50/80'
              >
                <TableCell className='pl-8 text-[13px] font-medium text-slate-400'>
                  <span className='rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold'>
                    {ent.taxCode || 'N/A'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50'>
                      {ent.logoUrl ? (
                        <img
                          src={ent.logoUrl}
                          alt={ent.name}
                          className='h-full w-full object-contain p-1'
                        />
                      ) : (
                        <div className='text-primary text-sm font-bold'>{ent.name?.[0]}</div>
                      )}
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-[15px] leading-tight font-bold text-slate-800'>
                        {ent.name}
                      </span>
                      <span className='max-w-[200px] truncate text-[12px] font-medium text-slate-400'>
                        {ent.website}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className='hidden lg:table-cell'>
                  <span className='border-primary/10 bg-primary/5 text-primary inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wider uppercase'>
                    {ent.industry || 'General'}
                  </span>
                </TableCell>
                <TableCell className='pr-8 text-right'>
                  <div className='flex justify-end transition-opacity duration-200 group-hover:opacity-100 sm:opacity-0'>
                    <EnterprisesAction enterprise={ent} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
