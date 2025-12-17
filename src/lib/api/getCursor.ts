export function getCursor(searchParams: URLSearchParams) {
  const cursor = searchParams.get("cursor");
  return cursor && cursor.length > 0 ? cursor : undefined;
}
