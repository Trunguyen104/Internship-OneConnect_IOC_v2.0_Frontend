import { useCreateSprint } from '../hooks/useCreateSprint';
import { BacklogItemSelector } from './BacklogItemSelector';

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
  const {
    sprintName,
    setSprintName,
    goal,
    setGoal,
    selectedEpicId,
    setSelectedEpicId,
    selectedItemIds,
    allEpics,
    loadingItems,
    filteredItems,
    isAllFilteredSelected,
    toggleSelection,
    toggleAll,
    reset,
    canSubmit,
  } = useCreateSprint(projectId, open);

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

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-9999 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 transition-opacity'>
      <div className='relative w-full max-w-[900px] rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col'>
        <div className='flex flex-col h-full max-h-[85vh]'>
          <div className='px-8 pt-8 pb-4 shrink-0 flex justify-center'>
            <div className='text-3xl font-bold text-text'>Tạo Sprint mới</div>
          </div>

          <div className='flex-1 flex flex-col overflow-y-auto px-8 py-2 space-y-6 pb-8'>
            <div className='flex flex-col md:flex-row gap-8'>
              <div className='w-[40%] flex flex-col space-y-6'>
                <div>
                  <FieldLabel required>Tên Sprint</FieldLabel>
                  <TextInput
                    value={sprintName}
                    onChange={setSprintName}
                    placeholder='Nhập tên Sprint'
                  />
                </div>

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

              <BacklogItemSelector
                allEpics={allEpics}
                selectedEpicId={selectedEpicId}
                setSelectedEpicId={setSelectedEpicId}
                loadingItems={loadingItems}
                filteredItems={filteredItems}
                selectedItemIds={selectedItemIds}
                toggleSelection={toggleSelection}
                toggleAll={toggleAll}
                isAllFilteredSelected={isAllFilteredSelected}
              />
            </div>
          </div>

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

