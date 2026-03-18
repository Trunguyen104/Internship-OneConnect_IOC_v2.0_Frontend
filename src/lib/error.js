export function getErrorMessage(err) {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (err?.data?.message) return String(err.data.message);
  if (err?.message) return String(err.message);
  try {
    return JSON.stringify(err);
  } catch {
    return 'Unknown error';
  }
}

