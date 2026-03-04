'use client';

import { useMemo, useState, useEffect } from 'react';
import { productBacklogService } from '@/services/productbacklog.service';
import { useToast } from '@/providers/ToastProvider';

function FieldLabel({ required, children }) {
    return (
        <div className='mb-2 text-sm font-semibold text-text'>
            {children}
            {required ? <span className='text-primary'> *</span> : null}
        </div>
    );
}

function TextInput({ value, onChange, placeholder = '' }) {
    return (
        <input
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className='h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-primary'
        />
    );
}

export default function CreateSprintModal({ open, projectId, onClose, onSubmit }) {
    const [sprintName, setSprintName] = useState('');
    const [goal, setGoal] = useState('');

    const [backlogItems, setBacklogItems] = useState([]);
    const [allEpics, setAllEpics] = useState([]);
    const [selectedEpicId, setSelectedEpicId] = useState('');
    const [selectedItemIds, setSelectedItemIds] = useState([]);
    const [loadingItems, setLoadingItems] = useState(false);

    const toast = useToast();

    const canSubmit = useMemo(() => sprintName.trim() !== '', [sprintName]);

    useEffect(() => {
        if (open && projectId) {
            const fetchBacklog = async () => {
                try {
                    setLoadingItems(true);
                    const [resItems, resEpics] = await Promise.all([
                        productBacklogService.getWorkItemsBacklog(projectId),
                        productBacklogService.getEpics(projectId),
                    ]);

                    let itemsData = [];
                    if (resItems?.data?.productBacklog?.items) {
                        itemsData = resItems.data.productBacklog.items;
                    } else if (resItems?.data?.items) {
                        itemsData = resItems.data.items;
                    } else if (resItems?.data && Array.isArray(resItems.data)) {
                        itemsData = resItems.data;
                    } else if (Array.isArray(resItems)) {
                        itemsData = resItems;
                    }

                    let epicsData = [];
                    if (resEpics?.data?.items) {
                        epicsData = resEpics.data.items;
                    } else if (resEpics?.data && Array.isArray(resEpics.data)) {
                        epicsData = resEpics.data;
                    } else if (Array.isArray(resEpics)) {
                        epicsData = resEpics;
                    }

                    const epicMap = {};
                    epicsData.forEach((e) => {
                        epicMap[e.id] = e.name || e.title || 'Unknown Epic';
                    });

                    setAllEpics(epicsData);

                    const enhancedItems = itemsData.map((it) => ({
                        ...it,
                        epicName: it.parentId ? epicMap[it.parentId] : null,
                    }));

                    setBacklogItems(enhancedItems);
                } catch (error) {
                    console.error('Failed to fetch backlog items', error);
                    toast.error('Lỗi khi tải danh sách Product Backlog');
                } finally {
                    setLoadingItems(false);
                }
            };

            fetchBacklog();
        }
    }, [open, projectId, toast]);

    function reset() {
        setSprintName('');
        setGoal('');
        setSelectedItemIds([]);
        setSelectedEpicId('');
    }

    function handleClose() {
        onClose?.();
    }

    function handleSubmit() {
        if (!canSubmit) return;

        const payload = {
            name: sprintName.trim(),
        };
        if (goal) payload.goal = goal;
        if (selectedItemIds.length > 0) {
            payload.workItemIds = selectedItemIds;
        }

        onSubmit?.(payload);
        reset();
        onClose?.();
    }

    const filteredItems = useMemo(() => {
        if (!selectedEpicId) return [];
        return backlogItems.filter(it => it.parentId === selectedEpicId);
    }, [backlogItems, selectedEpicId]);

    const toggleSelection = (id) => {
        setSelectedItemIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (filteredItems.length === 0) return;

        // Check if all filtered items are already selected
        const allSelected = filteredItems.every(it => selectedItemIds.includes(it.id));

        if (allSelected) {
            // Remove all filtered items from selection
            const filteredIds = filteredItems.map(it => it.id);
            setSelectedItemIds(prev => prev.filter(id => !filteredIds.includes(id)));
        } else {
            // Add all filtered items to selection
            const newSelections = filteredItems.map(it => it.id).filter(id => !selectedItemIds.includes(id));
            setSelectedItemIds(prev => [...prev, ...newSelections]);
        }
    };

    const isAllFilteredSelected = filteredItems.length > 0 && filteredItems.every(it => selectedItemIds.includes(it.id));

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-9999 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 transition-opacity'>
            {/* modal */}
            <div className='relative w-full max-w-[900px] rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col'>
                <div className='flex flex-col h-full max-h-[85vh]'>
                    {/* Header */}
                    <div className='px-8 pt-8 pb-4 shrink-0 flex justify-center'>
                        <div className='text-3xl font-bold text-text'>Tạo Sprint mới</div>
                    </div>

                    {/* Body */}
                    <div className='flex-1 flex flex-col overflow-y-auto px-8 py-2 space-y-6 pb-8'>
                        <div className='flex flex-col md:flex-row gap-8'>
                            <div className='w-[40%] flex flex-col space-y-6'>
                                {/* Tên Sprint */}
                                <div>
                                    <FieldLabel required>Tên Sprint</FieldLabel>
                                    <TextInput
                                        value={sprintName}
                                        onChange={setSprintName}
                                        placeholder='Nhập tên Sprint'
                                    />
                                </div>

                                {/* Mục tiêu (Goal) */}
                                <div className='flex flex-col flex-1'>
                                    <FieldLabel>Mục tiêu Sprint</FieldLabel>
                                    <textarea
                                        value={goal}
                                        onChange={(e) => setGoal(e.target.value)}
                                        placeholder='Nhập mục tiêu Sprint (tùy chọn)'
                                        className='flex-1 min-h-[140px] w-full rounded-2xl border border-border bg-white p-4 text-sm outline-none focus:border-primary resize-none'
                                    />
                                </div>
                            </div>

                            {/* Danh sách Backlog Items */}
                            <div className='w-[60%] flex flex-col min-h-[400px] max-h-[500px]'>
                                <div className='flex items-center justify-between mb-2'>
                                    <FieldLabel>Chọn Issue vào Sprint ({selectedItemIds.length})</FieldLabel>
                                    <select
                                        value={selectedEpicId}
                                        onChange={(e) => setSelectedEpicId(e.target.value)}
                                        className='h-9 rounded-[10px] border border-red-800/40 bg-white px-3 py-1 text-sm font-medium outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 cursor-pointer max-w-[300px] truncate shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all hover:border-red-800/60'
                                    >
                                        <option value='' disabled hidden>Chọn một Epic...</option>
                                        {allEpics.map(epic => (
                                            <option key={epic.id} value={epic.id} title={epic.name || epic.title || 'Unknown'}>
                                                {epic.name || epic.title || 'Unknown Epic'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className='flex-1 overflow-y-auto border border-border/60 rounded-xl bg-white shadow-sm'>
                                    {loadingItems ? (
                                        <div className='p-6 text-center text-sm text-slate-500'>Đang tải danh sách...</div>
                                    ) : !selectedEpicId ? (
                                        <div className='p-6 text-center text-sm text-slate-500'>Vui lòng chọn một Epic để hiển thị danh sách Issue.</div>
                                    ) : filteredItems.length === 0 ? (
                                        <div className='p-6 text-center text-sm text-slate-500'>Không có Issue nào trong Epic này.</div>
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
                                                <label key={it.id} className='flex items-start px-4 py-4 hover:bg-gray-50/50 cursor-pointer transition-colors group'>
                                                    <input
                                                        type='checkbox'
                                                        className='mt-1 mr-4 rounded border-gray-300 w-4 h-4 cursor-pointer text-primary focus:ring-primary'
                                                        checked={selectedItemIds.includes(it.id)}
                                                        onChange={() => toggleSelection(it.id)}
                                                    />
                                                    <div className='min-w-0 flex-1 flex flex-col gap-2'>
                                                        <div className='flex items-center gap-3'>
                                                            <span className='text-[12px] font-bold text-gray-400 shrink-0 uppercase tracking-wider'>
                                                                {it.key || `ISSUE-${idx + 1}`}
                                                            </span>
                                                            <span
                                                                className='text-[14px] font-semibold text-text truncate transition-colors'
                                                                dangerouslySetInnerHTML={{ __html: it.title || it.name || 'Untitled Issue' }}
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
                        </div>
                    </div>

                    {/* Footer */}
                    <div className='flex items-center justify-between gap-4 border-t border-border/20 bg-white px-8 py-5 shrink-0'>
                        <button
                            type='button'
                            onClick={handleClose}
                            className='h-12 rounded-full px-10 font-bold text-[#b45656] bg-[#fdf5f5] hover:bg-[#faeae9] transition-colors'
                        >
                            Hủy
                        </button>
                        <button
                            type='button'
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            className='h-12 flex-1 max-w-[400px] ml-auto rounded-full bg-[#c28686] px-8 font-bold text-white transition-opacity disabled:opacity-50 hover:bg-[#b07373]'
                        >
                            Tạo Sprint
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
