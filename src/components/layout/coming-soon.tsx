import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-5">
      <PageHeader title={title} description={description} />
      <Card className="flex min-h-[320px] flex-col items-center justify-center gap-2 p-10 text-center">
        <p className="text-base font-medium">Page en cours de construction</p>
        <p className="max-w-md text-sm text-ink-soft">
          Cet écran sera construit à la prochaine étape, une fois le design du
          tableau de bord validé.
        </p>
      </Card>
    </div>
  );
}
