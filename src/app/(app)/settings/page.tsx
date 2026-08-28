import type { Metadata } from "next";

import { CompanySettingsForm } from "@/components/settings/company-settings-form";

export const metadata: Metadata = { title: "Paramètres" };

export default function Page() {
  return <CompanySettingsForm />;
}
