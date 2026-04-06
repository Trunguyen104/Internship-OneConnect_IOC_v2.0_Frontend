'use client';

import { Dropdown } from 'antd';
import { MoreVertical } from 'lucide-react';
import React from 'react';

/**
 * Styling aligned with SuperAdmin User Management (UserManagementAction):
 * lucide MoreVertical trigger, slate hover, premium-dropdown menu, rich menu rows.
 */

const VARIANT = {
  primary: { box: 'bg-blue-50/50', iconWrap: '[&_.anticon]:text-blue-600' },
  warning: { box: 'bg-amber-50/50', iconWrap: '[&_.anticon]:text-amber-600' },
  danger: { box: 'bg-rose-50/50', iconWrap: '[&_.anticon]:text-rose-600' },
  success: { box: 'bg-emerald-50/50', iconWrap: '[&_.anticon]:text-emerald-600' },
  neutral: { box: 'bg-slate-50/50', iconWrap: '[&_.anticon]:text-slate-600' },
};

function resolveVariant(item) {
  if (item.danger) return 'danger';
  return item.variant || 'primary';
}

/**
 * Maps simple menu items { key, label (string), icon?, danger?, variant?, onClick?, disabled? }
 * to the same label layout as UserManagementAction (icon tile + bold text).
 * Pass enrich={false} on TableRowDropdown if items already use custom label nodes.
 */
export function enrichTableMenuItems(items = []) {
  return items.map((item) => {
    if (!item || item.type === 'divider') return item;

    const { key, label, icon, onClick, disabled } = item;

    if (label != null && typeof label !== 'string' && typeof label !== 'number') {
      return { ...item };
    }

    const variant = resolveVariant(item);
    const vs = VARIANT[variant] || VARIANT.primary;

    return {
      key,
      onClick,
      disabled,
      label: (
        <div className="flex items-center gap-4 pr-8">
          {icon ? (
            <div className={`rounded-xl p-2.5 ${vs.box}`}>
              <span
                className={`flex items-center justify-center text-base leading-none ${vs.iconWrap}`}
              >
                {icon}
              </span>
            </div>
          ) : null}
          <span
            className={`text-sm font-black tracking-tight ${
              variant === 'danger' ? 'text-rose-600' : 'text-slate-800'
            }`}
          >
            {label}
          </span>
        </div>
      ),
    };
  });
}

const TRIGGER_CLASS =
  'inline-flex h-8 w-8 items-center justify-center text-slate-400 transition-colors hover:text-slate-600';

/**
 * @param {object} props
 * @param {Array} props.items - antd menu items (string labels + optional icons recommended)
 * @param {object} [props.menuProps] - merged into `menu` (e.g. `{ onClick: ({ key }) => ... }`)
 * @param {boolean} [props.enrich=true] - run enrichTableMenuItems on items
 */
export default function TableRowDropdown({
  items = [],
  menuProps = {},
  enrich = true,
  ...dropdownProps
}) {
  const built = enrich ? enrichTableMenuItems(items) : items;

  return (
    <Dropdown
      menu={{ items: built, ...menuProps }}
      trigger={['click']}
      placement="bottomRight"
      classNames={{ root: 'premium-dropdown' }}
      {...dropdownProps}
    >
      <button type="button" className={TRIGGER_CLASS} aria-label="Row actions">
        <MoreVertical className="size-4" />
      </button>
    </Dropdown>
  );
}

/** Single icon affordance in a row (e.g. view-only), same 32×32 target as admin tables. */
export function TableRowIconButton({ icon, title, onClick, className = '' }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary ${className}`}
    >
      {icon}
    </button>
  );
}
