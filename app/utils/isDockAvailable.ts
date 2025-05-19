export function isDockAvailable(available: number, total: number): boolean {
  return available > 0 && available <= total;
}
