"use client"

import { Card } from "../components/ui/card"
import { ScrollArea } from "../components/ui/scroll-area"
import { Clock, AlertTriangle, Shield } from "lucide-react"

interface AttackEvent {
    id: string
    timestamp: Date
    type: "attack_started" | "attack_stopped" | "mitigation_enabled" | "server_critical"
    message: string
    severity: "info" | "warning" | "critical"
}

interface AttackHistoryProps {
    events: AttackEvent[]
}

export function AttackHistory({ events }: AttackHistoryProps) {
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "critical":
                return "text-destructive"
            case "warning":
                return "text-warning"
            default:
                return "text-primary"
        }
    }

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case "critical":
                return <AlertTriangle className="h-4 w-4" />
            case "warning":
                return <AlertTriangle className="h-4 w-4" />
            default:
                return <Shield className="h-4 w-4" />
        }
    }

    return (
        <Card className="p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">Attack History & Events</h3>
                <p className="text-sm text-muted-foreground">Real-time log of security events and system changes</p>
            </div>

            <ScrollArea className="h-[300px] rounded-lg border border-border bg-secondary/30 p-4">
                {events.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <div className="text-center">
                            <Clock className="mx-auto h-8 w-8 mb-2 opacity-50" />
                            <p className="text-sm">No events recorded yet</p>
                            <p className="text-xs mt-1">Start an attack to see activity logs</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent"
                            >
                                <div className={getSeverityColor(event.severity)}>{getSeverityIcon(event.severity)}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground">{event.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{event.timestamp.toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </Card>
    )
}
