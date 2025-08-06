"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Zap, CreditCard as CreditCardIcon, QrCode, Users, Star, Gift, Shield, TrendingUp, Eye, CheckCircle, Crown, Target, Award, Lock } from 'lucide-react'
import { useCheckoutCalculations } from "@/hooks/use-checkout-calculations"
import { useFormValidation } from "@/hooks/use-form-validation"
import { formatCurrency, formatCPF, validateCPF, validateEmail, calculateCheckout } from "@/lib/utils"
import dynamic from "next/dynamic"

const PulsingDot = dynamic(() => import("./pulsing-dot").then(mod => ({ default: mod.PulsingDot })), { ssr: false })
const CountdownTimer = dynamic(() => import("./countdown-timer").then(mod => ({ default: mod.CountdownTimer })), { ssr: false })
const SocialProof = dynamic(() => import("./social-proof").then(mod => ({ default: mod.SocialProof })), { ssr: false })
const CreditCard = dynamic(() => import("./credit-card").then(mod => ({ default: mod.CreditCard })), { ssr: false })
import { useCreditCardForm } from "@/hooks/use-credit-card-form"
import { CheckoutFormProps } from "@/lib/types"

export function CheckoutForm({ product }: CheckoutFormProps) {
    const [formData, setFormData] = useState({
        email: "",
        cpf: "",
        paymentMethod: "pix" as "pix" | "card",
        installments: 1,
    })

    const [isLoading, setIsLoading] = useState(false)
    const [cpfMask, setCpfMask] = useState("")
    const [viewersCount, setViewersCount] = useState(47)

    const installmentOptions = Array.from({ length: 12 }, (_, i) => i + 1)
    const { errors, validateField, isFormValid } = useFormValidation()
    const { calculations } = useCheckoutCalculations(product.currentPrice, formData.paymentMethod, formData.installments)
    const discountPercentage = Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)

    // Credit card form
    const {
        cardNumber,
        cardHolder,
        cardValidity,
        cardCVV,
        isCardFlipped,
        errors: cardErrors,
        isValid: isCardValid,
        handleCardNumberChange,
        handleCardValidityChange,
        handleCardHolderChange,
        handleCVVChange,
        flipCard,
        unflipCard,
        getValues: getCardValues,
    } = useCreditCardForm()

    const installmentCalculations = useMemo(() => 
        installmentOptions.map((option) =>
            calculateCheckout(product.currentPrice, "card", option)
        ), [product.currentPrice]
    )

    // Simulate live viewers
    useEffect(() => {
        const interval = setInterval(() => {
            setViewersCount((prev) => {
                const change = Math.random() > 0.5 ? 1 : -1
                const newCount = prev + change
                return Math.max(35, Math.min(65, newCount))
            })
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    // Handle CPF masking
    useEffect(() => {
        setCpfMask(formatCPF(formData.cpf))
    }, [formData.cpf])

    const handleInputChange = useCallback((field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))

        if (field === "email") {
            validateField("email", validateEmail(value) ? "" : "Email inválido")
        } else if (field === "cpf") {
            const cleanCPF = value.replace(/\D/g, "")
            validateField("cpf", validateCPF(cleanCPF) ? "" : "CPF inválido")
        }
    }, [validateField])

    const handleCPFChange = useCallback((value: string) => {
        const cleanValue = value.replace(/\D/g, "").slice(0, 11)
        handleInputChange("cpf", cleanValue)
    }, [handleInputChange])

    const handlePaymentMethodChange = useCallback((method: "pix" | "card") => {
        setFormData((prev) => ({
            ...prev,
            paymentMethod: method,
            installments: method === "pix" ? 1 : prev.installments,
        }))
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const emailValid = validateEmail(formData.email)
        const cpfValid = validateCPF(formData.cpf)

        validateField("email", emailValid ? "" : "Email inválido")
        validateField("cpf", cpfValid ? "" : "CPF inválido")

        // Validate card data if payment method is card
        if (formData.paymentMethod === "card" && !isCardValid) {
            return
        }

        if (!emailValid || !cpfValid) return

        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        
        const checkoutData = {
            ...formData,
            calculations,
            ...(formData.paymentMethod === "card" && {
                creditCard: getCardValues()
            })
        }
        
        console.log("Checkout data:", checkoutData)
        setIsLoading(false)
    }

    return (
        <div className="space-y-6 md:space-y-8">

            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                    <PulsingDot />
                    <span className="text-white/80 text-sm font-medium tracking-wide">OFERTA LIMITADA</span>
                    <PulsingDot />
                </div>

                <CountdownTimer />

                <div className="flex items-center justify-center gap-2 text-white/60 text-xs">
                    <Eye className="w-3 h-3" />
                    <span>{viewersCount} pessoas visualizando</span>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                <div className="space-y-6">

                    <Card className="bg-white border-0 shadow-2xl overflow-hidden">
                        <CardHeader className="relative pb-6">

                            <div className="flex items-center justify-between mb-4">
                                <Badge className="bg-black text-white font-semibold px-3 py-1">
                                    <Crown className="w-3 h-3 mr-1" />
                                    MAIS VENDIDO
                                </Badge>
                                <Badge className="bg-green-500 text-white font-bold px-3 py-1">-{discountPercentage}% OFF</Badge>
                            </div>

                            <h1 className="text-2xl lg:text-3xl font-bold text-black leading-tight mb-4">{product.name}</h1>


                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-green-500 text-green-500" />
                                    ))}
                                    <span className="text-black font-semibold ml-2">{product.rating}</span>
                                    <span className="text-gray-600 text-sm">({product.reviewsCount})</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <Users className="w-4 h-4" />
                                    <span>{product.studentsCount.toLocaleString()} alunos</span>
                                </div>
                            </div>


                            <div className="space-y-3 mb-6">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl lg:text-5xl font-bold text-black">
                                        {formatCurrency(product.currentPrice)}
                                    </span>
                                    <span className="text-xl lg:text-2xl text-gray-400 line-through">
                                        {formatCurrency(product.originalPrice)}
                                    </span>
                                </div>

                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-green-700 text-sm font-medium">Acesso Vitalício Garantido</span>
                                </div>
                            </div>


                            <div className="bg-gray-50 rounded-lg p-4 lg:p-6 border border-gray-100">
                                <div className="flex items-center gap-2 text-black font-semibold mb-3">
                                    <Gift className="w-5 h-5 text-green-600" />
                                    <span>Bônus Exclusivos Inclusos</span>
                                </div>
                                <ul className="space-y-2">
                                    {product.bonuses.map((bonus, index) => (
                                        <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                            {bonus}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardHeader>
                    </Card>


                    <div className="hidden lg:block">
                        <SocialProof />
                    </div>
                </div>


                <div className="space-y-6">

                    <div className="lg:hidden">
                        <SocialProof />
                    </div>


                    <form onSubmit={handleSubmit} className="space-y-6">

                        <Card className="bg-white border border-gray-100 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                        <Target className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-black font-semibold text-lg">Seus Dados</h3>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-black font-medium">
                                        Email *
                                    </Label>
                                                                            <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            placeholder="seu@email.com"
                                            className={`h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 ${errors.email ? "border-red-500" : ""}`}
                                            aria-describedby={errors.email ? "email-error" : undefined}
                                            aria-invalid={!!errors.email}
                                            autoComplete="email"
                                            required
                                        />
                                    {errors.email && <p id="email-error" className="text-sm text-red-500" role="alert">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cpf" className="text-black font-medium">
                                        CPF *
                                    </Label>
                                    <Input
                                        id="cpf"
                                        value={cpfMask}
                                        onChange={(e) => handleCPFChange(e.target.value)}
                                        placeholder="000.000.000-00"
                                        maxLength={14}
                                        className={`h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 ${errors.cpf ? "border-red-500" : ""}`}
                                        aria-describedby={errors.cpf ? "cpf-error" : undefined}
                                        aria-invalid={!!errors.cpf}
                                        autoComplete="off"
                                        required
                                    />
                                    {errors.cpf && <p id="cpf-error" className="text-sm text-red-500" role="alert">{errors.cpf}</p>}
                                </div>
                            </CardContent>
                        </Card>


                        <Card className="bg-white border border-gray-100 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-black font-semibold text-lg">Pagamento Seguro</h3>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <RadioGroup
                                    value={formData.paymentMethod}
                                    onValueChange={(value) => handlePaymentMethodChange(value as "pix" | "card")}
                                    className="space-y-3"
                                    aria-label="Método de pagamento"
                                >

                                    <div className="relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-green-600 rounded-lg opacity-20"></div>
                                        <div className="relative flex items-center space-x-4 p-6 rounded-lg bg-green-50 border-2 border-green-200">
                                            <RadioGroupItem value="pix" id="pix" className="border-green-600 text-green-600" />
                                            <Label htmlFor="pix" className="flex-1 cursor-pointer">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <QrCode className="w-6 h-6 text-green-600" />
                                                        <div>
                                                            <span className="font-bold text-black text-xl">PIX</span>
                                                            <p className="text-green-700 text-sm">Aprovação instantânea</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <Badge className="bg-green-600 text-white font-bold mb-1">
                                                            <Zap className="w-3 h-3 mr-1" />
                                                            TAXA 0%
                                                        </Badge>
                                                        <p className="text-green-700 text-xs font-medium">Economize {formatCurrency(calculations.savings)}</p>
                                                    </div>
                                                </div>
                                            </Label>
                                        </div>
                                    </div>


                                    <div className="flex items-center space-x-4 p-6 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors">
                                        <RadioGroupItem value="card" id="card" className="border-gray-400" />
                                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <CreditCardIcon className="w-6 h-6 text-gray-600" />
                                                <div>
                                                    <span className="font-semibold text-black text-lg">Cartão de Crédito</span>
                                                    <p className="text-gray-600 text-sm">Parcelamento disponível</p>
                                                </div>
                                            </div>
                                        </Label>
                                    </div>
                                </RadioGroup>

                                {formData.paymentMethod === "card" && (
                                    <div className="space-y-6 pl-6">

                                        <div className="flex justify-center">
                                            <CreditCard
                                                number={cardNumber}
                                                holder={cardHolder}
                                                validity={cardValidity}
                                                cvv={cardCVV}
                                                isFlipped={isCardFlipped}
                                                className="scale-75"
                                            />
                                        </div>


                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="cardNumber" className="text-black font-medium">
                                                    Número do cartão *
                                                </Label>
                                                <Input
                                                    id="cardNumber"
                                                    value={cardNumber}
                                                    onChange={(e) => handleCardNumberChange(e.target.value)}
                                                    placeholder="**** **** **** ****"
                                                    maxLength={19}
                                                    className={`h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 ${cardErrors.number ? "border-red-500" : ""}`}
                                                />
                                                {cardErrors.number && (
                                                    <p className="text-sm text-red-500">{cardErrors.number.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="cardHolder" className="text-black font-medium">
                                                    Nome do titular *
                                                </Label>
                                                <Input
                                                    id="cardHolder"
                                                    value={cardHolder}
                                                    onChange={(e) => handleCardHolderChange(e.target.value)}
                                                    placeholder="Nome como está no cartão"
                                                    className={`h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 ${cardErrors.holder ? "border-red-500" : ""}`}
                                                />
                                                {cardErrors.holder && (
                                                    <p className="text-sm text-red-500">{cardErrors.holder.message}</p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="cardValidity" className="text-black font-medium">
                                                        Validade *
                                                    </Label>
                                                    <Input
                                                        id="cardValidity"
                                                        value={cardValidity}
                                                        onChange={(e) => handleCardValidityChange(e.target.value)}
                                                        placeholder="MM/AA"
                                                        maxLength={5}
                                                        className={`h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 ${cardErrors.validity ? "border-red-500" : ""}`}
                                                    />
                                                    {cardErrors.validity && (
                                                        <p className="text-sm text-red-500">{cardErrors.validity.message}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="cardCvv" className="text-black font-medium">
                                                        CVV *
                                                    </Label>
                                                    <Input
                                                        id="cardCvv"
                                                        value={cardCVV}
                                                        onChange={(e) => handleCVVChange(e.target.value)}
                                                        placeholder="***"
                                                        maxLength={4}
                                                        onFocus={flipCard}
                                                        onBlur={unflipCard}
                                                        className={`h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 ${cardErrors.cvv ? "border-red-500" : ""}`}
                                                    />
                                                    {cardErrors.cvv && (
                                                        <p className="text-sm text-red-500">{cardErrors.cvv.message}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>


                                        <div className="space-y-2">
                                            <Label htmlFor="installments" className="text-black font-medium">
                                                Parcelas
                                            </Label>
                                            <Select
                                                value={formData.installments.toString()}
                                                onValueChange={(value) =>
                                                    setFormData((prev) => ({ ...prev, installments: Number.parseInt(value) }))
                                                }
                                            >
                                                <SelectTrigger className="h-12 border-gray-200 focus:border-green-500">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border-gray-200">
                                                    {installmentOptions.map((option, index) => {
                                                        const calc = installmentCalculations[index]
                                                        return (
                                                            <SelectItem key={option} value={option.toString()} className="hover:bg-gray-50">
                                                                {option}x de {formatCurrency(calc.installmentValue)}
                                                                {option === 1 ? " (à vista)" : ""}
                                                            </SelectItem>
                                                        )
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>


                        <Card className="bg-white border border-gray-100 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                        <TrendingUp className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-black font-semibold text-lg">Resumo do Pedido</h3>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-gray-700">
                                    <span>Curso completo:</span>
                                    <span className="font-semibold">{formatCurrency(product.currentPrice)}</span>
                                </div>

                                <div className="flex justify-between text-gray-700">
                                    <span>Taxa da plataforma ({calculations.feePercentage.toFixed(2)}%):</span>
                                    <span className={`font-semibold ${calculations.platformFee === 0 ? "text-green-600" : ""}`}>
                                        {calculations.platformFee === 0 ? "R$ 0,00" : `+ ${formatCurrency(calculations.platformFee)}`}
                                    </span>
                                </div>

                                {formData.paymentMethod === "pix" && calculations.savings > 0 && (
                                    <div className="flex justify-between text-green-600 font-semibold bg-green-50 p-3 rounded-lg">
                                        <span>💰 Economia com PIX:</span>
                                        <span>-{formatCurrency(calculations.savings)}</span>
                                    </div>
                                )}

                                <Separator className="bg-gray-200" />

                                <div className="flex justify-between font-bold text-xl text-black">
                                    <span>Total a pagar:</span>
                                    <span className="text-green-600">{formatCurrency(calculations.totalAmount)}</span>
                                </div>

                                <div className="flex justify-between text-sm text-gray-600 pt-2 border-t border-gray-100">
                                    <span>{product.producer} recebe:</span>
                                    <span className="font-semibold text-black">{formatCurrency(calculations.producerReceives)}</span>
                                </div>

                                {formData.paymentMethod === "card" && formData.installments > 1 && (
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        💳 {formData.installments}x de {formatCurrency(calculations.installmentValue)} no cartão
                                    </p>
                                )}
                            </CardContent>
                        </Card>


                        <div className="relative">
                            <Button
                                type="submit"
                                className="w-full h-16 text-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-xl transform hover:scale-[1.02] transition-all duration-200 rounded-lg"
                                disabled={!isFormValid || isLoading || (formData.paymentMethod === "card" && !isCardValid)}
                                aria-describedby="submit-button-description"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                        Processando Pagamento...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-6 h-6 mr-3" />
                                        GARANTIR ACESSO AGORA
                                    </>
                                )}
                            </Button>
                        </div>


                        <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                <span>Pagamento Seguro</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                <span>Garantia 7 dias</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
