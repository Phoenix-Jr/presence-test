import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatDate(iso: string, pattern = "MMM d, yyyy") {
  return format(parseISO(iso), pattern);
}

export function formatRelative(iso: string) {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true });
}

export function formatPercent(value: number, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

/** Returns "↑ +3.2%" or "↓ -1.1%" for trend display */
export function formatTrend(delta: number) {
  const sign = delta >= 0 ? "+" : "";
  const arrow = delta >= 0 ? "↑" : "↓";
  return `${arrow} ${sign}${delta.toFixed(1)}%`;
}

export function isTrendPositive(delta: number) {
  return delta >= 0;
}
