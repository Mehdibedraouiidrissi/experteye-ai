
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  change?: number;
  className?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  description,
  change,
  className,
}: StatCardProps) => {
  // Determine if the change is positive, negative, or zero
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{value}</h3>
              {change !== undefined && (
                <span
                  className={cn(
                    "text-xs font-medium",
                    isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-gray-500"
                  )}
                >
                  {isPositive ? "↑" : isNegative ? "↓" : ""} {Math.abs(change)}%
                </span>
              )}
            </div>
            {description && (
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {icon && (
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
