"use client"

import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import type { ServerMetrics } from "../app/page"
import { Server, Activity, Cloud, Zap, RefreshCw } from "lucide-react"
import { useState } from "react"

interface ServerStatusProps {
    metrics: ServerMetrics
    onEmergencyAction: (action: "cdn" | "failover" | "scale") => void
}

export function ServerStatus({ metrics, onEmergencyAction }: ServerStatusProps) {
    const [cooldowns, setCooldowns] = useState({
        cdn: false,
        failover: false,
        scale: false,
    })

    const getHealthColor = (health: number) => {
        if (health > 70) return "text-success"
        if (health > 30) return "text-warning"
        return "text-destructive"
    }

    const getHealthBgColor = (health: number) => {
        if (health > 70) return "bg-success"
        if (health > 30) return "bg-warning"
        return "bg-destructive"
    }

    const handleEmergencyAction = (action: "cdn" | "failover" | "scale") => {
        onEmergencyAction(action)
        setCooldowns((prev) => ({ ...prev, [action]: true }))
        // Cooldown for 30 seconds
        setTimeout(() => {
            setCooldowns((prev) => ({ ...prev, [action]: false }))
        }, 30000)
    }

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-3">
                        <Server className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Server Health</h3>
                        <p className={`text-3xl font-bold ${getHealthColor(metrics.health)}`}>{Math.round(metrics.health)}%</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{Math.round(metrics.requestsPerSecond)} req/s</span>
                </div>
            </div>

            {/* Health Bar */}
            <div className="mt-4">
                <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                        className={`h-full transition-all duration-500 ${getHealthBgColor(metrics.health)}`}
                        style={{ width: `${metrics.health}%` }}
                    />
                </div>
            </div>

            {/* Status Message */}
            <div className="mt-4 rounded-lg bg-secondary/50 p-3">
                <p className="text-sm text-foreground">
                    {metrics.health > 90 && "Server is operating at optimal performance."}
                    {metrics.health > 70 && metrics.health <= 90 && "Server is under moderate load."}
                    {metrics.health > 30 && metrics.health <= 70 && "Server is experiencing high load. Performance degraded."}
                    {metrics.health <= 30 && "Critical: Server is nearly overwhelmed. Immediate action required!"}
                </p>
            </div>

            {metrics.health < 40 && (
                <div className="mt-4 space-y-3">
                    <p className="text-sm font-semibold text-warning">Emergency Actions Available:</p>

                    <div className="grid gap-2">
                        {/* Activate DDoS Protection Service */}
                        <Button
                            onClick={() => handleEmergencyAction("cdn")}
                            disabled={cooldowns.cdn}
                            className="w-full justify-start gap-2 text-white"
                            style={{ backgroundColor: cooldowns.cdn ? "#7a4e00" : "#FF9D00" }}
                            size="sm"
                        >
                            <Cloud className="h-4 w-4" />
                            <div className="flex-1 text-left">
                                <div className="font-medium">Activate DDoS Protection</div>
                                <div className="text-xs opacity-90">Route traffic through scrubbing center (+30% health)</div>
                            </div>
                        </Button>

                        {/* Failover to Backup Servers */}
                        <Button
                            onClick={() => handleEmergencyAction("failover")}
                            disabled={cooldowns.failover}
                            className="w-full justify-start gap-2 text-white"
                            style={{ backgroundColor: cooldowns.failover ? "#793009" : "#F25912" }}
                            size="sm"
                        >
                            <RefreshCw className="h-4 w-4" />
                            <div className="flex-1 text-left">
                                <div className="font-medium">Failover to Backup</div>
                                <div className="text-xs opacity-90">Switch to standby servers (+25% health)</div>
                            </div>
                        </Button>

                        {/* Scale Infrastructure */}
                        <Button
                            onClick={() => handleEmergencyAction("scale")}
                            disabled={cooldowns.scale}
                            className="w-full justify-start gap-2 text-white"
                            style={{ backgroundColor: cooldowns.scale ? "#211636" : "#412B6B" }}
                            size="sm"
                        >
                            <Zap className="h-4 w-4" />
                            <div className="flex-1 text-left">
                                <div className="font-medium">Emergency Scaling</div>
                                <div className="text-xs opacity-90">Add more server capacity (+20% health)</div>
                            </div>
                        </Button>
                    </div>

                    <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 mt-3">
                        <p className="text-xs text-blue-400 leading-relaxed">
                            <strong>Real-world context:</strong> These actions simulate actual emergency responses. DDoS protection
                            services (like Cloudflare) filter malicious traffic. Failover switches to backup infrastructure. Scaling
                            adds more servers to handle load. Each has a 30-second cooldown representing deployment time and costs.
                        </p>
                    </div>
                </div>
            )}
        </Card>
    )
}
