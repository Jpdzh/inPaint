export function uuid() {
  return "_" + Math.random().toString(36).slice(2, 12);
}
