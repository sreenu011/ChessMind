import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ChessJourney({ rows }: { rows: { label: string; value: string | number }[] }) {
  return (
    <Card className="border-border/60 bg-card/60 flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="font-display text-xl font-bold tracking-tight">Chess Journey</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-3.5 sm:grid-cols-2">
          {rows.map((r) => (
            <div key={r.label} className="flex items-baseline justify-between border-b border-border/40 pb-2.5">
              <dt className="text-sm font-medium text-muted-foreground">{r.label}</dt>
              <dd className="font-display text-lg font-bold text-foreground">{r.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
