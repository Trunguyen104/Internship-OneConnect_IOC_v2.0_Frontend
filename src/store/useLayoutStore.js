'use client';

import { useSyncExternalStore } from 'react';

const store = {
  state: {
    isSidebarCollapsed: false,
  },
  listeners: new Set(),
};

function setState(updater) {
  const next =
    typeof updater === 'function' ? updater(store.state) : { ...store.state, ...updater };
  store.state = next;
  for (const l of store.listeners) l();
}

function subscribe(listener) {
  store.listeners.add(listener);
  return () => store.listeners.delete(listener);
}

export function useLayoutStore(selector = (s) => s) {
  return useSyncExternalStore(
    subscribe,
    () => selector(store.state),
    () => selector(store.state)
  );
}

useLayoutStore.setSidebarCollapsed = (collapsed) =>
  setState((s) => ({ ...s, isSidebarCollapsed: collapsed }));

useLayoutStore.toggleSidebar = () =>
  setState((s) => ({ ...s, isSidebarCollapsed: !s.isSidebarCollapsed }));
