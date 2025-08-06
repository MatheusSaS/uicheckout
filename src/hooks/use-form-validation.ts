"use client"

import { ValidationErrors } from "@/lib/types"
import { useState, useCallback } from "react"

export function useFormValidation() {
    const [errors, setErrors] = useState<ValidationErrors>({})

    const validateField = useCallback((field: string, error: string) => {
        setErrors((prev) => ({
            ...prev,
            [field]: error || undefined,
        }))
    }, [])

    const isFormValid = Object.values(errors).every((error) => !error)

    return {
        errors,
        validateField,
        isFormValid,
    }
}
