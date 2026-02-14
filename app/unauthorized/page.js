"use client";

import { useRouter } from "next/navigation";

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🚫 Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <button onClick={() => router.push("/login")}>Go to Login</button>
    </div>
  );
}
