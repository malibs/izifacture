import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CompanySettingsForm } from "@/components/settings/company-settings-form";
import { getOrganization } from "@/lib/queries";

export const metadata: Metadata = { title: "Paramètres" };

export default async function Page() {
  const organization = await getOrganization();
  if (!organization) redirect("/login");

  return <CompanySettingsForm organization={organization} />;
}
