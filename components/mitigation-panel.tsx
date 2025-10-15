import { Card } from "../components/ui/card"
import { Switch } from "../components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"
import type { Mitigation } from "../app/page"
import { Shield, Info } from "lucide-react"

interface MitigationPanelProps {
    mitigations: Mitigation
    onToggle: (mitigation: keyof Mitigation) => void
    effectiveness: number
}

export function MitigationPanel({ mitigations, onToggle, effectiveness }: MitigationPanelProps) {
    const mitigationOptions = [
        {
            key: "rateLimit" as keyof Mitigation,
            name: "Rate Limiting",
            description: "Limit requests per IP",
            effectiveness: 30, // Increased from 25
            tooltip:
                "Restricts the number of requests a single IP address can make within a time window. Effective against volumetric attacks by preventing any single source from overwhelming the server. Can be implemented at various layers (application, network, CDN).",
        },
        {
            key: "ipBlocking" as keyof Mitigation,
            name: "IP Blocking",
            description: "Block suspicious IPs",
            effectiveness: 25, // Increased from 20
            tooltip:
                "Maintains a blacklist of known malicious IP addresses and blocks all traffic from them. Can be updated in real-time based on attack patterns. Works well against repeat attackers but less effective against distributed botnets with many IPs.",
        },
        {
            key: "geoBlocking" as keyof Mitigation,
            name: "Geo-Blocking",
            description: "Block specific regions",
            effectiveness: 20, // Increased from 15
            tooltip:
                "Blocks or restricts traffic from specific geographic regions where attacks commonly originate. Useful when your service doesn't need global access. Can significantly reduce attack surface but may block legitimate users from those regions.",
        },
        {
            key: "captcha" as keyof Mitigation,
            name: "CAPTCHA",
            description: "Verify human users",
            effectiveness: 20, // Increased from 15
            tooltip:
                "Challenges users to prove they're human through puzzles or image recognition. Highly effective against automated bots but can impact user experience. Best used during active attacks or for sensitive operations rather than all traffic.",
        },
        {
            key: "cdn" as keyof Mitigation,
            name: "CDN Protection",
            description: "Distribute traffic load",
            effectiveness: 25, // Increased from 15
            tooltip:
                "Content Delivery Networks distribute traffic across multiple servers globally, absorbing attack traffic before it reaches your origin server. Provides caching, load balancing, and often includes built-in DDoS protection. Scales automatically with traffic spikes.",
        },
        {
            key: "waf" as keyof Mitigation,
            name: "Web Application Firewall",
            description: "Filter malicious requests",
            effectiveness: 20, // Increased from 10
            tooltip:
                "Analyzes HTTP/HTTPS requests and filters out malicious patterns based on rules and signatures. Can detect and block application-layer attacks, SQL injection, XSS, and abnormal traffic patterns. Updates regularly to counter new attack vectors.",
        },
    ]

    return (
        <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-success" />
                <h3 className="text-lg font-semibold text-foreground">Mitigation Strategies</h3>
            </div>

            {/* Effectiveness Meter */}
            <div className="mb-4 rounded-lg bg-secondary/50 p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Overall Effectiveness</span>
                    <span className="text-lg font-bold text-success">{Math.round(effectiveness * 100)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-success transition-all duration-500" style={{ width: `${effectiveness * 100}%` }} />
                </div>
                {effectiveness > 0.7 && (
                    <p className="mt-2 text-xs text-success text-center font-medium">
                        ✓ High protection active - Server recovering from damage
                    </p>
                )}
            </div>

            {/* Mitigation Options */}
            <div className="space-y-3">
                <TooltipProvider>
                    {mitigationOptions.map((option) => (
                        <div
                            key={option.key}
                            className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-foreground">{option.name}</h4>
                                    <span className="text-xs text-muted-foreground">+{option.effectiveness}%</span>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                            <p className="text-sm">{option.tooltip}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <p className="text-xs text-muted-foreground">{option.description}</p>
                            </div>
                            <Switch checked={mitigations[option.key]} onCheckedChange={() => onToggle(option.key)} />
                        </div>
                    ))}
                </TooltipProvider>
            </div>
        </Card>
    )
}
