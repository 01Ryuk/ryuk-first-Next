import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import LoginClientPage from "./loginclient";
import DashboardClientPage from "../../dashboard/dashboard-client";

export default async function LoginPage() {
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });
  //     return <DashboardClientPage session={session!} />;

  // no session check needed — proxy handles it
  return <LoginClientPage />;
}
