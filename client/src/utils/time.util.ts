export function getDurationString(from: Date, to: Date = new Date()): string {
  const duration = Math.floor((to.getTime() - from.getTime()) / 1000);
  const str = `${Math.floor(duration / 3600)
  .toString()
  .padStart(2, '0')}:${Math.floor((duration % 3600) / 60)
  .toString()
  .padStart(2, '0')}:${(duration % 60).toString().padStart(2, '0')}`;
  if (str.startsWith('00:')) {
    return str.slice(3);
  }
  return str;
}
