'use client';

import { useState, useMemo, useEffect } from 'react';

export default function CompleteSprintModal({ open, sprint, sprints, onClose, onSubmit }) {
    const [moveOption, setMoveOption] = useState('backlog'); // Mặc định chọn Backlog cho an toàn
    const [selectedNextSprintId, setSelectedNextSprintId] = useState('');
    const [newSprintName, setNewSprintName] = useState('');

    const sprintItems = sprint?.items || [];
    const undoneItems = sprintItems.filter((it) => {
        const status = (it.status?.name || it.status || '').toUpperCase();
        return !['DONE', 'COMPLETED', 'CLOSED'].includes(status);
    });

    // SỬA LỖI: Lọc Sprint dự kiến (Chấp nhận cả khi status bị null/undefined như trong log của bạn)
    const futureSprints = useMemo(() => {
        return (sprints || []).filter(
            (s) => s.sprintId !== sprint?.sprintId && (!s.status || s.status.toUpperCase() === 'PLANNED'),
        );
    }, [sprints, sprint]);

    // Tự động gán ID sprint kế tiếp nếu có
    useEffect(() => {
        if (futureSprints.length > 0) {
            setSelectedNextSprintId(futureSprints[0].sprintId);
        }
    }, [futureSprints]);

    if (!open) return null;

    const handleSubmit = () => {
        let option = 'ToBacklog';
        let targetId = null;

        if (moveOption === 'next') {
            option = 'ToNextPlannedSprint';
            targetId = selectedNextSprintId;
        } else if (moveOption === 'new') {
            option = 'CreateNewSprint';
        }

        // Gửi đúng 3 trường Backend cần để xử lý logic "quăng" issue
        onSubmit?.({
            incompleteItemsOption: option,
            targetSprintId: targetId,
            newSprintName: moveOption === 'new' ? newSprintName : '',
        });
    };

    return (
        <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40'>
            <div className='relative w-full max-w-[500px] rounded-3xl bg-white shadow-2xl p-8 flex flex-col'>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>Hoàn thành {sprint?.name}</h2>
                <p className='text-sm text-gray-500 mb-6 font-medium'>
                    Có {undoneItems.length} issue chưa xong sẽ được di chuyển:
                </p>

                <div className='space-y-4 mb-8'>
                    {/* 1. Quăng ra Backlog */}
                    <label className='flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-transparent hover:bg-gray-50 transition-colors'>
                        <input
                            type='radio'
                            checked={moveOption === 'backlog'}
                            onChange={() => setMoveOption('backlog')}
                            className='w-4 h-4 text-[#A32A2A] focus:ring-[#A32A2A]'
                        />
                        <span className='text-sm font-semibold text-gray-700'>Product Backlog</span>
                    </label>

                    {/* 2. Quăng sang Sprint kế tiếp */}
                    <div className='space-y-2'>
                        <label className='flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-transparent hover:bg-gray-50 transition-colors'>
                            <input
                                type='radio'
                                checked={moveOption === 'next'}
                                onChange={() => setMoveOption('next')}
                                className='w-4 h-4 text-[#A32A2A] focus:ring-[#A32A2A]'
                            />
                            <span className='text-sm font-semibold text-gray-700'>Sprint kế tiếp</span>
                        </label>
                        {moveOption === 'next' && (
                            <div className='ml-9 animate-in slide-in-from-left-2'>
                                <select
                                    value={selectedNextSprintId}
                                    onChange={(e) => setSelectedNextSprintId(e.target.value)}
                                    className='w-full h-10 px-3 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-red-800 transition-all'
                                >
                                    {futureSprints.map((s) => (
                                        <option key={s.sprintId} value={s.sprintId}>
                                            {s.name || s.title}
                                        </option>
                                    ))}
                                    {futureSprints.length === 0 && <option value=''>Không có sprint dự kiến</option>}
                                </select>
                            </div>
                        )}
                    </div>
                    {/* 3. Quăng vô Sprint mới tạo */}
                    {/* 3. Quăng vô Sprint mới tạo */}
                    <div className='space-y-2'>
                        <label className='flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-transparent hover:bg-gray-50 transition-colors'>
                            <input
                                type='radio'
                                checked={moveOption === 'new'}
                                onChange={() => setMoveOption('new')}
                                className='w-4 h-4 text-[#A32A2A] focus:ring-[#A32A2A]'
                            />
                            <span className='text-sm font-semibold text-gray-700'>Tạo Sprint mới</span>
                        </label>
                        {moveOption === 'new' && (
                            <div className='ml-9 animate-in slide-in-from-left-2'>
                                <input
                                    type='text'
                                    placeholder='Nhập tên sprint mới...'
                                    value={newSprintName}
                                    onChange={(e) => setNewSprintName(e.target.value)}
                                    className='w-full h-10 px-4 rounded-xl border border-red-100 bg-red-50/20 text-sm focus:ring-2 focus:ring-red-100 outline-none'
                                    autoFocus
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className='flex justify-end gap-3 pt-6 border-t border-gray-100'>
                    <button
                        onClick={onClose}
                        className='h-11 px-6 rounded-full font-bold text-gray-500 hover:bg-gray-100'
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={moveOption === 'new' && !newSprintName.trim()}
                        className='h-11 px-8 rounded-full bg-[#A32A2A] font-bold text-white hover:bg-red-800 shadow-lg disabled:opacity-50'
                    >
                        Hoàn thành Sprint
                    </button>
                </div>
            </div>
        </div>
    );
}