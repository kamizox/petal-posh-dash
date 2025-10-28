import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  gradient?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  gradient = "from-pink-50 to-purple-50",
}: StatCardProps) {
  return (
    <div className="stat-card fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
          {trend && (
            <p
              className={`text-xs font-medium ${
                trendUp ? "text-green-600" : "text-orange-600"
              }`}
            >
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient}`}>
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
