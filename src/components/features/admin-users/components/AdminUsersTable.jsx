'use client';

import Card from '@/components/ui/card';
import AppTable from '@/components/ui/apptable';
import Pagination from '@/components/ui/pagination';

import { useAdminUsersContext } from '../context/AdminUsersContext';

export default function AdminUsersTable() {
  const {
    items,
    loading,
    columns,
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    total,
    handleTableChange,
  } = useAdminUsersContext();

  return (
    <Card className='min-h-0'>
      <Card.Content>
        <AppTable
          columns={columns}
          data={items}
          loading={loading}
          rowKey='userId'
          pagination={{
            current: pageNumber,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          emptyText='No admin users'
        />
      </Card.Content>

      <Card.Footer className='border-t border-slate-200 pt-4'>
        <Pagination
          total={total}
          page={pageNumber}
          pageSize={pageSize}
          onPageChange={(p) => setPageNumber(p)}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPageNumber(1);
          }}
        />
      </Card.Footer>
    </Card>
  );
}
