'use client';

import { MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import React from 'react';

import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { Dropdown } from '@/components/ui/dropdown';
import { BACKLOG_UI } from '@/constants/backlog/uiText';

export function EpicSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  epics,
  selectedEpicId,
  setSelectedEpicId,
  setOpenCreateEpic,
  setOpenUpdateEpic,
  setSelectedEpic,
  handleDeleteEpic,
}) {
  if (!isSidebarOpen) {
    return (
      <div className="flex h-full w-12 shrink-0 flex-col items-center rounded-3xl border border-gray-200 bg-white py-6 shadow-sm transition-all duration-300">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex h-full w-full flex-col items-center justify-center text-gray-500 hover:text-gray-900"
        >
          <span
            className="text-sm font-bold tracking-[0.3em] uppercase"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {BACKLOG_UI.TYPE_EPIC}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-[260px] shrink-0 flex-col overflow-y-auto rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-[15px] font-bold text-gray-900">{BACKLOG_UI.TYPE_EPIC}</div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-primary text-xs font-bold hover:underline"
          >
            {BACKLOG_UI.HIDE}
          </button>
          <button
            onClick={() => setOpenCreateEpic(true)}
            className="bg-primary hover:bg-primary-hover flex h-[22px] w-[22px] items-center justify-center rounded-full text-white transition-colors"
            title={BACKLOG_UI.CREATE_EPIC}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <button
          onClick={() => setSelectedEpicId('ALL')}
          className={`rounded-2xl px-4 py-2.5 text-left text-[14px] font-semibold transition-colors ${
            selectedEpicId === 'ALL'
              ? 'bg-primary-50 text-primary'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          {BACKLOG_UI.ALL}
        </button>

        {epics.map((epic) => (
          <div key={epic.id} className="group relative">
            <button
              onClick={() => setSelectedEpicId(epic.id)}
              className={`w-full rounded-2xl px-4 py-2.5 text-left text-[14px] font-semibold transition-colors ${
                selectedEpicId === epic.id
                  ? 'bg-primary-50 text-primary'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="truncate pr-6">{epic.title || epic.name || 'Untitled Epic'}</div>
            </button>

            {/* More Menu using Dropdown wrapper */}
            <div className="absolute top-1/2 right-2 -translate-y-1/2">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'edit',
                      label: (
                        <div className="flex items-center gap-2 py-1">
                          <Pencil className="text-primary h-3.5 w-3.5" />
                          <span>{BACKLOG_UI.UPDATE || 'Edit'}</span>
                        </div>
                      ),
                      onClick: (e) => {
                        e.domEvent.stopPropagation();
                        setSelectedEpic(epic);
                        setOpenUpdateEpic(true);
                      },
                    },
                    {
                      key: 'delete',
                      label: (
                        <div className="flex items-center gap-2 py-1 text-primary">
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>{BACKLOG_UI.DELETE || 'Delete'}</span>
                        </div>
                      ),
                      onClick: (e) => {
                        e.domEvent.stopPropagation();
                        showDeleteConfirm({
                          title: 'Delete Epic',
                          content:
                            'Are you sure you want to delete this epic? This action cannot be undone.',
                          onOk: () => handleDeleteEpic(epic.id),
                          okText: BACKLOG_UI.DELETE || 'Delete',
                          cancelText: BACKLOG_UI.CANCEL || 'Cancel',
                        });
                      },
                    },
                  ],
                }}
              >
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </Dropdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
