'use client';

import { Modal as AntdModal } from 'antd';
import React from 'react';

/**
 * Custom Modal bọc từ Ant Design, sử dụng cho dự án.
 * Tự động bo góc 24px (Rounded-3xl) và căn giữa màn hình.
 */
export const Modal = ({ children, ...props }) => {
  return (
    <AntdModal
      centered={true}
      destroyOnHidden={true}
      mask={{ closable: false }}
      width={props.width || 600}
      footer={null} // Thường Modal trong dự án tự định nghĩa Footer bên trong Children
      {...props}
    >
      <div className="pt-2">{children}</div>
    </AntdModal>
  );
};

export default Modal;
