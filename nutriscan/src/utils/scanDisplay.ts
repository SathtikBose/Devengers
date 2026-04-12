/**
 * Shared formatting / grouping for scan lists (dashboard, history).
 */
export function formatScanTime(iso: string) {
  try {
    const d = new Date(iso);
    const now = new Date();
    const sameDay =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();
    const time = d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    if (sameDay) return `Today, ${time}`;
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear();
    if (isYesterday) return `Yesterday, ${time}`;
    return `${d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })}, ${time}`;
  } catch {
    return "";
  }
}

/** Maps AI recommendation text to history filter chips (SAFE / MODERATE / AVOID). */
export function normalizeHistoryStatus(recommendation: string): string {
  const r = (recommendation || "").toUpperCase();
  if (/(SAFE|GOOD|EXCELLENT|OPTIMAL)/.test(r)) return "SAFE";
  if (/(AVOID|UNSAFE|DANGER|HIGH\s*RISK)/.test(r)) return "AVOID";
  return "MODERATE";
}

export function scanMatchesTimeFilter(
  createdAt: string,
  filter: "Today" | "This Week" | "All",
): boolean {
  if (filter === "All") return true;
  const d = new Date(createdAt).getTime();
  if (Number.isNaN(d)) return false;
  if (filter === "Today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return d >= start.getTime();
  }
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return d >= weekAgo;
}
