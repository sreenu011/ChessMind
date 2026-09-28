import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export type StatItem = { label: string; value: string | number };

export function ProfileStats({ stats }: { stats: StatItem[] }) {
  return (
    <section aria-labelledby="performance-heading">
      <h2 id="performance-heading" className="font-display text-2xl font-bold tracking-tight">
        Performance
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="card-hover border-border/60 bg-card/60 backdrop-blur-sm">
            <CardHeader className="p-4 sm:p-5">
              <CardDescription className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                {s.label}
              </CardDescription>
              <CardTitle className="font-display text-2xl sm:text-3xl font-bold mt-1 text-foreground">
                {s.value}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
