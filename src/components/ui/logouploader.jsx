import { DeleteOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { useState } from 'react';

import { cn } from '@/lib/cn';
import { useToast } from '@/providers/ToastProvider';
import { mediaService } from '@/services/media.service';

export default function LogoUploader({
  value,
  onChange,
  size = 120,
  label = 'Logo',
  folder = 'General',
}) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const beforeUpload = async (file) => {
    const isImage = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type);
    if (!isImage) {
      toast.error('Supported formats: JPG, PNG, WEBP, SVG');
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      toast.error('Image must be less than 5MB');
      return false;
    }

    setLoading(true);
    try {
      const response = await mediaService.uploadImage(file, folder);
      if (response.success) {
        onChange?.(response.data); // URL returned from server
        toast.success(`Upload ${label} successfully`);
      } else {
        toast.error(response.message || 'Upload failed');
      }
    } catch (error) {
      toast.error(error.message || 'Server connection error');
    } finally {
      setLoading(false);
    }

    return false; // Prevent Ant Design default upload
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange?.('');
  };

  return (
    <div className="flex flex-col gap-2">
      <Upload showUploadList={false} beforeUpload={beforeUpload}>
        <div
          className={cn(
            'group hover:border-primary/50 relative flex cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:bg-slate-100',
            value && 'border-solid border-slate-100 bg-white shadow-sm'
          )}
          style={{ width: size, height: size }}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <LoadingOutlined className="text-2xl" />
              <span className="text-[10px] font-bold tracking-widest uppercase">Loading</span>
            </div>
          ) : value ? (
            <>
              <img
                src={value}
                alt={label}
                className="h-full w-full object-contain p-3"
                draggable={false}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg transition-transform active:scale-90">
                    <PlusOutlined />
                  </div>
                  <button
                    onClick={handleRemove}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg transition-transform hover:bg-rose-600 active:scale-90"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-white shadow-sm">
                <PlusOutlined className="text-lg" />
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase">
                Upload {label}
              </span>
            </div>
          )}
        </div>
      </Upload>
    </div>
  );
}
