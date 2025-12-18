"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
};

export function FeedUser({ user }: Props) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage src={user.image || ""} />
        <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
      </Avatar>

      <div className="leading-tight min-w-0">
        <p className="text-sm font-medium truncate">{user.name ?? "Unknown"}</p>
        {user.username && (
          <p className="text-xs text-muted-foreground truncate">
            @{user.username}
          </p>
        )}
      </div>
    </div>
  );
}
