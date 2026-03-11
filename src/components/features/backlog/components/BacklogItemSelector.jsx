import React from 'react';

function FieldLabel({ required, children }) {
  return (
    <div className='mb-2 text-sm font-semibold text-text'>
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
  return (
    <div className='w-[60%] flex flex-col min-h-[400px] max-h-[500px]'>
      <div className='flex items-center justify-between mb-2'>
        <FieldLabel>Chọn Issue vào Sprint ({selectedItemIds.length})</FieldLabel>
        <select
          value={selectedEpicId}
          onChange={(e) => setSelectedEpicId(e.target.value)}
          className='h-9 rounded-[10px] border border-red-800/40 bg-white px-3 py-1 text-sm font-medium outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 cursor-pointer max-w-[300px] truncate shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all hover:border-red-800/60'
        >
          <option value='' disabled hidden>
            Chọn một Epic...
          </option>
          {allEpics.map((epic) => (
            <option
              key={epic.id}
              value={epic.id}
              title={epic.name || epic.title || 'Unknown'}
            >
              {epic.name || epic.title || 'Unknown Epic'}
            </option>
          ))}
        </select>
      </div>

      <div className='flex-1 overflow-y-auto border border-border/60 rounded-xl bg-white shadow-sm'>
        {loadingItems ? (
          <div className='p-6 text-center text-sm text-slate-500'>
            Đang tải danh sách...
          </div>
        ) : !selectedEpicId ? (
          <div className='p-6 text-center text-sm text-slate-500'>
            Vui lòng chọn một Epic để hiển thị danh sách Issue.
          </div>
        ) : filteredItems.length === 0 ? (
          <div className='p-6 text-center text-sm text-slate-500'>
            Không có Issue nào trong Epic này.
          </div>
        ) : (
          <div className='divide-y divide-border/20'>
            {/* Select All Header */}
            <label className='flex items-center px-4 py-3 hover:bg-gray-50/80 transition-colors sticky top-0 z-10 border-b border-border/40 cursor-pointer backdrop-blur-md bg-white/95'>
              <input
                type='checkbox'
                className='mr-4 rounded border-gray-300 w-4 h-4 cursor-pointer text-primary focus:ring-primary'
                checked={isAllFilteredSelected}
                onChange={toggleAll}
              />
              <span className='text-[14px] font-bold text-gray-800 tracking-wide'>
                Chọn tất cả
              </span>
            </label>

            {/* Item List */}
            {filteredItems.map((it, idx) => (
              <label
                key={it._id}
                className='flex items-start px-4 py-4 hover:bg-gray-50/50 cursor-pointer transition-colors group'
              >
                <input
                  type='checkbox'
                  className='mt-1 mr-4 rounded border-gray-300 w-4 h-4 cursor-pointer text-primary focus:ring-primary'
                  checked={selectedItemIds.includes(it._id)}
                  onChange={() => toggleSelection(it._id)}
                />
                <div className='min-w-0 flex-1 flex flex-col gap-2'>
                  <div className='flex items-center gap-3'>
                    <span className='text-[12px] font-bold text-gray-400 shrink-0 uppercase tracking-wider'>
                      {it.key || `ISSUE-${idx + 1}`}
                    </span>
                    <span
                      className='text-[14px] font-semibold text-text truncate transition-colors'
                      dangerouslySetInnerHTML={{
                        __html: it.title || it.name || 'Untitled Issue',
                      }}
                    />
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='inline-flex items-center justify-center px-2 py-0.5 rounded border border-purple-200 text-purple-600 bg-purple-50 text-[11px] font-semibold truncate'>
                      {it.epicName || 'Epic'}
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
