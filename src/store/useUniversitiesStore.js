'use client';

import { useSyncExternalStore } from 'react';

const store = {
  state: {
    refreshCount: 0,
    universities: [],
    totalCount: 0,
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

export function useUniversitiesStore(selector = (s) => s) {
  return useSyncExternalStore(
    subscribe,
    () => selector(store.state),
    () => selector(store.state),
  );
}

useUniversitiesStore.setUniversities = (universities, totalCount = 0) =>
  setState((s) => ({ ...s, universities, totalCount }));
useUniversitiesStore.increment = () =>
  setState((s) => ({ ...s, refreshCount: s.refreshCount + 1 }));
