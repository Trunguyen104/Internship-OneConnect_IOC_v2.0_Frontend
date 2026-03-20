'use client';

import { PictureOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';

import { useToast } from '@/providers/ToastProvider';

export default function BannerUploader({ value, onChange }) {
  const toast = useToast();

  const beforeUpload = (file) => {
    const isImage =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
    if (!isImage) {
      toast.error('Only JPG / PNG / WEBP is supported');
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      toast.error('Image must be less than 5MB');
      return false;
    }

    onChange?.(file);
    return false;
  };

  const displayImage = value instanceof File ? URL.createObjectURL(value) : value;

  return (
    <ImgCrop rotationSlider aspect={4.5 / 1}>
      <Upload
        showUploadList={false}
        beforeUpload={beforeUpload}
        className="block w-full"
        style={{ width: '100%' }}
      >
        <div
          className="group hover:border-primary relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-100 transition-all duration-300"
          style={{ aspectRatio: '4.5 / 1', minHeight: '120px' }}
        >
          {displayImage ? (
            <div className="absolute inset-0">
              <img
                src={displayImage}
                alt="banner"
                className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-75"
                draggable={false}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <PlusOutlined className="text-3xl" />
                <span className="mt-2 text-sm font-bold tracking-wide uppercase">
                  Update Cover Photo
                </span>
              </div>
            </div>
          ) : (
            <div className="group-hover:text-primary flex h-full w-full flex-col items-center justify-center px-4 text-slate-400 transition-colors">
              <PictureOutlined className="mb-3 text-4xl opacity-40 transition-transform group-hover:scale-110" />
              <div className="text-center">
                <span className="block text-base font-bold">Upload Cover Banner</span>
                <span className="mt-1 block text-[11px] font-medium tracking-tighter uppercase opacity-60">
                  Recommended ratio 4.5:1
                </span>
              </div>
            </div>
          )}
        </div>
      </Upload>
    </ImgCrop>
  );
}
