'use client';

import { ChevronDown } from 'lucide-react';
import React from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Dropdown } from '@/components/ui/dropdown';
import { BACKLOG_UI } from '@/constants/backlog/uiText';
import { UI_TEXT } from '@/lib/UI_Text';

function FieldLabel({ required, children }) {
  return (
    <div className="text-text mb-2 text-sm font-semibold text-gray-800">
      {children}
      {required ? <span className="text-primary"> {UI_TEXT.COMMON.ASTERISK}</span> : null}
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
      <div className="max-w-[320px] truncate py-1 text-sm font-medium">
        {epic.name || epic.title || BACKLOG_UI.UNKNOWN_EPIC}
      </div>
    ),
    onClick: () => setSelectedEpicId(epic.id),
  }));

  return (
    <div className="flex w-full flex-col">
      <div className="mb-2 flex items-center justify-between gap-4">
        <div className="shrink-0">
          <FieldLabel>
            {BACKLOG_UI.SELECT_ISSUE_SPRINT} {UI_TEXT.COMMON.OPEN_PAREN}
            {selectedItemIds.length}
            {UI_TEXT.COMMON.CLOSE_PAREN}
          </FieldLabel>
        </div>

        <Dropdown
          menu={{
            items: menuItems,
            selectable: true,
            selectedKeys: [selectedEpicId],
          }}
        >
          <div className="border-border/60 hover:border-primary/60 flex h-10 w-full min-w-[200px] max-w-[280px] cursor-pointer items-center justify-between rounded-xl border bg-white px-4 transition-all hover:shadow-sm active:scale-[0.98]">
            <span
              className={`truncate text-sm font-bold ${
                selectedEpicId ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              {currentEpic ? currentEpic.name || currentEpic.title : BACKLOG_UI.SELECT_AN_EPIC}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
          </div>
        </Dropdown>
      </div>

      <div className="border-border/60 min-h-[350px] max-h-[450px] flex-1 overflow-y-auto rounded-xl border bg-white shadow-sm">
        {loadingItems ? (
          <div className="text-muted p-6 text-center text-sm">{BACKLOG_UI.LOADING_LIST}</div>
        ) : !selectedEpicId ? (
          <div className="text-muted p-6 text-center text-sm">{BACKLOG_UI.SELECT_EPIC_PROMPT}</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-muted p-6 text-center text-sm">{BACKLOG_UI.EMPTY_ISSUES}</div>
        ) : (
          <div className="divide-border/20 divide-y">
            {/* Select All Header */}
            <div className="border-border/40 sticky top-0 z-10 flex items-center border-b bg-white/95 px-4 py-3 backdrop-blur-md transition-colors hover:bg-gray-50/80">
              <Checkbox checked={isAllFilteredSelected} onChange={toggleAll} className="mr-2">
                <span className="text-[14px] font-bold tracking-wide text-gray-800">
                  {BACKLOG_UI.SELECT_ALL}
                </span>
              </Checkbox>
            </div>

            {/* Item List */}
            {filteredItems.map((it, idx) => (
              <div
                key={it._id}
                className="group flex items-start px-4 py-4 transition-colors hover:bg-gray-50/50"
              >
                <Checkbox
                  checked={selectedItemIds.includes(it._id)}
                  onChange={() => toggleSelection(it._id)}
                  className="mt-1 mr-2"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 text-[12px] font-bold tracking-wider text-gray-400 uppercase">
                      {it.key || `ISSUE-${idx + 1}`}
                    </span>
                    <span
                      className="text-text truncate text-[14px] font-semibold transition-colors"
                      dangerouslySetInnerHTML={{
                        __html: it.title || it.name || 'Untitled Issue',
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center truncate rounded border border-purple-200 bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-600">
                      {it.epicName || BACKLOG_UI.TYPE_EPIC}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
