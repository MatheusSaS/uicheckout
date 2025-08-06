"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

export function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 2,
        minutes: 47,
        seconds: 33,
    })

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { hours, minutes, seconds } = prev

                if (seconds > 0) {
                    seconds--
                } else if (minutes > 0) {
                    minutes--
                    seconds = 59
                } else if (hours > 0) {
                    hours--
                    minutes = 59
                    seconds = 59
                } else {
                    hours = 2
                    minutes = 47
                    seconds = 33
                }

                return { hours, minutes, seconds }
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 shadow-lg max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-semibold">Oferta expira em:</span>
            </div>

            <div className="flex items-center justify-center gap-2 lg:gap-3">
                <div className="text-center">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-black text-white rounded-lg flex items-center justify-center font-bold text-lg lg:text-2xl">
                        {timeLeft.hours.toString().padStart(2, "0")}
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">HORAS</span>
                </div>

                <span className="text-xl lg:text-2xl font-bold text-gray-400">:</span>

                <div className="text-center">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-black text-white rounded-lg flex items-center justify-center font-bold text-lg lg:text-2xl">
                        {timeLeft.minutes.toString().padStart(2, "0")}
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">MINUTOS</span>
                </div>

                <span className="text-xl lg:text-2xl font-bold text-gray-400">:</span>

                <div className="text-center">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-600 text-white rounded-lg flex items-center justify-center font-bold text-lg lg:text-2xl animate-pulse">
                        {timeLeft.seconds.toString().padStart(2, "0")}
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">SEGUNDOS</span>
                </div>
            </div>
        </div>
    )
}
