export function cn(...values) {
  const classes = [];

  for (const v of values) {
    if (!v) continue;
    if (typeof v === 'string') {
      classes.push(v);
      continue;
    }
    if (Array.isArray(v)) {
      classes.push(cn(...v));
      continue;
    }
    if (typeof v === 'object') {
      // Support `{ "class-name": condition }` style.
      for (const [k, ok] of Object.entries(v)) {
        if (ok) classes.push(k);
      }
    }
  }

  return classes.filter(Boolean).join(' ');
}

