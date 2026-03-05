'use client';
import PageShell from '@/shared/components/PageShell';
import { useEffect, useMemo, useState } from 'react';
import StudentTabs from '@/shared/components/StudentTabs';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { productBacklogService } from '@/services/productbacklog.service';
import { ProjectService } from '@/services/projectService';
import { useToast } from '@/providers/ToastProvider';

const COLUMNS = [
  { id: 'Todo', title: 'To Do', underline: 'bg-gray-700' },
  { id: 'InProgress', title: 'In Progress', underline: 'bg-blue-600' },
  { id: 'Review', title: 'In Review', underline: 'bg-yellow-500' },
  { id: 'Done', title: 'Done', underline: 'bg-green-500' },
];

export default function BoardPage() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const toast = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // 1. Fetch Project ID
  useEffect(() => {
    const fetchProjectId = async () => {
      try {
        const res = await ProjectService.getAll({ PageNumber: 1, PageSize: 1 });
        if (res?.data?.items?.length > 0) {
          setProjectId(res.data.items[0].projectId);
        }
      } catch {
        toast.error('Không lấy được project');
      }
    };
    fetchProjectId();
  }, [toast]);

  // 2. Fetch Tasks
  useEffect(() => {
    if (!projectId) return;
    const fetchSprints = async () => {
      try {
        const sprintsRes = await productBacklogService.getWorkItemsBacklog(projectId);
        let sprintsData = sprintsRes?.data?.sprints || [];
        const activeSprint = sprintsData.find((s) => s.status?.toUpperCase() === 'ACTIVE') || sprintsData[0];

        if (activeSprint) {
          const itemsToMap = activeSprint.featureWorkItems || activeSprint.items || [];
          const mappedItems = itemsToMap.map((it, idx) => ({
            id: it.workItemId || it.id,
            displayId: it.key || `ISSUE-${idx + 1}`,
            title: it.title || it.name,
            type: it.type || 'UserStory',
            tag: it.type || 'Task',
            priority: it.priority || 'MEDIUM',
            points: it.storyPoint || 0,
            assignee: it.assigneeName || '—',
            status: it.status ? it.status : 'Todo',
          }));
          setItems(mappedItems);
        }
      } catch (err) {
        toast.error('Lỗi khi tải dữ liệu');
      }
    };
    fetchSprints();
  }, [projectId, toast]);

  // Logic phân loại task theo cột
  const byColumn = useMemo(() => {
    const map = Object.fromEntries(COLUMNS.map((c) => [c.id, []]));
    items.forEach((it) => {
      if (map[it.status]) map[it.status].push(it);
    });
    return map;
  }, [items]);

  // --- HANDLERS ---

  function onDragStart(event) {
    setActiveId(event.active.id);
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Tìm task đang kéo
    const activeTask = items.find((i) => i.id === activeId);
    if (!activeTask) return;

    // Xác định cột mục tiêu
    const isOverAColumn = COLUMNS.some((col) => col.id === overId);
    const overColumnId = isOverAColumn
      ? overId
      : items.find((i) => i.id === overId)?.status;

    if (!overColumnId || overColumnId === activeTask.status) return;

    // Cập nhật state ngay để người dùng thấy card nhảy sang cột mới
    setItems((prev) =>
      prev.map((item) =>
        item.id === activeId ? { ...item, status: overColumnId } : item
      )
    );
  }

  // Xử lý khi buông chuột (Lưu vào Database)
  async function onDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Lấy task hiện tại sau khi đã được cập nhật status bởi onDragOver
    const currentTask = items.find((i) => i.id === activeId);
    if (!currentTask) return;

    // --- BẮT ĐẦU GỌI API ---
    try {
      console.log("Đang gọi API cập nhật cho Task:", activeId, "với status:", currentTask.status);

      // 1. Lấy dữ liệu gốc từ server để đảm bảo payload đầy đủ
      const taskRes = await productBacklogService.getWorkItemById(projectId, activeId);

      if (taskRes && taskRes.data) {
        const d = taskRes.data;

        // 2. Gửi request update với status mới
        const payload = {
          title: d.title,
          description: d.description || '',
          type: d.type || 'UserStory',
          status: currentTask.status, // Đây là giá trị quan trọng nhất để không bị reset khi F5
          priority: d.priority || 'MEDIUM',
          parentId: d.parentId || null,
          assigneeId: d.assigneeId || null,
          storyPoint: d.storyPoint || 0,
        };

        const updateRes = await productBacklogService.updateWorkItem(projectId, activeId, payload);

        if (updateRes?.isSuccess || updateRes?.status === 200) {
          toast.success('Cập nhật trạng thái thành công');
        } else {
          throw new Error('Backend update failed');
        }
      }
    } catch (err) {
      console.error("Lỗi API:", err);
      toast.error('Lỗi kết nối server, trạng thái chưa được lưu!');
      // Tùy chọn: Refresh lại dữ liệu từ server để card quay về chỗ cũ nếu lỗi
    }
  }

  const activeTask = useMemo(() => items.find((it) => it.id === activeId), [activeId, items]);

  return (
    <PageShell>
      <div className='flex flex-col gap-4 mb-4'>
        <StudentTabs />
        <div className='flex items-center gap-2'>
          <div className='w-full max-w-sm border rounded-full px-4 py-2 bg-surface'>
            <input
              placeholder="Search tasks..."
              className='bg-transparent outline-none w-full'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-x-auto pb-4'>
          {COLUMNS.map((col) => (
            <BoardColumn
              key={col.id}
              column={col}
              tasks={byColumn[col.id].filter(t => t.title.toLowerCase().includes(query.toLowerCase()))}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{
          duration: 250,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}>
          {activeTask ? <IssueCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </PageShell>
  );
}

// --- SUB-COMPONENTS ---

function BoardColumn({ column, tasks }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className='flex flex-col min-w-[280px]'>
      <div className='flex items-center gap-2 mb-3'>
        <span className='font-bold'>{column.title}</span>
        <span className='text-xs bg-gray-200 px-2 py-0.5 rounded-full'>{tasks.length}</span>
      </div>
      <div className={`h-1 w-full ${column.underline} mb-4 rounded-full`} />

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-3 p-2 min-h-[500px] transition-colors rounded-xl ${isOver ? 'bg-gray-100/50' : 'bg-transparent'
          }`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((t) => (
            <SortableIssueCard key={t.id} task={t} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

function SortableIssueCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
      <IssueCard task={task} />
    </div>
  );
}

function IssueCard({ task, isOverlay }) {
  return (
    <div className={`bg-white border p-4 rounded-xl shadow-sm min-h-[150px] flex flex-col gap-2 ${isOverlay ? 'cursor-grabbing border-blue-500' : 'cursor-grab'}`}>
      <div className='flex justify-between items-start'>
        <span className='text-[10px] font-bold uppercase text-gray-400'>{task.type}</span>
        <div className={`w-2 h-2 rounded-full ${task.priority === 'HIGH' ? 'bg-red-500' : 'bg-blue-400'}`} />
      </div>
      <div className='text-sm font-bold text-blue-600'>{task.displayId}</div>
      <div className='text-sm font-medium line-clamp-2' dangerouslySetInnerHTML={{ __html: task.title }} />
      <div className='mt-auto flex justify-between items-center pt-2'>
        <div className='flex gap-1'>
          {task.points > 0 && <span className='text-[10px] border px-1.5 rounded bg-gray-50'>{task.points}</span>}
        </div>
        <div className='w-6 h-6 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold'>
          {task.assignee.charAt(0)}
        </div>
      </div>
    </div>
  );
}