"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { ServerStatus } from "../components/server-status"
import { TrafficChart } from "../components/traffic-chart"
import { AttackControls } from "../components/attack-controls"
import { MitigationPanel } from "../components/mitigation-panel"
import { NetworkVisualization } from "../components/network-visualization"
import { MetricsGrid } from "../components/metrics-grid"
import { EducationalInfo } from "../components/educational-info"
import { AttackHistory } from "../components/attack-history"
import { StatisticsPanel } from "../components/statistics-panel"
import { Shield, AlertTriangle, Activity } from "lucide-react"

export type AttackType = "none" | "http-flood" | "syn-flood" | "udp-flood" | "slowloris"

export interface ServerMetrics {
    health: number
    requestsPerSecond: number
    cpuUsage: number
    memoryUsage: number
    bandwidth: number
    activeConnections: number
    blockedRequests: number
    legitimateTraffic: number
    maliciousTraffic: number
}

export interface Mitigation {
    rateLimit: boolean
    ipBlocking: boolean
    geoBlocking: boolean
    captcha: boolean
    cdn: boolean
    waf: boolean
}

interface AttackEvent {
    id: string
    timestamp: Date
    type: "attack_started" | "attack_stopped" | "mitigation_enabled" | "server_critical"
    message: string
    severity: "info" | "warning" | "critical"
}

