import { Drawer } from 'antd';
import PropTypes from 'prop-types';
import { useState } from 'react';

import { UI_TEXT } from '@/lib/UI_Text';

import EnterprisesForm from './EnterprisesForm';

export default function EnterprisesDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  controlled = false,
  enterprise = null,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlled ? controlledOpen : internalOpen;
  const setOpen = controlled ? setControlledOpen : setInternalOpen;
  const isEdit = !!enterprise;

  return (
    <Drawer
      title={
        <div className="flex flex-col gap-1">
          <span className="text-lg font-black tracking-tight text-slate-900">
            {isEdit ? UI_TEXT.ENTERPRISES.EDIT_ENTERPRISE : UI_TEXT.ENTERPRISES.ADD_ENTERPRISE}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {isEdit
              ? `Edit enterprise profile for ${enterprise?.name || 'enterprise'}.`
              : 'Add a new enterprise to the ecosystem.'}
          </span>
        </div>
      }
      open={open}
      onClose={() => setOpen(false)}
      size={560}
      styles={{
        header: { borderBottom: '1px solid #f8fafc', padding: '24px' },
        body: { padding: '24px' },
      }}
      footer={null}
      destroyOnClose
    >
      <EnterprisesForm
        enterprise={enterprise}
        onSuccess={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </Drawer>
  );
}

EnterprisesDialog.propTypes = {
  /** If the dialog is open. */
  open: PropTypes.bool,
  /** Callback when open state changes. */
  onOpenChange: PropTypes.func,
  /** If true, the trigger button is hidden and state is fully managed by parent. */
  controlled: PropTypes.bool,
  /** Data of the enterprise to edit; triggers edit mode if present. */
  enterprise: PropTypes.object,
};
