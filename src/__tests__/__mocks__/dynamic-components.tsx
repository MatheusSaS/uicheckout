export const PulsingDot = () => <div data-testid="pulsing-dot">●</div>

export const CountdownTimer = () => (
  <div data-testid="countdown-timer">
    <div>⏰ Oferta acaba em: 23:59:30</div>
  </div>
)

export const SocialProof = () => (
  <div data-testid="social-proof">
    <div>👥 Mais de 2.800 alunos já compraram</div>
  </div>
)

export const CreditCard = ({ number, holder, validity, cvv, isFlipped }: any) => (
  <div data-testid="credit-card" data-flipped={isFlipped}>
    <div>Número: {number}</div>
    <div>Titular: {holder}</div>
    <div>Validade: {validity}</div>
    {isFlipped && <div>CVV: {cvv}</div>}
  </div>
)