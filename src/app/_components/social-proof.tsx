"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, TrendingUp } from "lucide-react"

const recentBuyers = [
    { name: "Maria S.", avatar: "/placeholder.svg?height=32&width=32", time: "2 min atrás", location: "São Paulo" },
    { name: "Carlos R.", avatar: "/placeholder.svg?height=32&width=32", time: "5 min atrás", location: "Rio de Janeiro" },
    { name: "Ana P.", avatar: "/placeholder.svg?height=32&width=32", time: "8 min atrás", location: "Belo Horizonte" },
    { name: "João M.", avatar: "/placeholder.svg?height=32&width=32", time: "12 min atrás", location: "Brasília" },
    { name: "Lucia F.", avatar: "/placeholder.svg?height=32&width=32", time: "15 min atrás", location: "Salvador" },
]

export function SocialProof() {
    const [currentBuyer, setCurrentBuyer] = useState(0)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false)
            setTimeout(() => {
                setCurrentBuyer((prev) => (prev + 1) % recentBuyers.length)
                setIsVisible(true)
            }, 300)
        }, 4000)

        return () => clearInterval(interval)
    }, [])

    const buyer = recentBuyers[currentBuyer]

    return (
        <div className="space-y-4">
            {/* Recent Purchase Notification */}
            <div
                className={`bg-white border border-green-200 rounded-lg p-4 shadow-lg transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
            >
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-green-500">
                        <AvatarImage src={buyer.avatar || "/placeholder.svg"} alt={buyer.name} />
                        <AvatarFallback className="bg-green-500 text-white text-sm">
                            {buyer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-black font-semibold">{buyer.name} acabou de comprar</span>
                        </div>
                        <p className="text-gray-600 text-sm">
                            {buyer.location} • {buyer.time}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-gray-700">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">127 vendas hoje</span>
                    </div>

                    <Badge className="bg-green-600 text-white">🏆 #1 Trending</Badge>
                </div>

                <div className="bg-gray-100 rounded-full h-3 mb-2">
                    <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000"
                        style={{ width: "78%" }}
                    ></div>
                </div>
                <p className="text-sm text-gray-600">78% das vagas já foram preenchidas</p>
            </div>
        </div>
    )
}
