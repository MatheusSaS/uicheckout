import {
  formatCurrency,
  formatCPF,
  validateCPF,
  validateEmail,
  calculateCheckout,
  validateCreditCard,
  validateCreditCardValidity,
  validateCVV,
  maskCreditCardNumber,
  maskCreditCardValidity,
} from '@/lib/utils'

describe('Utils', () => {
  describe('formatCurrency', () => {
    it('deve formatar valores em reais corretamente', () => {
      expect(formatCurrency(297)).toBe('R$ 297,00')
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56')
      expect(formatCurrency(0)).toBe('R$ 0,00')
    })
  })

  describe('formatCPF', () => {
    it('deve aplicar máscara no CPF', () => {
      expect(formatCPF('12345678901')).toBe('123.456.789-01')
      expect(formatCPF('123456789')).toBe('123.456.789')
      expect(formatCPF('123456')).toBe('123.456')
      expect(formatCPF('123')).toBe('123')
    })

    it('deve remover caracteres não numéricos', () => {
      expect(formatCPF('123.456.789-01')).toBe('123.456.789-01')
      expect(formatCPF('abc123def456ghi789jkl01')).toBe('123.456.789-01')
    })
  })

  describe('validateCPF', () => {
    it('deve validar CPFs válidos', () => {
      expect(validateCPF('11144477735')).toBe(true)
      expect(validateCPF('111.444.777-35')).toBe(true)
    })

    it('deve invalidar CPFs inválidos', () => {
      expect(validateCPF('11111111111')).toBe(false) // Todos iguais
      expect(validateCPF('123.456.789-00')).toBe(false) // Dígitos incorretos
      expect(validateCPF('123')).toBe(false) // Muito curto
      expect(validateCPF('')).toBe(false) // Vazio
    })
  })

  describe('validateEmail', () => {
    it('deve validar emails válidos', () => {
      expect(validateEmail('teste@exemplo.com')).toBe(true)
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true)
    })

    it('deve invalidar emails inválidos', () => {
      expect(validateEmail('email-invalido')).toBe(false)
      expect(validateEmail('@exemplo.com')).toBe(false)
      expect(validateEmail('teste@')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('calculateCheckout', () => {
    const productPrice = 297

    it('deve calcular PIX corretamente', () => {
      const result = calculateCheckout(productPrice, 'pix', 1)
      
      expect(result).toEqual({
        totalAmount: 297,
        platformFee: 0,
        producerReceives: 297,
        installmentValue: 297,
        feePercentage: 0,
        savings: 11.8403,
      })
    })

    it('deve calcular cartão à vista corretamente', () => {
      const result = calculateCheckout(productPrice, 'card', 1)
      const expectedFee = productPrice * 0.0399
      
      expect(result).toEqual({
        totalAmount: productPrice + expectedFee,
        platformFee: expectedFee,
        producerReceives: productPrice,
        installmentValue: productPrice + expectedFee,
        feePercentage: 3.99,
        savings: 0,
      })
    })

    it('deve calcular cartão parcelado corretamente', () => {
      const result = calculateCheckout(productPrice, 'card', 3)
      const expectedFeePercentage = 4.99 + (3 - 1) * 2 // 8.99%
      const expectedFee = productPrice * (expectedFeePercentage / 100)
      const expectedTotal = productPrice + expectedFee
      
      expect(result).toEqual({
        totalAmount: expectedTotal,
        platformFee: expectedFee,
        producerReceives: productPrice,
        installmentValue: expectedTotal / 3,
        feePercentage: expectedFeePercentage,
        savings: 0,
      })
    })
  })

  describe('Credit Card Validation', () => {
    describe('validateCreditCard', () => {
      it('deve validar números de cartão válidos', () => {
        expect(validateCreditCard('4111111111111111')).toBe(true) // Visa
        expect(validateCreditCard('5555555555554444')).toBe(true) // Mastercard
        expect(validateCreditCard('4111 1111 1111 1111')).toBe(true) // Com espaços
      })

      it('deve invalidar números de cartão inválidos', () => {
        expect(validateCreditCard('1234567890123456')).toBe(false)
        expect(validateCreditCard('411111111111111')).toBe(false) // Muito curto
        expect(validateCreditCard('')).toBe(false)
      })
    })

    describe('validateCreditCardValidity', () => {
      it('deve validar datas futuras', () => {
        const futureDate = new Date()
        futureDate.setFullYear(futureDate.getFullYear() + 1)
        const year = futureDate.getFullYear().toString().slice(-2)
        const month = (futureDate.getMonth() + 1).toString().padStart(2, '0')
        
        expect(validateCreditCardValidity(`${month}/${year}`)).toBe(true)
      })

      it('deve invalidar datas passadas', () => {
        expect(validateCreditCardValidity('01/20')).toBe(false)
      })

      it('deve invalidar formatos inválidos', () => {
        expect(validateCreditCardValidity('1325')).toBe(false) // Mês inválido
        expect(validateCreditCardValidity('13/25')).toBe(false) // Mês > 12
        expect(validateCreditCardValidity('ab/cd')).toBe(false) // Não numérico
      })
    })

    describe('validateCVV', () => {
      it('deve validar CVVs válidos', () => {
        expect(validateCVV('123')).toBe(true)
        expect(validateCVV('1234')).toBe(true) // Amex
      })

      it('deve invalidar CVVs inválidos', () => {
        expect(validateCVV('12')).toBe(false) // Muito curto
        expect(validateCVV('12345')).toBe(false) // Muito longo
        expect(validateCVV('abc')).toBe(false) // Não numérico
      })
    })

    describe('maskCreditCardNumber', () => {
      it('deve aplicar máscara nos números', () => {
        expect(maskCreditCardNumber('4111111111111111')).toBe('4111 1111 1111 1111')
        expect(maskCreditCardNumber('4111')).toBe('4111')
        expect(maskCreditCardNumber('')).toBe('')
      })
    })

    describe('maskCreditCardValidity', () => {
      it('deve aplicar máscara na validade', () => {
        expect(maskCreditCardValidity('1225')).toBe('12/25')
        expect(maskCreditCardValidity('12')).toBe('12')
        expect(maskCreditCardValidity('')).toBe('')
      })
    })
  })
})