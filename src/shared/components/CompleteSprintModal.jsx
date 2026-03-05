'use client';

import { useState, useMemo } from 'react';

export default function CompleteSprintModal({ open, sprint, sprints, onClose, onSubmit }) {
    const [destination, setDestination] = useState('backlog');

    const doneStatuses = ['DONE', 'COMPLETED', 'CLOSED'];
    const sprintItems = sprint?.items || [];

    const doneItems = sprintItems.filter((it) => {
        const status = (it.status?.name || it.status || '').toUpperCase();
        return doneStatuses.includes(status);
    });
    const undoneItems = sprintItems.filter((it) => {
        const status = (it.status?.name || it.status || '').toUpperCase();
        return !doneStatuses.includes(status);
    });

    // Only planned sprints
    const futureSprints = (sprints || []).filter(
        (s) => s.sprintId !== sprint?.sprintId && s.status === 'PLANNED'
    );

    if (!open) return null;

    const handleSubmit = () => {
        onSubmit?.({
            destination: destination === 'backlog' ? null : destination,
            undoneItems: undoneItems,
        });
    };

    return (
        <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 transition-opacity'>
            <div className='relative w-full max-w-[600px] rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col'>
                <div className='flex flex-col h-full max-h-[85vh]'>
                    {/* Header */}
                    <div className='px-8 pt-8 pb-4 shrink-0'>
                        <div className='text-3xl font-bold text-gray-900'>Hoàn thành Sprint</div>
                        <div className='text-sm text-gray-500 mt-2 font-medium'>
                            Sprint {sprint?.name || sprint?.title || ''}
                        </div>
                    </div>

                    {/* Body */}
                    <div className='flex-1 flex flex-col overflow-y-auto px-8 py-2 space-y-6 pb-8'>
                        <div className='flex gap-4'>
                            <div className='flex-1 p-6 rounded-2xl bg-green-50/50 border border-green-100 flex flex-col justify-center text-center'>
                                <div className='text-3xl font-bold text-green-600 mb-1'>{doneItems.length}</div>
                                <div className='text-sm font-semibold text-green-700/80 uppercase tracking-wider'>Issue Hoàn thành</div>
                            </div>
                            <div className='flex-1 p-6 rounded-2xl bg-orange-50/50 border border-orange-100 flex flex-col justify-center text-center'>
                                <div className='text-3xl font-bold text-orange-600 mb-1'>{undoneItems.length}</div>
                                <div className='text-sm font-semibold text-orange-700/80 uppercase tracking-wider'>Issue Chưa xong</div>
                            </div>
                        </div>

                        {undoneItems.length > 0 && (
                            <div className='pt-2'>
                                <div className='mb-2 text-sm font-semibold text-gray-800'>Chuyển các issue chưa xong sang:</div>
                                <select
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className='h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 shadow-sm transition-shadow cursor-pointer'
                                >
                                    <option value='backlog'>Product Backlog</option>
                                    {futureSprints.map((s) => (
                                        <option key={s.sprintId} value={s.sprintId}>
                                            {s.name || s.title}
                                        </option>
                                    ))}
                                </select>
                                <div className='text-xs text-gray-400 mt-3 pl-1'>
                                    * Các issue hoàn thành sẽ giữ lại trong Sprint này để lưu trữ kết quả.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className='flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-8 py-5 shrink-0'>
                        <button
                            onClick={onClose}
                            className='h-11 px-6 rounded-full font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors'
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            className='h-11 px-8 rounded-full bg-[#A32A2A] font-bold text-white transition-opacity hover:bg-red-800 shadow-sm'
                        >
                            Hoàn thành
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
