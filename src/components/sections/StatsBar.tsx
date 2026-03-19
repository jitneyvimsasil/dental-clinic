import { STATS } from "@/lib/constants";

export function StatsBar() {
  return (
    <section className="py-12 px-6 bg-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-primary-foreground/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
