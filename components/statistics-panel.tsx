"use client"

import { Card } from "../components/ui/card"
import { TrendingUp, TrendingDown, Activity, Shield } from "lucide-react"

interface StatisticsPanelProps {
    totalAttacks: number
    totalBlocked: number
    uptime: number
    avgResponseTime: number
}

export function StatisticsPanel({ totalAttacks, totalBlocked, uptime, avgResponseTime }: StatisticsPanelProps) {
    const blockRate = totalAttacks > 0 ? ((totalBlocked / totalAttacks) * 100).toFixed(1) : 0

    return (
        <Card className="p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">Session Statistics</h3>
                <p className="text-sm text-muted-foreground">Performance metrics for this simulation session</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border bg-secondary/30 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-destructive" />
                        <span className="text-xs font-medium text-muted-foreground">Total Attacks</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{totalAttacks}</p>
                    <p className="text-xs text-muted-foreground mt-1">Attack attempts detected</p>
                </div>

                <div className="rounded-lg border border-border bg-secondary/30 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-success" />
                        <span className="text-xs font-medium text-muted-foreground">Blocked Requests</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{totalBlocked.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">{blockRate}% block rate</p>
                </div>

                <div className="rounded-lg border border-border bg-secondary/30 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">Uptime</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{uptime.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground mt-1">Server availability</p>
                </div>

                <div className="rounded-lg border border-border bg-secondary/30 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-4 w-4 text-warning" />
                        <span className="text-xs font-medium text-muted-foreground">Avg Response</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{avgResponseTime}ms</p>
                    <p className="text-xs text-muted-foreground mt-1">Response time</p>
                </div>
            </div>
        </Card>
    )
}
