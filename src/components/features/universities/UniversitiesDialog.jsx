import { Drawer } from 'antd';
import PropTypes from 'prop-types';
import { useState } from 'react';

import { UI_TEXT } from '@/lib/UI_Text';

import UniversitiesForm from './UniversitiesForm';

export default function UniversitiesDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  controlled = false,
  university = null,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlled ? controlledOpen : internalOpen;
  const setOpen = controlled ? setControlledOpen : setInternalOpen;
  const isEdit = !!university;

  return (
    <Drawer
      title={
        <div className="flex flex-col gap-1">
          <span className="text-lg font-black tracking-tight text-slate-900">
            {isEdit ? UI_TEXT.UNIVERSITIES.UPDATE : UI_TEXT.UNIVERSITIES.CREATE}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {isEdit
              ? `Editing profile for ${university?.name || 'university'}.`
              : 'Add a new educational partner to the ecosystem.'}
          </span>
        </div>
      }
      open={open}
      onClose={() => setOpen(false)}
      width={560}
      headerStyle={{ borderBottom: '1px solid #f8fafc', padding: '24px' }}
      bodyStyle={{ padding: '24px' }}
      footer={null}
      destroyOnClose
    >
      <UniversitiesForm
        university={university}
        onSuccess={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </Drawer>
  );
}

UniversitiesDialog.propTypes = {
  /** Controlled open state. */
  open: PropTypes.bool,
  /** Callback for open state changes. */
  onOpenChange: PropTypes.func,
  /** If true, the trigger button is hidden. */
  controlled: PropTypes.bool,
  /** University data if in edit mode. */
  university: PropTypes.object,
};