export default function DDoSSimulator() {
    const [activeAttack, setActiveAttack] = useState<AttackType>("none")
    const [attackIntensity, setAttackIntensity] = useState(50)
    const [metrics, setMetrics] = useState<ServerMetrics>({
        health: 100,
        requestsPerSecond: 100,
        cpuUsage: 20,
        memoryUsage: 30,
        bandwidth: 50,
        activeConnections: 50,
        blockedRequests: 0,
        legitimateTraffic: 100,
        maliciousTraffic: 0,
    })
    const [mitigations, setMitigations] = useState<Mitigation>({
        rateLimit: false,
        ipBlocking: false,
        geoBlocking: false,
        captcha: false,
        cdn: false,
        waf: false,
    })
    const [trafficHistory, setTrafficHistory] = useState<Array<{ time: number; legitimate: number; malicious: number }>>(
        [],
    )
    const [isRunning, setIsRunning] = useState(true)

    const [attackEvents, setAttackEvents] = useState<AttackEvent[]>([])
    const [statistics, setStatistics] = useState({
        totalAttacks: 0,
        totalBlocked: 0,
        uptime: 100,
        avgResponseTime: 45,
    })
    const [sessionStartTime] = useState(Date.now())

    const addEvent = useCallback((type: AttackEvent["type"], message: string, severity: AttackEvent["severity"]) => {
        const newEvent: AttackEvent = {
            id: `${Date.now()}-${Math.random()}`,
            timestamp: new Date(),
            type,
            message,
            severity,
        }
        setAttackEvents((prev) => [newEvent, ...prev].slice(0, 50)) // Keep last 50 events
    }, [])

    const calculateMitigationEffectiveness = useCallback(() => {
        let effectiveness = 0
        if (mitigations.rateLimit) effectiveness += 0.3
        if (mitigations.ipBlocking) effectiveness += 0.25
        if (mitigations.geoBlocking) effectiveness += 0.2
        if (mitigations.captcha) effectiveness += 0.2
        if (mitigations.cdn) effectiveness += 0.25
        if (mitigations.waf) effectiveness += 0.2
        return Math.min(effectiveness, 1.0) // Can now reach 100% with all mitigations
    }, [mitigations])

    const simulateAttack = useCallback(() => {
        if (!isRunning) return

        setMetrics((prev) => {
            const newMetrics = { ...prev }
            const mitigationEffect = calculateMitigationEffectiveness()

            if (activeAttack === "none") {
                newMetrics.legitimateTraffic = 100 + Math.random() * 20 - 10
                newMetrics.maliciousTraffic = 0
                newMetrics.requestsPerSecond = Math.max(50, newMetrics.legitimateTraffic)
                newMetrics.health = Math.min(100, prev.health + 5) // Increased from 2 to 5
                newMetrics.cpuUsage = Math.max(15, 20 + Math.random() * 10 - 5)
                newMetrics.memoryUsage = Math.max(25, 30 + Math.random() * 10 - 5)
                newMetrics.bandwidth = Math.max(30, 50 + Math.random() * 20 - 10)
                newMetrics.activeConnections = Math.max(30, 50 + Math.random() * 20 - 10)
                newMetrics.blockedRequests = 0
            } else {
                // Under attack
                const attackMultiplier = attackIntensity / 10
                let baseAttackTraffic = 0

                switch (activeAttack) {
                    case "http-flood":
                        baseAttackTraffic = 500 * attackMultiplier
                        break
                    case "syn-flood":
                        baseAttackTraffic = 800 * attackMultiplier
                        break
                    case "udp-flood":
                        baseAttackTraffic = 600 * attackMultiplier
                        break
                    case "slowloris":
                        baseAttackTraffic = 300 * attackMultiplier
                        break
                }

                const effectiveAttackTraffic = baseAttackTraffic * (1 - mitigationEffect)
                newMetrics.maliciousTraffic = effectiveAttackTraffic
                newMetrics.blockedRequests = baseAttackTraffic * mitigationEffect
                newMetrics.legitimateTraffic = Math.max(10, 100 - effectiveAttackTraffic / 5)
                newMetrics.requestsPerSecond = newMetrics.legitimateTraffic + effectiveAttackTraffic

                const healthDamage = (effectiveAttackTraffic / 100) * 0.5

                // If mitigations are blocking more than 70% of traffic, allow gradual recovery
                if (mitigationEffect > 0.7 && prev.health < 100) {
                    const recoveryRate = (mitigationEffect - 0.7) * 10 // Up to 3 health per tick at 100% mitigation
                    newMetrics.health = Math.min(100, prev.health + recoveryRate - healthDamage)
                } else {
                    newMetrics.health = Math.max(0, prev.health - healthDamage)
                }

                // Resource usage
                newMetrics.cpuUsage = Math.min(100, 20 + effectiveAttackTraffic / 10)
                newMetrics.memoryUsage = Math.min(100, 30 + effectiveAttackTraffic / 15)
                newMetrics.bandwidth = Math.min(100, 50 + effectiveAttackTraffic / 8)
                newMetrics.activeConnections = Math.min(1000, 50 + effectiveAttackTraffic / 2)

                // Server degradation
                if (newMetrics.health < 30) {
                    newMetrics.legitimateTraffic = newMetrics.legitimateTraffic * 0.3
                    if (prev.health >= 30) {
                        addEvent("server_critical", "Server health critical! Legitimate users being dropped.", "critical")
                    }
                } else if (newMetrics.health < 60) {
                    newMetrics.legitimateTraffic = newMetrics.legitimateTraffic * 0.7
                }
            }

            return newMetrics
        })

        setStatistics((prev) => {
            const sessionDuration = (Date.now() - sessionStartTime) / 1000
            const uptimeCalc = (metrics.health / 100) * 100
            const responseTime = Math.max(20, Math.min(500, 45 + (100 - metrics.health) * 3))

            return {
                ...prev,
                totalBlocked: prev.totalBlocked + Math.round(metrics.blockedRequests),
                uptime: uptimeCalc,
                avgResponseTime: Math.round(responseTime),
            }
        })
    }, [
        activeAttack,
        attackIntensity,
        calculateMitigationEffectiveness,
        isRunning,
        addEvent,
        metrics.health,
        metrics.blockedRequests,
        sessionStartTime,
    ])

    useEffect(() => {
        const interval = setInterval(() => {
            simulateAttack()
            setTrafficHistory((prev) => {
                const newHistory = [
                    ...prev,
                    {
                        time: Date.now(),
                        legitimate: metrics.legitimateTraffic,
                        malicious: metrics.maliciousTraffic,
                    },
                ]
                return newHistory.slice(-60)
            })
        }, 500)

        return () => clearInterval(interval)
    }, [simulateAttack, metrics.legitimateTraffic, metrics.maliciousTraffic])

    const handleAttackStart = (type: AttackType, intensity: number) => {
        setActiveAttack(type)
        setAttackIntensity(intensity)
        setStatistics((prev) => ({ ...prev, totalAttacks: prev.totalAttacks + 1 }))
        addEvent(
            "attack_started",
            `${type.toUpperCase().replace("-", " ")} attack initiated at ${intensity}% intensity`,
            "warning",
        )
    }

    const handleAttackStop = () => {
        addEvent("attack_stopped", `${activeAttack.toUpperCase().replace("-", " ")} attack stopped`, "info")
        setActiveAttack("none")
    }

    const handleMitigationToggle = (mitigation: keyof Mitigation) => {
        setMitigations((prev) => ({
            ...prev,
            [mitigation]: !prev[mitigation],
        }))
        const action = !mitigations[mitigation] ? "enabled" : "disabled"
        addEvent("mitigation_enabled", `${mitigation.replace(/([A-Z])/g, " $1").toUpperCase()} ${action}`, "info")
    }

    const handleReset = () => {
        setActiveAttack("none")
        setAttackIntensity(50)
        setMetrics({
            health: 100,
            requestsPerSecond: 100,
            cpuUsage: 20,
            memoryUsage: 30,
            bandwidth: 50,
            activeConnections: 50,
            blockedRequests: 0,
            legitimateTraffic: 100,
            maliciousTraffic: 0,
        })
        setMitigations({
            rateLimit: false,
            ipBlocking: false,
            geoBlocking: false,
            captcha: false,
            cdn: false,
            waf: false,
        })
        setTrafficHistory([])
        setAttackEvents([])
        setStatistics({
            totalAttacks: 0,
            totalBlocked: 0,
            uptime: 100,
            avgResponseTime: 45,
        })
        addEvent("attack_stopped", "Simulation reset to initial state", "info")
    }

    const handleEmergencyAction = (action: "cdn" | "failover" | "scale") => {
        let healthBoost = 0
        let message = ""

        switch (action) {
            case "cdn":
                healthBoost = 30
                message = "DDoS Protection Service activated - Traffic routed through scrubbing center"
                break
            case "failover":
                healthBoost = 25
                message = "Failover completed - Now running on backup server infrastructure"
                break
            case "scale":
                healthBoost = 20
                message = "Emergency scaling deployed - Additional server capacity online"
                break
        }

        setMetrics((prev) => ({
            ...prev,
            health: Math.min(100, prev.health + healthBoost),
        }))
        addEvent("mitigation_enabled", message, "info")
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-[1600px] space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">DDoS Attack Simulator</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Interactive platform to learn about DDoS attacks and mitigation strategies
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant={isRunning ? "secondary" : "default"}
                            onClick={() => setIsRunning(!isRunning)}
                            className="gap-2"
                        >
                            <Activity className="h-4 w-4" />
                            {isRunning ? "Pause" : "Resume"}
                        </Button>
                        <Button variant="outline" onClick={handleReset}>
                            Reset Simulation
                        </Button>
                    </div>
                </div>

                {/* Status Banner */}
                <Card className="border-l-4 border-l-primary bg-card/50 p-4">
                    <div className="flex items-start gap-3">
                        {activeAttack === "none" ? (
                            <>
                                <Shield className="h-5 w-5 text-success" />
                                <div>
                                    <h3 className="font-semibold text-success">System Operational</h3>
                                    <p className="text-sm text-muted-foreground">
                                        No active attacks detected. Server is running normally.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                <div>
                                    <h3 className="font-semibold text-destructive">
                                        Under Attack: {activeAttack.toUpperCase().replace("-", " ")}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Malicious traffic detected. Enable mitigations to protect your server.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </Card>

                {/* Main Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Controls */}
                    <div className="space-y-6">
                        <AttackControls
                            activeAttack={activeAttack}
                            attackIntensity={attackIntensity}
                            onAttackStart={handleAttackStart}
                            onAttackStop={handleAttackStop}
                            onIntensityChange={setAttackIntensity}
                        />
                        <MitigationPanel
                            mitigations={mitigations}
                            onToggle={handleMitigationToggle}
                            effectiveness={calculateMitigationEffectiveness()}
                        />
                        <StatisticsPanel
                            totalAttacks={statistics.totalAttacks}
                            totalBlocked={statistics.totalBlocked}
                            uptime={statistics.uptime}
                            avgResponseTime={statistics.avgResponseTime}
                        />
                    </div>

                    {/* Middle Column - Visualizations */}
                    <div className="space-y-6 lg:col-span-2">
                        <ServerStatus metrics={metrics} onEmergencyAction={handleEmergencyAction} />
                        <MetricsGrid metrics={metrics} />
                        <TrafficChart data={trafficHistory} />
                        <NetworkVisualization
                            legitimateTraffic={metrics.legitimateTraffic}
                            maliciousTraffic={metrics.maliciousTraffic}
                            activeAttack={activeAttack}
                        />
                        <AttackHistory events={attackEvents} />
                    </div>
                </div>

                {/* Educational Content */}
                <EducationalInfo activeAttack={activeAttack} />
            </div>
        </div>
    )
}
