import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import UserButton from "@/modules/authentication/components/user-button";
import { currentUser } from "@/modules/authentication/actions";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSideBar } from "./app-sidebar";
import { StickyBanner } from "@/components/ui/sticky-banner";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const user = await currentUser();

  return (
    <SidebarProvider>
      <AppSideBar />

      <main className="mr-2 w-full">
        <div className="border-sidebar-border bg-sidebar mt-2 flex items-center gap-2 rounded-sm border p-2 px-4 shadow">
          <StickyBanner className="rounded-md bg-[#17B100]">
            <p className="max-w-[90%] text-sm text-white drop-shadow-md">
              Currently on GrowBit v1.0 —{" "}
              <span className="cursor-pointer transition hover:underline">
                New tools dropping soon
              </span>
            </p>
          </StickyBanner>

          <div className="ml-auto">{user && <UserButton user={user} />}</div>
        </div>

        <div className="border-sidebar-border bg-sidebar mt-2 h-[calc(100vh-6.2rem)] overflow-y-auto rounded-sm border p-4 shadow">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
