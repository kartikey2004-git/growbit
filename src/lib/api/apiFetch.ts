export async function apiFetch<T>(
  input: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  });

  if (!res.ok) {
    let message = "Request failed";

    try {
      const error = await res.json();
      message = error.message ?? message;
    } catch {}

    throw new Error(message);
  }

  return res.json();
}
