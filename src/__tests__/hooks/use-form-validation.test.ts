import { renderHook, act } from '@testing-library/react'
import { useFormValidation } from '@/hooks/use-form-validation'

describe('useFormValidation', () => {
  it('deve inicializar sem erros', () => {
    const { result } = renderHook(() => useFormValidation())

    expect(result.current.errors).toEqual({})
    expect(result.current.isFormValid).toBe(true)
  })

  it('deve adicionar erro de validação', () => {
    const { result } = renderHook(() => useFormValidation())

    act(() => {
      result.current.validateField('email', 'Email inválido')
    })

    expect(result.current.errors.email).toBe('Email inválido')
    expect(result.current.isFormValid).toBe(false)
  })

  it('deve remover erro quando campo torna-se válido', () => {
    const { result } = renderHook(() => useFormValidation())

    act(() => {
      result.current.validateField('email', 'Email inválido')
    })

    expect(result.current.errors.email).toBe('Email inválido')

    act(() => {
      result.current.validateField('email', '')
    })

    expect(result.current.errors.email).toBeUndefined()
    expect(result.current.isFormValid).toBe(true)
  })

  it('deve gerenciar múltiplos erros', () => {
    const { result } = renderHook(() => useFormValidation())

    act(() => {
      result.current.validateField('email', 'Email inválido')
      result.current.validateField('cpf', 'CPF inválido')
    })

    expect(result.current.errors.email).toBe('Email inválido')
    expect(result.current.errors.cpf).toBe('CPF inválido')
    expect(result.current.isFormValid).toBe(false)
  })

  it('deve ser válido apenas quando todos os erros forem removidos', () => {
    const { result } = renderHook(() => useFormValidation())

    act(() => {
      result.current.validateField('email', 'Email inválido')
      result.current.validateField('cpf', 'CPF inválido')
    })

    expect(result.current.isFormValid).toBe(false)

    act(() => {
      result.current.validateField('email', '')
    })

    expect(result.current.isFormValid).toBe(false) // Ainda há erro no CPF

    act(() => {
      result.current.validateField('cpf', '')
    })

    expect(result.current.isFormValid).toBe(true) // Agora todos os erros foram removidos
  })
})