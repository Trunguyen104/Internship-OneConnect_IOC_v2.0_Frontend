'use client';

import { useState } from 'react';
import { Edit3, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip } from 'antd';
import { useToast } from '@/providers/ToastProvider';
import { enterpriseService } from '@/services/enterprise.service';
import { useEnterprisesStore } from '@/store/useEnterprisesStore';
import EnterprisesDialog from './EnterprisesDialog';

export default function EnterprisesAction({ enterprise }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Confirm removal of ${enterprise.name}? This action cannot be reverted.`)) return;

    setLoading(true);
    try {
      await enterpriseService.delete(enterprise.enterpriseId || enterprise.id);
      useEnterprisesStore.increment();
      toast.success('Successfully removed partner');
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Removal process failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-end gap-1.5'>
      {enterprise.website && (
        <Tooltip title='Mở trang web'>
          <Button
            variant='ghost' size='icon'
            className='h-10 w-10 rounded-full text-slate-400 hover:bg-slate-100 hover:text-primary transition-all'
            onClick={() => window.open(enterprise.website, '_blank')}
          >
            <ExternalLink className='h-4 w-4' />
          </Button>
        </Tooltip>
      )}

      <Tooltip title='Chỉnh sửa hồ sơ'>
        <Button
          variant='ghost' size='icon'
          className='h-10 w-10 rounded-full text-slate-500 hover:bg-slate-100 hover:text-primary transition-all'
          onClick={() => setOpenEdit(true)}
        >
          <Edit3 className='h-4 w-4' />
        </Button>
      </Tooltip>

      <Tooltip title='Xóa doanh nghiệp'>
        <Button
          variant='ghost' size='icon'
          className='h-10 w-10 rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95'
          onClick={handleDelete}
          disabled={loading}
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </Tooltip>

      {openEdit && (
        <EnterprisesDialog
          open={openEdit}
          onOpenChange={setOpenEdit}
          enterprise={enterprise}
          controlled
        />
      )}
    </div>
  );
}
