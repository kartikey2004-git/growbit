export type LeaderboardEntry = {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  bestStreak: number;
  rank: number;
};

export type LeaderboardResponse = {
  data: LeaderboardEntry[];
  currentUserRank: number | null;
};
