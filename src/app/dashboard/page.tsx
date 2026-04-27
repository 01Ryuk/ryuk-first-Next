import { auth } from "@/src/lib/auth"; 
import DashboardClientPage from "./dashboard-client"; 
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }
  // If session exists, render the client component with session data
  return <DashboardClientPage session={session} />;
}