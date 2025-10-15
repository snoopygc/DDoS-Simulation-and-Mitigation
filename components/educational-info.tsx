import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import type { AttackType } from "../app/page"
import { BookOpen, Shield, AlertTriangle, CheckCircle, Target, Clock, Zap } from "lucide-react"

interface EducationalInfoProps {
    activeAttack: AttackType
}

export function EducationalInfo({ activeAttack }: EducationalInfoProps) {
    const attackInfo = {
        "http-flood": {
            title: "HTTP Flood Attack",
            description:
                "An HTTP flood attack is a type of volumetric DDoS attack where attackers send a massive number of HTTP requests to overwhelm the web server. These requests appear legitimate, making them harder to filter than other types of attacks.",
            severity: "High",
            bandwidth: "High",
            complexity: "Medium",
            howItWorks: [
                "Attackers use botnets (networks of compromised devices) to send thousands of HTTP GET or POST requests simultaneously",
                "Server resources (CPU, memory, bandwidth) are exhausted trying to process all incoming requests",
                "Legitimate users cannot access the service because the server is too busy handling attack traffic",
                "Can target specific endpoints or pages to maximize damage and resource consumption",
                "Modern variants can mimic legitimate user behavior patterns to evade detection",
            ],
            mitigation: [
                "Rate limiting to restrict the number of requests per IP address within a time window",
                "CAPTCHA challenges to verify human users and filter out automated bots",
                "Web Application Firewall (WAF) to analyze and filter malicious traffic patterns",
                "CDN (Content Delivery Network) to distribute traffic across multiple servers globally",
                "Behavioral analysis to detect abnormal traffic patterns and bot-like behavior",
            ],
            realWorld:
                "In 2016, GitHub experienced a 1.35 Tbps DDoS attack, one of the largest ever recorded. The attack used memcached amplification and was mitigated within 10 minutes using automated DDoS protection.",
        },
        "syn-flood": {
            title: "SYN Flood Attack",
            description:
                "A SYN flood exploits the TCP three-way handshake process by sending numerous SYN requests without completing the connection. This exhausts server resources allocated for pending connections, preventing legitimate users from connecting.",
            severity: "Critical",
            bandwidth: "Medium",
            complexity: "Low",
            howItWorks: [
                "Attacker sends SYN packets with spoofed (fake) source IP addresses to the target server",
                "Server responds with SYN-ACK packets and allocates resources for each connection",
                "Server waits for ACK response that never arrives because the source IP is fake",
                "Half-open connections accumulate in the server's connection table, consuming memory",
                "Connection table fills up completely, blocking all new legitimate connection attempts",
            ],
            mitigation: [
                "SYN cookies: Avoid allocating resources until the TCP handshake is fully completed",
                "Reduce SYN-RECEIVED timeout values to free up resources faster",
                "Increase the size of the connection backlog queue to handle more pending connections",
                "Deploy firewalls with built-in SYN flood protection and packet filtering",
                "Use load balancers to distribute connection requests across multiple servers",
            ],
            realWorld:
                "SYN floods were one of the earliest DDoS attack methods, first documented in 1996. They remain popular because they're simple to execute and can be devastating without proper protection.",
        },
        "udp-flood": {
            title: "UDP Flood Attack",
            description:
                "UDP flood attacks send a large number of UDP packets to random ports on the target system. Since UDP is connectionless, the server must check for applications listening on those ports and respond, consuming significant resources.",
            severity: "High",
            bandwidth: "Very High",
            complexity: "Low",
            howItWorks: [
                "Attacker sends massive volumes of UDP packets to random or specific ports on the target",
                "Server must check each port to see if any application is listening on it",
                "Server responds with ICMP 'Destination Unreachable' packets for closed ports",
                "Network bandwidth is saturated with both incoming UDP packets and outgoing ICMP responses",
                "Resources are exhausted processing and responding to the flood of packets",
            ],
            mitigation: [
                "Rate limiting on UDP traffic to restrict the volume of packets processed",
                "Geo-blocking to filter traffic from suspicious geographic regions",
                "Network-level filtering and traffic shaping to prioritize legitimate traffic",
                "Deploy specialized DDoS protection services that can absorb volumetric attacks",
                "Disable unnecessary UDP services and close unused ports to reduce attack surface",
            ],
            realWorld:
                "In 2018, a UDP amplification attack reached 1.7 Tbps by exploiting misconfigured memcached servers. This remains one of the largest DDoS attacks ever recorded.",
        },
        slowloris: {
            title: "Slowloris Attack",
            description:
                "Slowloris is a sophisticated low-bandwidth attack that keeps many connections to the target web server open for as long as possible. It sends partial HTTP requests slowly, never completing them, which exhausts the server's connection pool.",
            severity: "Medium",
            bandwidth: "Very Low",
            complexity: "High",
            howItWorks: [
                "Attacker opens multiple HTTP connections to the target web server",
                "Sends partial HTTP headers very slowly, one byte at a time or with long delays",
                "Periodically sends additional header data to keep connections alive and prevent timeout",
                "Server keeps connections open waiting for complete requests that never arrive",
                "Connection pool fills up, preventing legitimate users from establishing new connections",
            ],
            mitigation: [
                "Limit connection time and set aggressive timeouts for incomplete HTTP requests",
                "Increase the maximum number of concurrent connections the server can handle",
                "Use reverse proxies or load balancers to buffer and validate requests before forwarding",
                "Deploy connection rate limiting per IP address to prevent single sources from monopolizing connections",
                "Implement minimum data rate requirements to close connections that send data too slowly",
            ],
            realWorld:
                "Slowloris was created in 2009 and demonstrated that effective DDoS attacks don't require massive bandwidth. A single computer can take down a web server using this technique.",
        },
    }

    const generalInfo = {
        title: "Understanding DDoS Attacks",
        description:
            "Distributed Denial of Service (DDoS) attacks attempt to make an online service unavailable by overwhelming it with traffic from multiple sources. Understanding these attacks is crucial for modern cybersecurity defense.",
        keyPoints: [
            "DDoS attacks can cost businesses $20,000-$40,000 per hour in lost revenue and recovery costs",
            "Attacks are often launched using botnets of thousands or millions of compromised IoT devices",
            "Modern attacks can exceed 1 Tbps in traffic volume, enough to overwhelm most networks",
            "Multi-layered defense strategies combining multiple mitigation techniques are most effective",
            "The average DDoS attack lasts 4-6 hours, but some can persist for days or weeks",
            "Attackers often use DDoS as a smokescreen while attempting data breaches or other attacks",
        ],
        types: [
            {
                name: "Volumetric Attacks",
                description:
                    "Consume bandwidth by flooding the network with massive amounts of traffic (UDP floods, ICMP floods)",
            },
            {
                name: "Protocol Attacks",
                description: "Exploit weaknesses in network protocols to exhaust server resources (SYN floods, Ping of Death)",
            },
            {
                name: "Application Layer Attacks",
                description: "Target web applications with seemingly legitimate requests (HTTP floods, Slowloris)",
            },
        ],
    }

    const info = activeAttack !== "none" ? attackInfo[activeAttack] : generalInfo

    return (
        <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Educational Information</h3>
            </div>

            <div className="space-y-6">
                <div>
                    <h4 className="mb-2 text-xl font-bold text-foreground">{info.title}</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{info.description}</p>

                    {activeAttack !== "none" && "severity" in info && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant="outline" className="gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Severity: {info.severity}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                                <Zap className="h-3 w-3" />
                                Bandwidth: {info.bandwidth}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                                <Target className="h-3 w-3" />
                                Complexity: {info.complexity}
                            </Badge>
                        </div>
                    )}
                </div>

                {activeAttack !== "none" && "howItWorks" in info && (
                    <>
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                                <h5 className="font-semibold text-foreground">How It Works</h5>
                            </div>
                            <ul className="space-y-2">
                                {info.howItWorks.map((point, index) => (
                                    <li key={index} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                                        <span className="text-destructive mt-1">•</span>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <Shield className="h-4 w-4 text-success" />
                                <h5 className="font-semibold text-foreground">Mitigation Strategies</h5>
                            </div>
                            <ul className="space-y-2">
                                {info.mitigation.map((point, index) => (
                                    <li key={index} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-success mt-0.5" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
                            <div className="mb-2 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <h5 className="font-semibold text-foreground">Real-World Example</h5>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{info.realWorld}</p>
                        </div>
                    </>
                )}

                {activeAttack === "none" && "keyPoints" in info && (
                    <>
                        <div>
                            <h5 className="mb-3 font-semibold text-foreground">Key Facts</h5>
                            <ul className="space-y-2">
                                {info.keyPoints.map((point, index) => (
                                    <li key={index} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h5 className="mb-3 font-semibold text-foreground">Types of DDoS Attacks</h5>
                            <div className="space-y-3">
                                {info.types.map((type, index) => (
                                    <div key={index} className="rounded-lg border border-border bg-card p-3">
                                        <h6 className="font-medium text-foreground mb-1">{type.name}</h6>
                                        <p className="text-sm text-muted-foreground">{type.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Card>
    )
}
