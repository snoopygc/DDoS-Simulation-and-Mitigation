"use client"

import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Slider } from "../components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"
import type { AttackType } from "../app/page"
import { Zap, Play, Square, Info } from "lucide-react"

interface AttackControlsProps {
    activeAttack: AttackType
    attackIntensity: number
    onAttackStart: (type: AttackType, intensity: number) => void
    onAttackStop: () => void
    onIntensityChange: (intensity: number) => void
}

export function AttackControls({
    activeAttack,
    attackIntensity,
    onAttackStart,
    onAttackStop,
    onIntensityChange,
}: AttackControlsProps) {
    const attacks = [
        {
            type: "http-flood" as AttackType,
            name: "HTTP Flood",
            description: "Overwhelms server with HTTP requests",
            tooltip:
                "Sends massive volumes of HTTP GET/POST requests to exhaust server resources. Attackers use botnets to generate thousands of seemingly legitimate requests per second, making the server unable to respond to real users.",
        },
        {
            type: "syn-flood" as AttackType,
            name: "SYN Flood",
            description: "Exploits TCP handshake process",
            tooltip:
                "Exploits the TCP three-way handshake by sending SYN packets with spoofed source IPs. The server allocates resources and waits for ACK responses that never arrive, filling up the connection table and blocking legitimate connections.",
        },
        {
            type: "udp-flood" as AttackType,
            name: "UDP Flood",
            description: "Floods random ports with UDP packets",
            tooltip:
                "Sends large numbers of UDP packets to random ports on the target. The server must check each port for listening applications and respond with ICMP 'Destination Unreachable' packets, consuming bandwidth and processing power.",
        },
        {
            type: "slowloris" as AttackType,
            name: "Slowloris",
            description: "Keeps connections open slowly",
            tooltip:
                "A low-bandwidth attack that opens many connections and sends partial HTTP headers very slowly. By periodically sending more data, it keeps connections alive indefinitely, exhausting the server's connection pool without triggering rate limits.",
        },
    ]

    return (
        <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Attack Controls</h3>
            </div>

            <div className="space-y-4">
                {/* Attack Type Selection */}
                <div className="space-y-2">
                    <TooltipProvider>
                        {attacks.map((attack) => (
                            <div
                                key={attack.type}
                                className={`rounded-lg border p-3 transition-colors ${activeAttack === attack.type
                                        ? "border-destructive bg-destructive/10"
                                        : "border-border bg-card hover:bg-accent"
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium text-foreground">{attack.name}</h4>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-xs">
                                                    <p className="text-sm">{attack.tooltip}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{attack.description}</p>
                                    </div>
                                    {activeAttack === attack.type ? (
                                        <Button size="sm" variant="destructive" onClick={onAttackStop} className="gap-1">
                                            <Square className="h-3 w-3" />
                                            Stop
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onAttackStart(attack.type, attackIntensity)}
                                            disabled={activeAttack !== "none"}
                                            className="gap-1"
                                        >
                                            <Play className="h-3 w-3" />
                                            Start
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </TooltipProvider>
                </div>

                {/* Intensity Slider */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">Attack Intensity</label>
                        <span className="text-sm text-muted-foreground">{attackIntensity}%</span>
                    </div>
                    <Slider
                        value={[attackIntensity]}
                        onValueChange={(value) => onIntensityChange(value[0])}
                        min={10}
                        max={100}
                        step={10}
                        className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">Higher intensity = more malicious traffic</p>
                </div>
            </div>
        </Card>
    )
}
