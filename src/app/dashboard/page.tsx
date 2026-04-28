import { auth } from "@/src/lib/auth"; 
import DashboardClientPage from "./dashboard-client"; 
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

 
  return <DashboardClientPage session={session!} />;
}