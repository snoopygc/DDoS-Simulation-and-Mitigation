"use client"

import { Card } from "../components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface TrafficChartProps {
    data: Array<{ time: number; legitimate: number; malicious: number }>
}

export function TrafficChart({ data }: TrafficChartProps) {
    const chartData = data.map((point, index) => ({
        name: index.toString(),
        Legitimate: Math.round(point.legitimate),
        Malicious: Math.round(point.malicious),
    }))

    return (
        <Card className="p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">Traffic Monitor</h3>
                <p className="text-sm text-muted-foreground">Real-time network traffic analysis</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <YAxis stroke="#9ca3af" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1f2937",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                            color: "#f9fafb",
                        }}
                    />
                    <Legend wrapperStyle={{ color: "#f9fafb" }} />
                    <Line type="monotone" dataKey="Legitimate" stroke="#10b981" strokeWidth={4} dot={false} />
                    <Line type="monotone" dataKey="Malicious" stroke="#ef4444" strokeWidth={4} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    )
}
