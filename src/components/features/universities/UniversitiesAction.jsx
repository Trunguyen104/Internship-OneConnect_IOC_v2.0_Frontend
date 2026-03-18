'use client';

import { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip } from 'antd';
import { useToast } from '@/providers/ToastProvider';
import { universityService } from '@/services/university.service';
import { useUniversitiesStore } from '@/store/useUniversitiesStore';
import UniversitiesDialog from './UniversitiesDialog';

export default function UniversitiesAction({ university }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${university.name}?`)) return;

    setLoading(true);
    try {
      await universityService.delete(university.universityId);
      useUniversitiesStore.increment();
      toast.success('Deleted university');
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-end gap-1'>
        <Tooltip title='Chỉnh sửa trường'>
          <Button
            variant='ghost'
            size='icon'
            className='h-9 w-9 rounded-full text-slate-500 hover:bg-slate-100/80 hover:text-primary transition-all'
            onClick={() => setOpenEdit(true)}
          >
            <Edit2 className='h-4 w-4' />
          </Button>
        </Tooltip>

        <Tooltip title='Xóa trường'>
          <Button
            variant='ghost'
            size='icon'
            className='h-9 w-9 rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95'
            onClick={handleDelete}
            disabled={loading}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </Tooltip>

      {openEdit && (
        <UniversitiesDialog
          open={openEdit}
          onOpenChange={setOpenEdit}
          university={university}
          controlled
        />
      )}
    </div>
  );
}
