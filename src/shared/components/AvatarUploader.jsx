'use client';

import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useToast } from '@/providers/ToastProvider';

// bắt lỗi trước khi cho edit
export default function AvatarUploader({ value, onChange, size = 116, fullName }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const getInitials = (name) => {
    if (!name) return '';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  const beforeUpload = (file) => {
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isImage) {
      toast.error('Chỉ hỗ trợ JPG / PNG');
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      toast.error('Ảnh phải nhỏ hơn 2MB');
      return false;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onload = () => {
      onChange?.(reader.result);
      setLoading(false);

      toast.success('Cập nhật avatar thành công');
    };

    reader.readAsDataURL(file);
    return false;
  };

  return (
    <ImgCrop rotationSlider>
      <Upload showUploadList={false} beforeUpload={beforeUpload}>
        <div
          className='group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-slate-200 hover:border-red-400'
          style={{ width: size, height: size }}
        >
          {value ? (
            <>
              <img
                src={value}
                alt='avatar'
                className='h-full w-full object-cover'
                draggable={false}
              />
              <div className='absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100'>
                <PlusOutlined className='text-xl' />
                <span className='mt-1 text-xs font-semibold'>Sửa ảnh</span>
              </div>
            </>
          ) : (
            <div className='flex h-full w-full flex-col items-center justify-center text-slate-500'>
              {loading ? (
                <LoadingOutlined className='text-3xl' />
              ) : fullName ? (
                <>
                  <span className='text-4xl font-bold text-slate-700'>{getInitials(fullName)}</span>
                  <div className='absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100'>
                    <PlusOutlined className='text-xl' />
                    <span className='mt-1 text-xs font-semibold'>Tải lên</span>
                  </div>
                </>
              ) : (
                <>
                  <PlusOutlined className='mb-1 text-2xl' />
                  <span className='text-xs font-medium'>Tải lên</span>
                </>
              )}
            </div>
          )}
        </div>
      </Upload>
    </ImgCrop>
  );
}
