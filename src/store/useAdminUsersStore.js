'use client';

import { useSyncExternalStore } from 'react';

const store = {
  state: {
    refreshCount: 0,
    users: [],
    totalCount: 0,
    currentFilter: {
      role: 'all',
    },
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

export function useAdminUsersStore(selector = (s) => s) {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => store.state,
    () => store.state
  );
  return selector(snapshot);
}

useAdminUsersStore.setUsers = (users, totalCount = 0) =>
  setState((s) => ({ ...s, users, totalCount }));
useAdminUsersStore.increment = () => setState((s) => ({ ...s, refreshCount: s.refreshCount + 1 }));
useAdminUsersStore.setFilter = (filter) =>
  setState((s) => ({ ...s, currentFilter: { ...s.currentFilter, ...filter } }));
