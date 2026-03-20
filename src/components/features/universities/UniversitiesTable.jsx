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
import UniversitiesAction from './UniversitiesAction';

export default function UniversitiesTable({ universities = [], loading = false }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='pl-8'>Code</TableHead>
          <TableHead>University</TableHead>
          <TableHead className='hidden lg:table-cell'>Address</TableHead>
          <TableHead className='pr-8 text-right'>Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className='h-[72px] border-slate-50'>
              <TableCell className='w-24 pl-8'>
                <Skeleton className='h-4 w-16' />
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-3'>
                  <Skeleton className='size-8 rounded-lg' />
                  <Skeleton className='h-4 w-40' />
                </div>
              </TableCell>
              <TableCell className='hidden lg:table-cell'>
                <Skeleton className='h-4 w-64' />
              </TableCell>
              <TableCell className='pr-8 text-right'>
                <Skeleton className='ml-auto h-8 w-8 rounded-lg' />
              </TableCell>
            </TableRow>
          ))
        ) : universities.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className='p-0'>
              <EmptyState
                title='No universities found'
                description="We couldn't find any educational institutions matching your search."
              />
            </TableCell>
          </TableRow>
        ) : (
          universities.map((uni) => (
            <TableRow
              key={uni.universityId}
              className='group h-[72px] border-slate-50 transition-all duration-200 hover:bg-slate-50/80'
            >
              <TableCell className='pl-8 text-[13px] font-medium text-slate-400'>
                <span className='rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold'>
                  {uni.code}
                </span>
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-3'>
                  {uni.logoUrl && (
                    <img
                      src={uni.logoUrl}
                      alt={uni.name}
                      className='h-8 w-8 rounded-lg border border-slate-100 bg-slate-50 object-contain p-1'
                    />
                  )}
                  <span className='text-[15px] leading-tight font-bold text-slate-800'>
                    {uni.name}
                  </span>
                </div>
              </TableCell>
              <TableCell className='hidden max-w-md truncate text-[14px] font-medium text-slate-600 lg:table-cell'>
                {uni.address}
              </TableCell>
              <TableCell className='pr-8 text-right'>
                <div className='flex justify-end transition-opacity duration-200 group-hover:opacity-100 sm:opacity-0'>
                  <UniversitiesAction university={uni} />
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
