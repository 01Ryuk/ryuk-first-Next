import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignupClientPage from "./signupclient";

export default async function SignupPage() { 
// const session = await auth.api.getSession({
//   headers: await headers(),
// });
  // if (session) {
  //   redirect ("/dashboard");
  // }
  return <SignupClientPage />;
};