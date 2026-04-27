import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LoginClientPage from "./loginclient";

export default async function LoginPage() { 
const session = await auth.api.getSession({
  headers: await headers(),
});
  if (session) {
    redirect ("/dashboard");
  }
  return <LoginClientPage />;
};
