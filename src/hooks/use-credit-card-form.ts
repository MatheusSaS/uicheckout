"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { 
  validateCreditCard, 
  validateCreditCardValidity, 
  validateCVV,
  maskCreditCardNumber,
  maskCreditCardValidity
} from "@/lib/utils"

const creditCardFormSchema = z.object({
  number: z
    .string()
    .min(1, { message: "Informe o número do cartão" })
    .refine((value) => validateCreditCard(value), {
      message: "Número do cartão inválido"
    }),
  holder: z
    .string()
    .min(3, { message: "Informe o nome do titular do cartão" })
    .max(50, { message: "Nome muito longo" }),
  validity: z
    .string()
    .min(5, { message: "Informe a validade" })
    .refine((value) => validateCreditCardValidity(value), {
      message: "Data de validade inválida"
    }),
  cvv: z
    .string()
    .min(3, { message: "Informe o CVV" })
    .max(4, { message: "CVV inválido" })
    .refine((value) => validateCVV(value), {
      message: "CVV inválido"
    }),
})

export type CreditCardFormInput = z.infer<typeof creditCardFormSchema>

export function useCreditCardForm() {
  const [isCardFlipped, setIsCardFlipped] = useState(false)

  const form = useForm<CreditCardFormInput>({
    resolver: zodResolver(creditCardFormSchema),
    defaultValues: {
      number: "",
      holder: "",
      validity: "",
      cvv: "",
    },
    mode: "onChange"
  })

  const {
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    getValues,
  } = form

  const cardNumber = watch("number") || ""
  const cardHolder = watch("holder") || ""
  const cardValidity = watch("validity") || ""
  const cardCVV = watch("cvv") || ""

  const handleCardNumberChange = (value: string) => {
    const masked = maskCreditCardNumber(value)
    setValue("number", masked, { shouldValidate: true, shouldDirty: true })
  }

  const handleCardValidityChange = (value: string) => {
    const masked = maskCreditCardValidity(value)
    setValue("validity", masked, { shouldValidate: true, shouldDirty: true })
  }

  const handleCardHolderChange = (value: string) => {
    const formatted = value.toUpperCase().replace(/[^A-Z\s]/g, "")
    setValue("holder", formatted, { shouldValidate: true, shouldDirty: true })
  }

  const handleCVVChange = (value: string) => {
    const clean = value.replace(/\D/g, "").slice(0, 4)
    setValue("cvv", clean, { shouldValidate: true, shouldDirty: true })
  }

  const flipCard = () => setIsCardFlipped(true)
  const unflipCard = () => setIsCardFlipped(false)

  const resetForm = () => {
    form.reset()
    setIsCardFlipped(false)
  }

  return {
    form,
    handleSubmit,
    errors,
    isValid,
    cardNumber,
    cardHolder,
    cardValidity,
    cardCVV,
    isCardFlipped,
    handleCardNumberChange,
    handleCardValidityChange,
    handleCardHolderChange,
    handleCVVChange,
    flipCard,
    unflipCard,
    resetForm,
    getValues,
  }
}