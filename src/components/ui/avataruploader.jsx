'use client';

import { PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';

import { UI_TEXT } from '@/lib/UI_Text';
import { useToast } from '@/providers/ToastProvider';
import { resolveResourceUrl } from '@/utils/resolveUrl';

export default function AvatarUploader({
  value,
  onChange,
  size = 116,
  fullName,
  disabled = false,
}) {
  const toast = useToast();

  const getInitials = (name) => {
    if (!name) return '';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  const beforeUpload = (file) => {
    const isImage = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'image/gif',
    ].includes(file.type);

    if (!isImage) {
      toast.error('Only JPG, PNG, WebP, SVG, GIF formats are supported');
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

  const displayImage =
    value instanceof File ? URL.createObjectURL(value) : resolveResourceUrl(value);

  const content = (
    <div
      className={`group relative flex items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-slate-200 ${!disabled && 'cursor-pointer hover:border-red-400'}`}
      style={{ width: size, height: size }}
    >
      {displayImage ? (
        <>
          <img
            src={displayImage}
            alt="avatar"
            className="h-full w-full object-cover"
            draggable={false}
          />
          {!disabled && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <PlusOutlined className="text-xl" />
              <span className="mt-1 text-xs font-semibold">{UI_TEXT.UPLOADER.EDIT_AVATAR}</span>
            </div>
          )}
        </>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center text-slate-500">
          {fullName ? (
            <>
              <span className="text-4xl font-bold text-slate-700">{getInitials(fullName)}</span>
              {!disabled && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <PlusOutlined className="text-xl" />
                  <span className="mt-1 text-xs font-semibold">{UI_TEXT.COMMON.UPLOAD}</span>
                </div>
              )}
            </>
          ) : (
            <>
              <PlusOutlined className="mb-1 text-2xl" />
              <span className="text-xs font-medium">{UI_TEXT.COMMON.UPLOAD}</span>
            </>
          )}
        </div>
      )}
    </div>
  );

  if (disabled) return content;

  return (
    <ImgCrop rotationSlider aspect={1}>
      <Upload showUploadList={false} beforeUpload={beforeUpload}>
        {content}
      </Upload>
    </ImgCrop>
  );
}
