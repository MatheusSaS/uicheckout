"use client"

import { Calculations } from "@/lib/types"
import { useMemo } from "react"

export function useCheckoutCalculations(productPrice: number, paymentMethod: "pix" | "card", installments = 1) {
    const calculations = useMemo((): Calculations => {
        let feePercentage = 0
        let platformFee = 0


        if (paymentMethod === "pix") {
            feePercentage = 0
            platformFee = 0
        } else if (paymentMethod === "card") {
            if (installments === 1) {
                feePercentage = 3.99
                platformFee = productPrice * 0.0399
            } else {
                const extraInstallments = installments - 1
                feePercentage = 4.99 + extraInstallments * 2
                platformFee = productPrice * (feePercentage / 100)
            }
        }


        const totalAmount = productPrice + platformFee
        const producerReceives = productPrice
        const installmentValue = totalAmount / installments


        const cardFee = productPrice * 0.0399
        const savings = paymentMethod === "pix" ? cardFee : 0

        return {
            totalAmount,
            platformFee,
            producerReceives,
            installmentValue,
            feePercentage,
            savings,
        }
    }, [productPrice, paymentMethod, installments])

    return { calculations }
}
