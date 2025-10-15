import { Card } from "../components/ui/card"
import type { ServerMetrics } from "../app/page"
import { Cpu, HardDrive, Network, Users, ShieldCheck, TrendingUp } from "lucide-react"

interface MetricsGridProps {
    metrics: ServerMetrics
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
    const metricCards = [
        {
            label: "CPU Usage",
            value: `${Math.round(metrics.cpuUsage)}%`,
            icon: Cpu,
            color: metrics.cpuUsage > 80 ? "text-destructive" : "text-primary",
        },
        {
            label: "Memory Usage",
            value: `${Math.round(metrics.memoryUsage)}%`,
            icon: HardDrive,
            color: metrics.memoryUsage > 80 ? "text-destructive" : "text-primary",
        },
        {
            label: "Bandwidth",
            value: `${Math.round(metrics.bandwidth)}%`,
            icon: Network,
            color: metrics.bandwidth > 80 ? "text-destructive" : "text-primary",
        },
        {
            label: "Active Connections",
            value: Math.round(metrics.activeConnections).toString(),
            icon: Users,
            color: "text-primary",
        },
        {
            label: "Blocked Requests",
            value: Math.round(metrics.blockedRequests).toString(),
            icon: ShieldCheck,
            color: "text-success",
        },
        {
            label: "Legitimate Traffic",
            value: Math.round(metrics.legitimateTraffic).toString(),
            icon: TrendingUp,
            color: "text-success",
        },
    ]

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metricCards.map((metric) => (
                <Card key={metric.label} className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">{metric.label}</p>
                            <p className={`mt-1 text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                        </div>
                        <div className={`rounded-lg bg-secondary p-2 ${metric.color}`}>
                            <metric.icon className="h-5 w-5" />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}
