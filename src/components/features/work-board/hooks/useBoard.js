import { useMemo } from 'react';

import { useBoardActions } from './useBoardActions';
import { COLUMNS, useBoardData } from './useBoardData';
import { useBoardDnd } from './useBoardDnd';
import { useBoardUI } from './useBoardUI';

export { COLUMNS };

/**
 * Main Orchestrator Hook for Board
 */
export function useBoard() {
  // 1. Core Logic & Data
  const data = useBoardData();
  const { projectId, items, setItems, fetchBoardData } = data;

  // 2. UI State
  const ui = useBoardUI();

  // 3. Actions
  const actions = useBoardActions({ projectId, ui, fetchBoardData });

  // 4. Drag and Drop
  const dnd = useBoardDnd({
    projectId,
    items,
    setItems,
    fetchBoardData,
    setActiveId: ui.setActiveId,
  });

  // Derived: Active task for overlay
  const activeTask = useMemo(() => items.find((it) => it.id === ui.activeId), [ui.activeId, items]);

  return {
    ...data,
    ...ui,
    ...actions,
    ...dnd,
    activeTask,
  };
}
