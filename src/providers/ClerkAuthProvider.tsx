import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

function ClerkAuthProvider({ children }: { children: ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}

export default ClerkAuthProvider;
