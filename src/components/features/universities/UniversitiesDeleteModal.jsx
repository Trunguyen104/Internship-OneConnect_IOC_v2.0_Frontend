'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import CompoundModal from '@/components/ui/CompoundModal';
import { Spinner } from '@/components/ui/spinner';
import { UI_TEXT } from '@/lib/UI_Text';
import { useToast } from '@/providers/ToastProvider';
import { universityService } from '@/services/university.service';
import { useUniversitiesStore } from '@/store/useUniversitiesStore';

export default function UniversitiesDeleteModal({ university, open, onOpenChange }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await universityService.delete(university.universityId);
      useUniversitiesStore.increment();
      toast.success(UI_TEXT.COMMON.DELETE_SUCCESS);
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || UI_TEXT.COMMON.ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CompoundModal open={open} onCancel={() => onOpenChange(false)} width={440}>
      <CompoundModal.Header
        title={UI_TEXT.COMMON.DELETE_CONFIRM}
        subtitle={`${UI_TEXT.UNIVERSITIES.DELETE_HINT}`}
      />

      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-500 shadow-inner ring-1 ring-rose-100 transition-all duration-500 hover:rotate-6 hover:scale-110">
          <Trash2 className="size-10" />
        </div>
        <h3 className="mt-6 text-xl font-black tracking-tight text-text">
          {UI_TEXT.UNIVERSITIES.DELETE_SURE}
        </h3>
        <p className="mt-2 max-w-[280px] text-sm font-bold leading-relaxed text-muted/60">
          {UI_TEXT.UNIVERSITIES.DELETE_WARN_PREFIX}{' '}
          <span className="text-rose-500">{university?.name}</span>.
        </p>
      </div>

      <div className="flex gap-3 px-6 pb-6">
        <Button
          variant="ghost"
          className="h-12 flex-1 rounded-full font-black uppercase tracking-widest text-[11px] text-muted transition-all hover:bg-gray-100"
          onClick={() => onOpenChange(false)}
        >
          {UI_TEXT.BUTTON.CANCEL}
        </Button>
        <Button
          className="h-12 flex-1 rounded-full bg-rose-500/90 font-black uppercase tracking-widest text-[11px] text-white shadow-lg transition-all hover:bg-rose-500 active:scale-95 disabled:opacity-50"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? <Spinner className="size-4" /> : UI_TEXT.BUTTON.DELETE || 'Delete'}
        </Button>
      </div>
    </CompoundModal>
  );
}
