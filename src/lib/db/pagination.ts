type CursorPaginationArgs<T> = {
  items: T[];
  limit: number;
  getCursor: (item: T) => string;
};

export function getNextCursor<T>({
  items,
  limit,
  getCursor,
}: CursorPaginationArgs<T>) {
  if (items.length < limit) return null;
  return getCursor(items[items.length - 1]);
}
