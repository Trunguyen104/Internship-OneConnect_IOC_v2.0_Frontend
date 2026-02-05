'use client';

import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useToast } from '@/providers/ToastProvider';

// bắt lỗi trước khi cho edit
export default function AvatarUploader({ value, onChange, size = 116 }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

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
          className='flex cursor-pointer items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-slate-100 hover:border-red-400'
          style={{ width: size, height: size }}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt='avatar'
              className='h-full w-full object-cover'
              draggable={false}
            />
          ) : (
            <div className='flex flex-col items-center text-slate-500'>
              {loading ? <LoadingOutlined /> : <PlusOutlined />}
              <span className='mt-1 text-xs'>Tải lên</span>
            </div>
          )}
        </div>
      </Upload>
    </ImgCrop>
  );
}
