import { renderHook } from '@testing-library/react'
import { useCheckoutCalculations } from '@/hooks/use-checkout-calculations'

describe('useCheckoutCalculations', () => {
  const productPrice = 297

  describe('PIX Payment', () => {
    it('deve calcular corretamente para PIX', () => {
      const { result } = renderHook(() => 
        useCheckoutCalculations(productPrice, 'pix', 1)
      )

      expect(result.current.calculations).toEqual({
        totalAmount: 297,
        platformFee: 0,
        producerReceives: 297,
        installmentValue: 297,
        feePercentage: 0,
        savings: 11.8403, // 297 * 0.0399
      })
    })
  })

  describe('Card Payment', () => {
    it('deve calcular corretamente para cartão à vista', () => {
      const { result } = renderHook(() => 
        useCheckoutCalculations(productPrice, 'card', 1)
      )

      const expectedFee = productPrice * 0.0399
      const expectedTotal = productPrice + expectedFee

      expect(result.current.calculations).toEqual({
        totalAmount: expectedTotal,
        platformFee: expectedFee,
        producerReceives: productPrice,
        installmentValue: expectedTotal,
        feePercentage: 3.99,
        savings: 0,
      })
    })

    it('deve calcular corretamente para cartão parcelado (2x)', () => {
      const { result } = renderHook(() => 
        useCheckoutCalculations(productPrice, 'card', 2)
      )

      const expectedFeePercentage = 4.99 + (2 - 1) * 2 // 6.99%
      const expectedFee = productPrice * (expectedFeePercentage / 100)
      const expectedTotal = productPrice + expectedFee
      const expectedInstallment = expectedTotal / 2

      expect(result.current.calculations).toEqual({
        totalAmount: expectedTotal,
        platformFee: expectedFee,
        producerReceives: productPrice,
        installmentValue: expectedInstallment,
        feePercentage: expectedFeePercentage,
        savings: 0,
      })
    })

    it('deve calcular corretamente para cartão parcelado (12x)', () => {
      const { result } = renderHook(() => 
        useCheckoutCalculations(productPrice, 'card', 12)
      )

      const expectedFeePercentage = 4.99 + (12 - 1) * 2 // 26.99%
      const expectedFee = productPrice * (expectedFeePercentage / 100)
      const expectedTotal = productPrice + expectedFee
      const expectedInstallment = expectedTotal / 12

      expect(result.current.calculations).toEqual({
        totalAmount: expectedTotal,
        platformFee: expectedFee,
        producerReceives: productPrice,
        installmentValue: expectedInstallment,
        feePercentage: expectedFeePercentage,
        savings: 0,
      })
    })
  })

  describe('Reactivity', () => {
    it('deve recalcular quando o preço muda', () => {
      const { result, rerender } = renderHook(
        ({ price }) => useCheckoutCalculations(price, 'pix', 1),
        { initialProps: { price: 100 } }
      )

      expect(result.current.calculations.totalAmount).toBe(100)

      rerender({ price: 200 })
      expect(result.current.calculations.totalAmount).toBe(200)
    })

    it('deve recalcular quando o método de pagamento muda', () => {
      const { result, rerender } = renderHook(
        ({ method }) => useCheckoutCalculations(productPrice, method, 1),
        { initialProps: { method: 'pix' as const } }
      )

      expect(result.current.calculations.platformFee).toBe(0)

      rerender({ method: 'card' as const })
      expect(result.current.calculations.platformFee).toBeGreaterThan(0)
    })
  })
})