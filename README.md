# Teste Front-End Cakto - Mini Checkout

## Decisões Técnicas

### Arquitetura e Organização
Optei por uma arquitetura baseada em **composição de componentes** e **hooks customizados** para garantir reutilização e separação de responsabilidades. A estrutura segue o padrão do Next.js 13+ com App Router, utilizando Server Components para dados estáticos e Client Components apenas onde necessário para interatividade.

### Gerenciamento de Estado e Performance
Implementei **hooks especializados** (`useCheckoutCalculations`, `useFormValidation`, `useCreditCardForm`) para encapsular lógicas específicas e evitar re-renders desnecessários. Utilizei `useMemo` para cálculos pesados e `useCallback` para handlers, além de **lazy loading** com `dynamic()` para componentes não críticos como animações e social proof.

### Validações e UX
Criei um sistema de validação em tempo real que não bloqueia a digitação, com feedback visual imediato. A validação de CPF implementa o algoritmo completo dos dígitos verificadores, e o cartão de crédito usa o algoritmo de Luhn. O destaque visual para PIX incentiva a conversão através de badges, cores e economia destacada.

## Como Executar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para visualizar a aplicação.

## Testes

```bash
npm test
npm run test:watch
```

## Funcionalidades Implementadas

### ✅ Calculadora de Taxas
- **PIX:** 0% de taxa
- **Cartão à vista:** 3.99%
- **Cartão parcelado:** 4.99% + 2% por parcela extra
- Cálculo em tempo real com exibição do valor líquido para o produtor

### ✅ Formulário Completo
- Email com validação regex
- CPF com máscara automática e validação de dígitos verificadores
- Método de pagamento (PIX destacado visualmente)
- Seleção de parcelas de 1x até 12x para cartão
- Formulário completo de cartão com validação Luhn

### ✅ Resumo Dinâmico
- Atualização em tempo real
- Destaque da economia ao escolher PIX
- Exibição clara de todos os valores e taxas

### ✅ UX Otimizada
- **Mobile-first** responsivo
- Validação em tempo real sem travamento
- Loading states e micro-interações
- Componentes acessíveis com ARIA labels
- Performance otimizada com lazy loading

## Tecnologias Utilizadas

- **Next.js 15** com App Router
- **React 19** com TypeScript
- **TailwindCSS** para styling
- **Radix UI** para componentes base
- **React Hook Form + Zod** para validação robusta
- **Lucide React** para ícones
- **Biome** para linting e formatação
- **Jest + Testing Library** para testes unitários e integração

## Otimizações Implementadas

### Performance
- Lazy loading de componentes não críticos
- Memoização de cálculos pesados
- Callbacks otimizados para evitar re-renders
- Bundle splitting automático do Next.js

### Acessibilidade
- ARIA labels e roles adequados
- Navegação por teclado funcional
- Feedback de erro com `role="alert"`
- Contraste adequado e focus visível

### Testes
- Cobertura completa do componente principal
- Testes unitários dos hooks customizados
- Testes das funções utilitárias
- Mocks apropriados para componentes dinâmicos
- Testes de acessibilidade e interação do usuário

## Resposta Bônus

### Estratégias de Conversão Implementadas
1. **Urgência Elegante:** Timer de countdown e contador de visualizações em tempo real
2. **Destaque PIX:** Gradiente, badges e economia destacada para incentivar o método sem taxa
3. **Social Proof:** Avaliações, número de alunos e depoimentos visíveis
4. **Transparência:** Cálculo claro de todas as taxas e valor líquido para o produtor

**"Se tivesse mais tempo, o que você faria para aumentar a conversão deste checkout?"**

1. **Testes A/B:** Implementar múltiplas variações do layout e CTAs
2. **Abandono de Carrinho:** Sistema de recuperação via email/SMS
3. **Upsell Inteligente:** Sugestões de produtos complementares no checkout
4. **Gamificação:** Sistema de pontos ou benefícios para compras recorrentes
5. **Pagamento em 1-Click:** Salvar dados do usuário para compras futuras
6. **Análise de Comportamento:** Heatmaps e tracking de eventos para otimização
7. **Ofertas Dinâmicas:** Descontos progressivos baseados no tempo de permanência
8. **Comparação de Preços:** Mostrar economia vs concorrentes
9. **Garantias Visuais:** Selos de segurança e certificações em destaque
10. **Chat de Vendas:** Suporte em tempo real para dúvidas no checkout