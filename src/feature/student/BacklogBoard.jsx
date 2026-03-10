'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { Search, Filter, MoreVertical, Plus } from 'lucide-react';

import { productBacklogService } from '@/services/productbacklog.service';
import { ProjectService } from '@/services/projectService';
import { useToast } from '@/providers/ToastProvider';

import CreateTaskModal from '@/shared/components/CreateTaskModal';
import UpdateTaskModal from '@/shared/components/UpdateTaskModal';
import CreateEpicModal from '@/shared/components/CreateEpicModal';
import StartSprintModal from '@/shared/components/StartSprintModal';
import CompleteSprintModal from '@/shared/components/CompleteSprintModal';

// ---------------------------
// Helpers
// ---------------------------
const statusToneText = {
  TODO: 'text-gray-500',
  IN_PROGRESS: 'text-blue-500',
  IN_REVIEW: 'text-amber-500',
  DONE: 'text-green-500',
};

const stringToColorTuple = (str) => {
  let hash = 0;
  for (let i = 0; i < (str?.length || 0); i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return { bg: `hsl(${hue}, 70%, 90%)`, text: `hsl(${hue}, 70%, 30%)` };
};

// ---------------------------
// Work Item Component
// ---------------------------
function WorkItem({ it, itemOrder, onClick }) {
  const statusConfig = statusToneText[it.status?.toUpperCase()] || statusToneText.TODO;

  return (
    <div
      onClick={() => onClick?.(it)}
      className='flex items-center justify-between py-3 mb-2 bg-white group hover:bg-gray-50/50 rounded-xl border-b border-transparent hover:border-gray-100 transition-colors cursor-pointer'
    >
      <div className='w-4 h-4 rounded border border-gray-300 mr-4 shrink-0' />

      <div className='w-32 shrink-0 text-[13px] text-gray-900 font-medium whitespace-nowrap pl-1 tracking-wide'>
        Issue {itemOrder || '-'}
      </div>

      <div
        className='flex-1 min-w-0 text-[13.5px] text-gray-900 font-medium truncate pr-4'
        title={it.title || it.name}
      >
        {it.title || it.name}
      </div>

      <div className={`w-28 shrink-0 text-[13px] font-medium ${statusConfig}`}>
        {it.status === 'IN_PROGRESS'
          ? 'In Progress'
          : it.status === 'IN_REVIEW'
            ? 'In Review'
            : it.status === 'TODO'
              ? 'To Do'
              : it.status || 'To Do'}
      </div>

      <div className='w-44 shrink-0 px-2 flex justify-start'>
        {it.epicName ? (
          <span className='px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 truncate w-full text-center'>
            {it.epicName}
          </span>
        ) : (
          <span className='w-full'></span>
        )}
      </div>

      <div className='w-24 shrink-0 text-[13px] text-gray-500 text-center font-medium'>
        {it.dueDate ? new Date(it.dueDate).toLocaleDateString('vi-VN') : '-'}
      </div>

      <div className='w-10 shrink-0 text-[13px] text-blue-600 font-bold text-center'>
        {it.storyPoint || it.points || '-'}
      </div>

      <div
        className={`w-24 shrink-0 text-[13px] font-medium text-center ${it.priority?.toUpperCase() === 'HIGH' ? 'text-orange-500' : it.priority?.toUpperCase() === 'LOW' ? 'text-green-600' : 'text-blue-500'}`}
      >
        {it.priority === 'HIGH' ? 'High' : it.priority === 'LOW' ? 'Low' : 'Medium'}
      </div>

      <div className='w-12 shrink-0 flex justify-center'>
        <div
          className='h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold'
          style={{
            backgroundColor: stringToColorTuple(it.assigneeName || 'U').bg,
            color: stringToColorTuple(it.assigneeName || 'U').text,
          }}
        >
          {(it.assigneeName || '?').charAt(0).toUpperCase()}
        </div>
      </div>

      <div className='w-8 shrink-0 flex justify-center text-gray-400 opacity-50 hover:opacity-100 transition-opacity'>
        <MoreVertical className='w-4 h-4' />
      </div>
    </div>
  );
}

// ---------------------------
// Column Headers
// ---------------------------
function ColumnHeaders() {
  return (
    <div className='flex items-center justify-between py-2 mb-2 bg-gray-50/80 rounded-lg px-2 border-b border-gray-100/50'>
      <div className='w-4 mr-4 shrink-0' />
      <div className='w-32 shrink-0 text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1'>
        Issue
      </div>
      <div className='flex-1 min-w-0 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
        Summary
      </div>
      <div className='w-28 shrink-0 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
        Status
      </div>
      <div className='w-44 shrink-0 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center'>
        Epic
      </div>
      <div className='w-24 shrink-0 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center'>
        Due Date
      </div>
      <div className='w-10 shrink-0 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center'>
        Pts
      </div>
      <div className='w-24 shrink-0 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center'>
        Priority
      </div>
      <div className='w-12 shrink-0 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center'>
        User
      </div>
      <div className='w-8 shrink-0' />
    </div>
  );
}

// ---------------------------
// Main Board Component
// ---------------------------
export default function BacklogBoard() {
  const toast = useToast();
  const [projectId, setProjectId] = useState(null);
  const [activeSprintForTask, setActiveSprintForTask] = useState(null);
  // Data State
  const [epics, setEpics] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [backlogItems, setBacklogItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedEpicId, setSelectedEpicId] = useState('ALL');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Modal State
  const [openCreateEpic, setOpenCreateEpic] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openUpdateTask, setOpenUpdateTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openStartSprint, setOpenStartSprint] = useState(false);
  const [openCompleteSprint, setOpenCompleteSprint] = useState(false);
  const [selectedSprintAction, setSelectedSprintAction] = useState(null);

  const formatToDateOnly = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Trả về đúng định dạng YYYY-MM-DD
  };
  // Initialize Project
  useEffect(() => {
    const initProject = async () => {
      try {
        const res = await ProjectService.getAll({ PageNumber: 1, PageSize: 1 });
        if (res?.data?.items?.length > 0) {
          const id = res.data.items[0].projectId;
          setProjectId(id);
        }
      } catch {
        toast.error('Không lấy được project');
      }
    };
    initProject();
  }, [toast]);

  // Fetch Data
  const fetchData = useCallback(
    async (id, showLoading = true) => {
      if (!id) return;
      try {
        if (showLoading) setLoading(true);

        const [resEpics, resBacklog] = await Promise.all([
          productBacklogService.getEpics(id),
          productBacklogService.getWorkItemsBacklog(id),
        ]);

        // Parse Epics
        let epicsData = [];
        if (resEpics?.data?.items) epicsData = resEpics.data.items;
        else if (resEpics?.data) epicsData = resEpics.data;
        else if (Array.isArray(resEpics)) epicsData = resEpics;
        setEpics(Array.isArray(epicsData) ? epicsData : []);

        // Parse Sprint/Backlog
        if (resBacklog?.data) {
          setSprints(resBacklog.data.sprints || []);

          let bkItems = [];
          if (resBacklog.data.productBacklog?.items) {
            bkItems = resBacklog.data.productBacklog.items;
          } else if (resBacklog.data.items) {
            bkItems = resBacklog.data.items;
          }
          setBacklogItems(bkItems);
        }
      } catch (err) {
        console.error('Fetch Data failed:', err);
        toast.error('Lỗi khi tải dữ liệu Backlog Board');
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    fetchData(projectId);
  }, [projectId, fetchData]);

  // Derived Logic for Data mapping
  // Lấy tên Epic đính kèm vào Work Item
  const appendEpicName = (item) => {
    const found = epics.find((e) => e.id === item.parentId);
    return { ...item, epicName: found ? found.title || found.name : '' };
  };

  // Filter Logic (Apply to both sprints and backlog)
  const isSelectedEpic = (parentId) => selectedEpicId === 'ALL' || parentId === selectedEpicId;

  const filteredBacklogItems = useMemo(() => {
    return backlogItems.filter((it) => it && isSelectedEpic(it.parentId)).map(appendEpicName);
  }, [backlogItems, selectedEpicId, epics, appendEpicName, isSelectedEpic]);

  const filteredSprints = useMemo(() => {
    return sprints.map((sp) => ({
      ...sp,
      items: (sp.items || []).filter((it) => it && isSelectedEpic(it.parentId)).map(appendEpicName),
    }));
  }, [sprints, selectedEpicId, epics, appendEpicName, isSelectedEpic]);

  // Compute absolute creation order of all issues based on ID/CreatedAt
  const itemOrders = useMemo(() => {
    const allItems = [...backlogItems];
    sprints.forEach((sp) => {
      if (sp.items) allItems.push(...sp.items);
    });

    // Deduplicate
    const uniqueItemsMap = {};
    allItems.forEach((i) => {
      uniqueItemsMap[i.workItemId || i.id] = i;
    });
    const uniqueItems = Object.values(uniqueItemsMap);

    const sorted = uniqueItems.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeA && timeB && timeA !== timeB) return timeA - timeB;

      const idA = a.workItemId || a.id || '';
      const idB = b.workItemId || b.id || '';
      return idA.localeCompare(idB);
    });

    const map = {};
    sorted.forEach((item, idx) => {
      map[item.workItemId || item.id] = idx + 1;
    });
    return map;
  }, [backlogItems, sprints]);
  const handleDeleteSprint = async (sprintId) => {
    if (
      !window.confirm(
        'Bạn có chắc chắn muốn xóa Sprint này không? Các nhiệm vụ bên trong sẽ quay về Backlog.',
      )
    )
      return;

    try {
      // Giả sử service của bạn có hàm deleteSprint
      const res = await productBacklogService.deleteSprint(projectId, sprintId);

      if (res && res.isSuccess !== false) {
        toast.success('Xóa Sprint thành công');
        // Cập nhật lại state danh sách sprint ngay lập tức
        setSprints((prev) => prev.filter((s) => s.sprintId !== sprintId));
        fetchData(projectId, false); // Fetch lại để đồng bộ Backlog
      } else {
        toast.error(res.message || 'Không thể xóa Sprint');
      }
    } catch (err) {
      toast.error('Lỗi server khi xóa Sprint');
    }
  };
  const handleSprintActionClick = (sprint, isStart) => {
    setSelectedSprintAction(sprint);
    if (isStart) {
      setOpenStartSprint(true);
    } else {
      // Thay vì dùng window.confirm, ta mở Modal chuyên dụng
      setOpenCompleteSprint(true);
    }
  };

  const handleQuickCreateSprint = async () => {
    try {
      const sprintNum = sprints.length + 1;
      const payload = {
        name: `Sprint ${sprintNum}`,
        title: `Sprint ${sprintNum}`,
      };
      const res = await productBacklogService.createSprint(projectId, payload);
      if (res && res.isSuccess === false) {
        toast.error(res.message || 'Lỗi khi tạo Sprint');
      } else {
        toast.success('Đã tạo một Sprint mới');
        fetchData(projectId);
      }
    } catch {
      toast.error('Lỗi khi tạo Sprint');
    }
  };

  return (
    <div className='flex gap-6 w-full h-[calc(100vh-140px)] bg-slate-50 relative'>
      {/* Sidebar Epics */}
      {isSidebarOpen ? (
        <div className='w-[260px] shrink-0 bg-white border border-gray-200 shadow-sm rounded-3xl p-5 flex flex-col h-full overflow-y-auto transition-all duration-300'>
          <div className='flex justify-between items-center mb-6'>
            <div className='text-[15px] font-bold text-gray-900'>Epic</div>
            <div className='flex items-center gap-3'>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className='text-xs text-[#A32A2A] font-bold hover:underline'
              >
                Ẩn
              </button>
              <button
                onClick={() => setOpenCreateEpic(true)}
                className='w-[22px] h-[22px] rounded-full bg-[#A32A2A] text-white flex items-center justify-center hover:bg-red-800 transition-colors'
                title='Tạo Epic'
              >
                <Plus className='w-3.5 h-3.5' />
              </button>
            </div>
          </div>

          <div className='flex flex-col gap-1'>
            <button
              onClick={() => setSelectedEpicId('ALL')}
              className={`text-left px-4 py-2.5 rounded-2xl text-[14px] font-semibold transition-colors ${
                selectedEpicId === 'ALL'
                  ? 'bg-[#F4F0FF] text-[#6333FF]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Tất cả
            </button>

            {epics.map((epic) => (
              <button
                key={epic.id}
                onClick={() => setSelectedEpicId(epic.id)}
                className={`text-left px-4 py-2.5 rounded-2xl text-[14px] font-semibold transition-colors ${
                  selectedEpicId === epic.id
                    ? 'bg-[#F4F0FF] text-[#6333FF]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className='truncate'>{epic.title || epic.name || 'Untitled Epic'}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className='w-12 shrink-0 bg-white border border-gray-200 shadow-sm rounded-3xl flex flex-col items-center py-6 h-full transition-all duration-300'>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className='flex flex-col items-center justify-center text-gray-500 hover:text-gray-900 w-full h-full'
          >
            <span
              className='uppercase tracking-[0.3em] text-sm font-bold'
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              EPIC
            </span>
          </button>
        </div>
      )}

      {/* Main Board */}
      <div className='flex-1 flex flex-col min-w-0 overflow-y-auto pr-2 pb-10'>
        {/* Search / Filter Bar */}
        <div className='flex items-center gap-4 mb-6 sticky top-0 bg-slate-50 pt-1 z-10'>
          <div className='flex items-center w-[360px] h-10 px-4 rounded-full border border-gray-200 bg-white shadow-sm'>
            <Search className='w-4 h-4 text-gray-400 mr-2 shrink-0' />
            <input
              type='text'
              placeholder='Tìm kiếm'
              className='flex-1 outline-none text-sm bg-transparent placeholder-gray-400 text-gray-800'
            />
          </div>
          <button className='flex items-center gap-2 h-10 px-5 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700'>
            <Filter className='w-4 h-4 text-gray-500' />
            Bộ lọc
          </button>
        </div>

        {loading ? (
          <div className='text-center py-10 text-slate-500'>Đang tải dữ liệu...</div>
        ) : (
          <div className='overflow-x-auto pb-4'>
            <div className='min-w-[1000px] pr-2'>
              {/* SPRINTS */}
              {filteredSprints.map((sprint) => {
                return (
                  <div
                    key={sprint.sprintId}
                    className='rounded-3xl bg-white border border-gray-100 shadow-sm p-6 mb-6'
                  >
                    {/* Header */}
                    <div className='flex items-center mb-6 pl-2 pr-1'>
                      <div className='w-4 h-4 rounded border border-gray-300 mr-4 flex-shrink-0' />
                      <h3 className='text-[16px] font-bold text-gray-900'>
                        {sprint.name || sprint.title}
                      </h3>
                      <div className='flex-1' />

                      {/* Dynamic Start/Complete Sprint button based on status */}
                      {sprint.status?.toUpperCase() === 'ACTIVE' ||
                      sprint.status?.toUpperCase() === 'IN_PROGRESS' ? (
                        <button
                          onClick={() => handleSprintActionClick(sprint, false)}
                          className='h-[34px] px-5 border border-green-200 bg-green-50 rounded-full text-[13px] font-medium text-green-700 hover:bg-green-100 transition-colors flex items-center shadow-sm'
                        >
                          Hoàn thành Sprint
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSprintActionClick(sprint, true)}
                          className='h-[34px] px-5 border border-gray-200 bg-white rounded-full text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center shadow-sm'
                        >
                          Bắt đầu Sprint
                        </button>
                      )}

                      {/* Trong đoạn filteredSprints.map((sprint) => { ... }) */}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className='ml-3 p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-all outline-none 
      data-[state=open]:ring-2 data-[state=open]:ring-primary data-[state=open]:bg-gray-50'
                          >
                            <MoreVertical className='w-4 h-4' />
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align='end'
                          className='w-52 rounded-2xl shadow-xl border-gray-100 p-1'
                        >
                          {/* Nút Chỉnh sửa */}
                          <DropdownMenuItem
                            onClick={() => {
                              // Logic mở modal sửa sprint (ví dụ setOpenUpdateSprint(true))
                              setSelectedSprintAction(sprint);
                              console.log('Mở modal sửa cho sprint:', sprint.sprintId);
                            }}
                            className='flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl font-semibold text-gray-700 focus:bg-gray-50 transition-colors'
                          >
                            <Pencil className='w-4 h-4 text-blue-600' />
                            Chỉnh sửa Sprint
                          </DropdownMenuItem>

                          {/* Nút Xóa - Sử dụng màu danger từ file CSS của bạn */}
                          <DropdownMenuItem
                            onClick={() => handleDeleteSprint(sprint.sprintId)}
                            className='flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl font-semibold text-danger focus:text-danger focus:bg-red-50 transition-colors'
                          >
                            <Trash2 className='w-4 h-4 text-danger' />
                            Xóa Sprint
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* List Container */}
                    <ColumnHeaders />
                    <div className='min-h-[20px]'>
                      {(sprint.items || []).map((it) => (
                        <WorkItem
                          key={it.workItemId || it.id}
                          it={it}
                          itemOrder={itemOrders[it.workItemId || it.id]}
                          onClick={async (task) => {
                            try {
                              const res = await productBacklogService.getWorkItemById(
                                projectId,
                                task.workItemId || task.id,
                              );
                              setSelectedTask(res?.data ? { ...task, ...res.data } : task);
                            } catch (e) {
                              console.error(e);
                              setSelectedTask(task);
                            }
                            setOpenUpdateTask(true);
                          }}
                        />
                      ))}
                    </div>

                    {/* TẠO NHIỆM VỤ DƯỚI SPRINT */}
                    <div className='mt-4 flex items-center'>
                      {/* TẠO NHIỆM VỤ DƯỚI SPRINT */}
                      <button
                        onClick={() => {
                          setActiveSprintForTask(sprint.sprintId);
                          setOpenCreateTask(true);
                        }}
                        className='flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium
             bg-primary text-white hover:bg-primary-hover active:bg-primary-700'
                      >
                        <Plus className='w-4 h-4' />
                        <span>Tạo nhiệm vụ</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* BACKLOG (Unassigned) */}
              <div className='rounded-3xl bg-white border border-gray-100 shadow-sm p-6 mt-8'>
                <div className='flex items-center mb-6 pl-2 pr-1'>
                  <div className='w-4 h-4 rounded border border-gray-300 mr-4 flex-shrink-0' />
                  <h3 className='text-[16px] font-bold text-gray-900'>Backlog</h3>
                  <div className='flex-1' />
                  <div className='flex items-center gap-3'>
                    <button
                      onClick={handleQuickCreateSprint}
                      className='h-[34px] px-5 border border-gray-200 bg-white rounded-full text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm'
                    >
                      Tạo Sprint
                    </button>
                  </div>
                </div>

                <ColumnHeaders />
                <div className='min-h-[50px] mb-4'>
                  {filteredBacklogItems.map((it) => (
                    <WorkItem
                      key={it.workItemId || it.id}
                      it={it}
                      itemOrder={itemOrders[it.workItemId || it.id]}
                      onClick={async (task) => {
                        try {
                          const res = await productBacklogService.getWorkItemById(
                            projectId,
                            task.workItemId || task.id,
                          );
                          setSelectedTask(res?.data ? { ...task, ...res.data } : task);
                        } catch (e) {
                          console.error(e);
                          setSelectedTask(task);
                        }
                        setOpenUpdateTask(true);
                      }}
                    />
                  ))}
                </div>

                <div className='flex items-center gap-6 mt-4 pl-2'>
                  <button
                    onClick={() => {
                      setActiveSprintForTask(null); // Backlog thì để null
                      setOpenCreateTask(true);
                    }}
                    className='flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium
             bg-primary text-white hover:bg-primary-hover active:bg-primary-700'
                  >
                    <Plus className='w-4 h-4' />
                    Tạo nhiệm vụ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateEpicModal
        open={openCreateEpic}
        onClose={() => setOpenCreateEpic(false)}
        onSubmit={async (payload) => {
          try {
            const apiPayload = {
              title: payload.name,
              name: payload.name,
              description: payload.description,
              endDate: payload.endDate,
            };
            const res = await productBacklogService.createEpic(projectId, apiPayload);
            if (res && res.isSuccess === false) {
              toast.error('Lỗi khi tạo epic');
              return;
            }
            toast.success('Tạo Epic thành công');
            setOpenCreateEpic(false);
            if (res?.data) {
              setEpics((prev) => [...prev, res.data]);
            } else {
              fetchData(projectId);
            }
          } catch {
            toast.error('Lỗi mạng khi tạo Epic');
          }
        }}
      />

      <StartSprintModal
        open={openStartSprint}
        sprint={selectedSprintAction}
        issueCount={selectedSprintAction?.items?.length || 0}
        onClose={() => setOpenStartSprint(false)}
        onSubmit={async (payload) => {
          try {
            if (!selectedSprintAction) return;

            // Chuẩn bị payload khớp với DateOnly của Backend
            const startPayload = {
              startDate: formatToDateOnly(payload.startDate),
              endDate: formatToDateOnly(payload.endDate),
            };

            const resStart = await productBacklogService.startSprint(
              projectId,
              selectedSprintAction.sprintId,
              startPayload,
            );

            if (resStart && resStart.isSuccess !== false) {
              toast.success('Bắt đầu Sprint thành công');

              // Cập nhật State tại chỗ để nút đổi trạng thái ngay lập tức
              setSprints((prevSprints) =>
                prevSprints.map((s) =>
                  s.sprintId === selectedSprintAction.sprintId
                    ? { ...s, status: 'ACTIVE' } // Ép trạng thái thành ACTIVE để khớp điều kiện hiển thị
                    : s,
                ),
              );

              setOpenStartSprint(false);
              fetchData(projectId); // Đồng bộ lại với Server
            }
          } catch {
            toast.error('Lỗi khi bắt đầu Sprint');
          }
        }}
      />

      <CompleteSprintModal
        open={openCompleteSprint}
        sprint={selectedSprintAction}
        sprints={sprints}
        onClose={() => setOpenCompleteSprint(false)}
        onSubmit={async (payload) => {
          try {
            if (!selectedSprintAction) return;

            // Payload nhận từ Modal bao gồm:
            // incompleteItemsOption ("ToBacklog", "ToNextPlannedSprint", "CreateNewSprint")
            // targetSprintId (ID của sprint mới hoặc kế tiếp)
            // newSprintName (Tên sprint mới nếu chọn CreateNewSprint)

            const completePayload = {
              incompleteItemsOption: payload.incompleteItemsOption,
              targetSprintId: payload.targetSprintId,
              newSprintName: payload.newSprintName || '',
            };

            console.log('Payload gửi đi thực tế:', completePayload);

            const resComp = await productBacklogService.completeSprint(
              projectId,
              selectedSprintAction.sprintId,
              completePayload,
            );

            if (resComp && resComp.isSuccess === false) {
              return toast.error(resComp.message || 'Lỗi khi hoàn thành Sprint');
            }

            toast.success('Hoàn thành Sprint thành công');
            setOpenCompleteSprint(false);

            // 🔄 Cập nhật UI ngay lập tức (Optimistic Update)
            // 1. Chuyển các task chưa xong của sprint vừa đóng vào Backlog Items
            if (payload.incompleteItemsOption === 'ToBacklog') {
              const undoneItems = selectedSprintAction.items.filter((it) => {
                const status = (it.status?.name || it.status || '').toUpperCase();
                return !['DONE', 'COMPLETED', 'CLOSED'].includes(status);
              });

              setBacklogItems((prev) => [...prev, ...undoneItems]);
            }

            // 2. Loại bỏ Sprint vừa hoàn thành khỏi danh sách hiển thị
            setSprints((prev) => prev.filter((s) => s.sprintId !== selectedSprintAction.sprintId));

            // 3. Đồng bộ lại dữ liệu chuẩn từ Server sau 500ms
            setTimeout(() => {
              fetchData(projectId, false);
            }, 500);
          } catch (err) {
            console.error('COMPLETE ERROR:', err);
            toast.error('Lỗi server khi hoàn thành Sprint');
          }
        }}
      />
      <CreateTaskModal
        open={openCreateTask}
        epics={epics}
        sprints={sprints}
        // Truyền prop để modal có thể set mặc định nếu cần (tùy code modal của bạn)
        initialSprintId={activeSprintForTask}
        onClose={() => {
          setOpenCreateTask(false);
          setActiveSprintForTask(null);
        }}
        onSubmit={async (payload) => {
          try {
            const targetSprintId = payload.sprintId || activeSprintForTask;

            const apiPayload = {
              title: payload.summary,
              description: payload.description,
              type: payload.type,
              status: payload.status,
              priority: payload.priority,
              parentId: payload.epic || null,
              assigneeId: payload.assignee || null,
              dueDate: payload.dueDate,
              storyPoint: payload.points || 0,
              sprintId: targetSprintId || null,
            };

            // 1. IGNITION - CREATE
            const resCreate = await productBacklogService.createWorkItem(projectId, apiPayload);

            if (!resCreate || resCreate.isSuccess === false) {
              throw new Error('Create failed');
            }

            const newWorkItemId =
              typeof resCreate.data === 'string'
                ? resCreate.data
                : resCreate.data.workItemId || resCreate.data.id;

            // 3. BUILD OPTIMISTIC OBJECT
            const epicName = epics.find((e) => e.id === payload.epic)?.title || '';

            const optimisticItem = {
              ...apiPayload,
              workItemId: newWorkItemId,
              id: newWorkItemId,
              epicName,
              sprintId: targetSprintId || null,
            };

            // 4. KHÔNG BAO GIỜ setBacklogItems nếu có sprint
            if (targetSprintId) {
              setSprints((prev) =>
                prev.map((s) =>
                  s.sprintId === targetSprintId
                    ? {
                        ...s,
                        items: [...(s.items || []), optimisticItem],
                        itemCount: (s.itemCount || 0) + 1,
                      }
                    : s,
                ),
              );
            } else {
              setBacklogItems((prev) => [...prev, optimisticItem]);
            }

            toast.success(
              targetSprintId ? 'Tạo và găm vào Sprint thành công!' : 'Tạo nhiệm vụ thành công!',
            );

            setOpenCreateTask(false);
            setActiveSprintForTask(null);

            // Đồng bộ server sau 800ms (KHÔNG show loading)
            setTimeout(() => {
              fetchData(projectId, false);
            }, 800);
          } catch (error) {
            console.error('ANTIGRAVITY ERROR:', error);
            toast.error('Lỗi khi tạo nhiệm vụ');
          }
        }}
      />

      <UpdateTaskModal
        open={openUpdateTask}
        epics={epics}
        sprints={sprints}
        initialData={selectedTask}
        onClose={() => {
          setOpenUpdateTask(false);
          setSelectedTask(null);
        }}
        onSubmit={async (payload) => {
          try {
            const apiPayload = {
              title: payload.summary,
              description: payload.description,
              type: payload.type,
              status: payload.status,
              priority: payload.priority,
              parentId: payload.epic || null,
              assigneeId: payload.assignee || null,
              dueDate: payload.dueDate,
              storyPoint: payload.points || 0,
            };

            const currentSprintId = selectedTask?.sprintId;
            const newSprintId = payload.sprintId;
            const workItemId = payload.id;

            // 1. UPDATE CHI TIẾT
            const resUpdate = await productBacklogService.updateWorkItem(
              projectId,
              workItemId,
              apiPayload,
            );
            if (!resUpdate || resUpdate.isSuccess === false) {
              throw new Error('Update failed');
            }

            // 2. DI CHUYỂN SPRINT (NẾU CÓ THAY ĐỔI)
            if (currentSprintId !== newSprintId) {
              if (!newSprintId) {
                // Nếu sprintId mới không có, thì về backlog
                await productBacklogService.moveWorkItemToBacklog(projectId, workItemId);
              } else {
                await productBacklogService.moveWorkItemToSprint(
                  projectId,
                  workItemId,
                  newSprintId,
                );
              }
            }

            toast.success('Cập nhật nhiệm vụ thành công!');
            setOpenUpdateTask(false);
            setSelectedTask(null);

            // Đồng bộ danh sách
            fetchData(projectId, false);
          } catch (error) {
            console.error('UPDATE ERROR:', error);
            toast.error('Lỗi khi cập nhật nhiệm vụ');
          }
        }}
      />
    </div>
  );
}
