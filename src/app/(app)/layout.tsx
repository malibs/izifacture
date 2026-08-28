import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getCurrentProfile, getOrganization } from "@/lib/queries";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, organization] = await Promise.all([
    getCurrentProfile(),
    getOrganization(),
  ]);

  if (!profile) redirect("/login");

  return (
    <AppShell
      organizationName={organization?.name ?? "Mon entreprise"}
      user={{ fullName: profile.fullName, email: profile.email }}
    >
      {children}
    </AppShell>
  );
}
