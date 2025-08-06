import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, "")

  if (cleanCPF.length <= 3) return cleanCPF
  if (cleanCPF.length <= 6) return `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3)}`
  if (cleanCPF.length <= 9) return `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3, 6)}.${cleanCPF.slice(6)}`

  return `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3, 6)}.${cleanCPF.slice(6, 9)}-${cleanCPF.slice(9, 11)}`
}

export function validateCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, "")

  if (cleanCPF.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(cleanCPF.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(cleanCPF.charAt(10))) return false

  return true
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}


export function maskCreditCardNumber(value: string): string {
  const cleanValue = value.replace(/\D/g, "")
  const match = cleanValue.match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/)
  if (!match) return ""
  
  return [match[1], match[2], match[3], match[4]]
    .filter(Boolean)
    .join(" ")
    .trim()
}

export function maskCreditCardValidity(value: string): string {
  const cleanValue = value.replace(/\D/g, "")
  if (cleanValue.length <= 2) return cleanValue
  return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`
}

export function validateCreditCard(number: string): boolean {
  const cleanNumber = number.replace(/\s+/g, "")
  if (!/^\d{13,19}$/.test(cleanNumber)) return false
  

  let sum = 0
  let isEvenIndex = false
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(cleanNumber.charAt(i))
    
    if (isEvenIndex) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    
    sum += digit
    isEvenIndex = !isEvenIndex
  }
  
  return sum % 10 === 0
}

export function validateCreditCardValidity(validity: string): boolean {
  const match = validity.match(/^(\d{2})\/(\d{2})$/)
  if (!match) return false
  
  const month = Number.parseInt(match[1])
  const year = Number.parseInt(`20${match[2]}`)
  
  if (month < 1 || month > 12) return false
  
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  
  if (year < currentYear) return false
  if (year === currentYear && month < currentMonth) return false
  
  return true
}

export function validateCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv)
}

export function getCardBrand(number: string): string {
  const cleanNumber = number.replace(/\s+/g, "")
  
  if (/^4/.test(cleanNumber)) return "visa"
  if (/^5[1-5]/.test(cleanNumber)) return "mastercard"
  if (/^3[47]/.test(cleanNumber)) return "amex"
  if (/^6(?:011|5)/.test(cleanNumber)) return "discover"
  if (/^35(2[89]|[3-8]\d)/.test(cleanNumber)) return "jcb"
  
  return "unknown"
}

export function calculateCheckout(productPrice: number, paymentMethod: "pix" | "card", installments = 1) {
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
}
