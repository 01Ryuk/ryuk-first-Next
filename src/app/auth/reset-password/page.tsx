import { Suspense } from "react";
import ResetPasswordPage from "./ResetPasswordClient";

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}