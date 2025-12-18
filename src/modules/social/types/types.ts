export type User = {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  isFollowing: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  nextCursor: string | null;
};
