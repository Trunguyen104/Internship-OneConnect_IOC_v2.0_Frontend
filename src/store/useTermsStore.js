'use client';

import { useSyncExternalStore } from 'react';

const store = {
  state: {
    refreshCount: 0,
    terms: [],
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

/**
 * useTermsStore - Standardized store for internship term management.
 * Follows the same pattern as user, university, and enterprise stores.
 */
export function useTermsStore(selector = (s) => s) {
  return useSyncExternalStore(
    subscribe,
    () => selector(store.state),
    () => selector(store.state)
  );
}

useTermsStore.setTerms = (terms, totalCount = 0) => setState((s) => ({ ...s, terms, totalCount }));

useTermsStore.increment = () => setState((s) => ({ ...s, refreshCount: s.refreshCount + 1 }));
