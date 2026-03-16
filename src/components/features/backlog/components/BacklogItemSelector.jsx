import React from 'react';
import { Dropdown } from 'antd';
import { ChevronDown } from 'lucide-react';
import { BACKLOG_UI } from '@/constants/backlog/uiText';

function FieldLabel({ required, children }) {
  return (
    <div className='text-text mb-2 text-sm font-semibold'>
      {children}
      {required ? <span className='text-primary'> *</span> : null}
    </div>
  );
}

export function BacklogItemSelector({
  allEpics,
  selectedEpicId,
  setSelectedEpicId,
  loadingItems,
  filteredItems,
  selectedItemIds,
  toggleSelection,
  toggleAll,
  isAllFilteredSelected,
}) {
  const currentEpic = allEpics.find((e) => e.id === selectedEpicId);

  const menuItems = allEpics.map((epic) => ({
    key: epic.id,
    label: (
      <div className='max-w-[320px] truncate py-1 text-sm font-medium'>
        {epic.name || epic.title || 'Unknown Epic'}
      </div>
    ),
    onClick: () => setSelectedEpicId(epic.id),
  }));

  return (
    <div className='flex max-h-[500px] min-h-[400px] w-[60%] flex-col'>
      <div className='mb-2 flex items-center justify-between'>
        <FieldLabel>
          {BACKLOG_UI.SELECT_ISSUE_SPRINT} ({selectedItemIds.length})
        </FieldLabel>

        <Dropdown
          menu={{
            items: menuItems,
            selectable: true,
            selectedKeys: [selectedEpicId],
          }}
          trigger={['click']}
          placement='bottomRight'
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          <div className='border-border/60 hover:border-primary/60 flex h-10 w-full max-w-[280px] cursor-pointer items-center justify-between rounded-xl border bg-white px-4 transition-all hover:shadow-sm active:scale-[0.98]'>
            <span
              className={`truncate text-sm font-bold ${
                selectedEpicId ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              {currentEpic ? currentEpic.name || currentEpic.title : BACKLOG_UI.SELECT_AN_EPIC}
            </span>
            <ChevronDown className='ml-2 h-4 w-4 shrink-0 text-gray-400' />
          </div>
        </Dropdown>
      </div>

      <div className='border-border/60 flex-1 overflow-y-auto rounded-xl border bg-white shadow-sm'>
        {loadingItems ? (
          <div className='text-muted p-6 text-center text-sm'>{BACKLOG_UI.LOADING_LIST}</div>
        ) : !selectedEpicId ? (
          <div className='text-muted p-6 text-center text-sm'>{BACKLOG_UI.SELECT_EPIC_PROMPT}</div>
        ) : filteredItems.length === 0 ? (
          <div className='text-muted p-6 text-center text-sm'>{BACKLOG_UI.EMPTY_ISSUES}</div>
        ) : (
          <div className='divide-border/20 divide-y'>
            {/* Select All Header */}
            <label className='border-border/40 sticky top-0 z-10 flex cursor-pointer items-center border-b bg-white/95 px-4 py-3 backdrop-blur-md transition-colors hover:bg-gray-50/80'>
              <input
                type='checkbox'
                className='text-primary focus:ring-primary mr-4 h-4 w-4 cursor-pointer rounded border-gray-300'
                checked={isAllFilteredSelected}
                onChange={toggleAll}
              />
              <span className='text-[14px] font-bold tracking-wide text-gray-800'>
                {BACKLOG_UI.SELECT_ALL}
              </span>
            </label>

            {/* Item List */}
            {filteredItems.map((it, idx) => (
              <label
                key={it._id}
                className='group flex cursor-pointer items-start px-4 py-4 transition-colors hover:bg-gray-50/50'
              >
                <input
                  type='checkbox'
                  className='text-primary focus:ring-primary mt-1 mr-4 h-4 w-4 cursor-pointer rounded border-gray-300'
                  checked={selectedItemIds.includes(it._id)}
                  onChange={() => toggleSelection(it._id)}
                />
                <div className='flex min-w-0 flex-1 flex-col gap-2'>
                  <div className='flex items-center gap-3'>
                    <span className='shrink-0 text-[12px] font-bold tracking-wider text-gray-400 uppercase'>
                      {it.key || `ISSUE-${idx + 1}`}
                    </span>
                    <span
                      className='text-text truncate text-[14px] font-semibold transition-colors'
                      dangerouslySetInnerHTML={{
                        __html: it.title || it.name || 'Untitled Issue',
                      }}
                    />
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='inline-flex items-center justify-center truncate rounded border border-purple-200 bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-600'>
                      {it.epicName || BACKLOG_UI.TYPE_EPIC}
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
