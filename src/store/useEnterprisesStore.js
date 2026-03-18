'use client';

import { useSyncExternalStore } from 'react';

const store = {
  state: {
    refreshCount: 0,
    enterprises: [],
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

export function useEnterprisesStore(selector = (s) => s) {
  return useSyncExternalStore(subscribe, () => selector(store.state), () => selector(store.state));
}

useEnterprisesStore.setEnterprises = (enterprises, totalCount = 0) =>
  setState((s) => ({ ...s, enterprises, totalCount }));
useEnterprisesStore.increment = () => setState((s) => ({ ...s, refreshCount: s.refreshCount + 1 }));
