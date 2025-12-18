export type FeedItem = {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  habit: {
    id: string;
    name: string;
    frequency: "DAILY" | "WEEKLY";
  };
  checkedInAt: string; // ISO
  currentStreak: number;
};

export type FeedResponse = {
  data: FeedItem[];
  nextCursor: string | null;
};
