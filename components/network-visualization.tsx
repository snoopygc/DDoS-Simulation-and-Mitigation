"use client"

import { Card } from "../components/ui/card"
import type { AttackType } from "../app/page"
import { useEffect, useRef } from "react"
import { Info } from "lucide-react"

interface NetworkVisualizationProps {
    legitimateTraffic: number
    maliciousTraffic: number
    activeAttack: AttackType
}

export function NetworkVisualization({ legitimateTraffic, maliciousTraffic, activeAttack }: NetworkVisualizationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const width = canvas.width
        const height = canvas.height

        const animate = () => {
            ctx.fillStyle = "#0a0f1e"
            ctx.fillRect(0, 0, width, height)

            // Draw grid background for professional look
            ctx.strokeStyle = "rgba(59, 130, 246, 0.1)"
            ctx.lineWidth = 1
            for (let i = 0; i < width; i += 40) {
                ctx.beginPath()
                ctx.moveTo(i, 0)
                ctx.lineTo(i, height)
                ctx.stroke()
            }
            for (let i = 0; i < height; i += 40) {
                ctx.beginPath()
                ctx.moveTo(0, i)
                ctx.lineTo(width, i)
                ctx.stroke()
            }

            // Draw server (center) with glow effect
            const serverX = width / 2
            const serverY = height / 2
            const serverRadius = 35

            // Glow effect
            const gradient = ctx.createRadialGradient(
                serverX,
                serverY,
                serverRadius * 0.5,
                serverX,
                serverY,
                serverRadius * 2,
            )
            gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)")
            gradient.addColorStop(1, "rgba(59, 130, 246, 0)")
            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(serverX, serverY, serverRadius * 2, 0, Math.PI * 2)
            ctx.fill()

            // Server circle
            ctx.fillStyle = "#3b82f6"
            ctx.beginPath()
            ctx.arc(serverX, serverY, serverRadius, 0, Math.PI * 2)
            ctx.fill()

            // Server border
            ctx.strokeStyle = "#60a5fa"
            ctx.lineWidth = 3
            ctx.stroke()

            ctx.fillStyle = "#ffffff"
            ctx.font = "bold 14px sans-serif"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText("SERVER", serverX, serverY)

            // Draw legitimate clients (green) with animation
            const numLegitimate = Math.min(Math.floor(legitimateTraffic / 15), 12)
            const time = Date.now() / 1000

            for (let i = 0; i < numLegitimate; i++) {
                const angle = (i / numLegitimate) * Math.PI * 2 + time * 0.2
                const x = serverX + Math.cos(angle) * 140
                const y = serverY + Math.sin(angle) * 100

                // Connection line with gradient
                const lineGradient = ctx.createLinearGradient(x, y, serverX, serverY)
                lineGradient.addColorStop(0, "#10b981")
                lineGradient.addColorStop(1, "rgba(16, 185, 129, 0.2)")
                ctx.strokeStyle = lineGradient
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.moveTo(x, y)
                ctx.lineTo(serverX, serverY)
                ctx.stroke()

                // Client node with glow
                const clientGlow = ctx.createRadialGradient(x, y, 4, x, y, 12)
                clientGlow.addColorStop(0, "rgba(16, 185, 129, 0.6)")
                clientGlow.addColorStop(1, "rgba(16, 185, 129, 0)")
                ctx.fillStyle = clientGlow
                ctx.beginPath()
                ctx.arc(x, y, 12, 0, Math.PI * 2)
                ctx.fill()

                ctx.fillStyle = "#10b981"
                ctx.beginPath()
                ctx.arc(x, y, 8, 0, Math.PI * 2)
                ctx.fill()

                // Client label
                ctx.fillStyle = "#10b981"
                ctx.font = "10px sans-serif"
                ctx.fillText("USER", x, y + 20)
            }

            // Draw malicious clients (red) with aggressive animation
            if (activeAttack !== "none") {
                const numMalicious = Math.min(Math.floor(maliciousTraffic / 40), 25)
                for (let i = 0; i < numMalicious; i++) {
                    const angle = (i / numMalicious) * Math.PI * 2 + time * 0.5
                    const distance = 120 + Math.sin(time * 2 + i) * 20
                    const x = serverX + Math.cos(angle) * distance
                    const y = serverY + Math.sin(angle) * distance

                    // Attack line with dashed pattern
                    const attackGradient = ctx.createLinearGradient(x, y, serverX, serverY)
                    attackGradient.addColorStop(0, "#ef4444")
                    attackGradient.addColorStop(1, "rgba(239, 68, 68, 0.3)")
                    ctx.strokeStyle = attackGradient
                    ctx.lineWidth = 2
                    ctx.setLineDash([8, 4])
                    ctx.beginPath()
                    ctx.moveTo(x, y)
                    ctx.lineTo(serverX, serverY)
                    ctx.stroke()
                    ctx.setLineDash([])

                    // Attacker node with pulsing glow
                    const pulse = Math.sin(time * 3 + i) * 0.3 + 0.7
                    const attackerGlow = ctx.createRadialGradient(x, y, 3, x, y, 10 * pulse)
                    attackerGlow.addColorStop(0, "rgba(239, 68, 68, 0.8)")
                    attackerGlow.addColorStop(1, "rgba(239, 68, 68, 0)")
                    ctx.fillStyle = attackerGlow
                    ctx.beginPath()
                    ctx.arc(x, y, 10 * pulse, 0, Math.PI * 2)
                    ctx.fill()

                    ctx.fillStyle = "#ef4444"
                    ctx.beginPath()
                    ctx.arc(x, y, 6, 0, Math.PI * 2)
                    ctx.fill()

                    // Attacker label
                    ctx.fillStyle = "#ef4444"
                    ctx.font = "10px sans-serif"
                    ctx.fillText("BOT", x, y + 18)
                }
            }

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [legitimateTraffic, maliciousTraffic, activeAttack])

    return (
        <Card className="p-6">
            <div className="mb-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Network Traffic Visualization</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Real-time view of network connections to your server</p>
                    </div>
                </div>

                <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="space-y-2 text-sm">
                            <p className="text-foreground font-medium">Why This Visualization Matters:</p>
                            <p className="text-muted-foreground">
                                This diagram shows how DDoS attacks overwhelm servers by flooding them with malicious traffic. In a
                                normal state, you see legitimate users (green) connecting smoothly. During an attack, malicious bots
                                (red) swarm the server, consuming resources and blocking legitimate users.
                            </p>
                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-[#10b981]"></div>
                                    <span className="text-xs text-muted-foreground">Legitimate Users - Normal traffic patterns</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-[#ef4444]"></div>
                                    <span className="text-xs text-muted-foreground">Attack Bots - Malicious flood traffic</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-[#3b82f6]"></div>
                                    <span className="text-xs text-muted-foreground">Your Server - Target of the attack</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-8 border-2 border-dashed border-[#ef4444]"></div>
                                    <span className="text-xs text-muted-foreground">Attack connections (dashed lines)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center rounded-lg bg-[#0a0f1e] p-4 border border-primary/10">
                <canvas
                    ref={canvasRef}
                    width={700}
                    height={450}
                    className="max-w-full"
                    style={{ width: "100%", height: "auto" }}
                />
            </div>
        </Card>
    )
}
