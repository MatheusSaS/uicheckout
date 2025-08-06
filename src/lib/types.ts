export interface Product {
    id: number
    name: string
    originalPrice: number
    currentPrice: number
    producer: string
    format: "digital" | "physical"
    deliveryTime: "imediato" | string
    studentsCount: number
    rating: number
    reviewsCount: number
    bonuses: string[]
}

export interface CheckoutFormProps {
    product: Product
}

export interface CreditCardProps {
    number: string
    holder: string
    validity: string
    cvv: string
    isFlipped?: boolean
    className?: string
}


export interface Calculations {
    totalAmount: number
    platformFee: number
    producerReceives: number
    installmentValue: number
    feePercentage: number
    savings: number
}

export interface ValidationErrors {
    email?: string
    cpf?: string
    cardNumber?: string
    cardHolder?: string
    cardValidity?: string
    cardCvv?: string
}