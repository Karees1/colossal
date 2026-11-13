// Formats a KES amount for display: "KSh 4,500" — no decimals, thousands separator.
export function fmtKES(n) {
  const value = typeof n === 'string' ? parseFloat(n.replace(/[^0-9.-]/g, '')) : n;
  if (typeof value !== 'number' || Number.isNaN(value)) return 'KSh 0';
  return `KSh ${Math.round(value).toLocaleString('en-KE')}`;
}
