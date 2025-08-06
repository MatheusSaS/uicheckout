import { CheckoutForm } from "./_components/checkout-form"

const mockProduct = {
  id: 1,
  name: "Curso de Marketing Digital 2025",
  originalPrice: 497.0,
  currentPrice: 297.0,
  producer: "João Silva",
  format: "digital" as const,
  deliveryTime: "imediato",
  studentsCount: 2847,
  rating: 4.9,
  reviewsCount: 1205,
  bonuses: ["E-book: 50 Templates de Posts", "Planilha de ROI Automática", "Acesso ao Grupo VIP no Telegram"],
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black">

      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%), 
                           linear-gradient(-45deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="relative z-10 py-4 md:py-8 px-4">
        <div className="max-w-md md:max-w-7xl mx-auto">
          <CheckoutForm product={mockProduct} />
        </div>
      </div>
    </div>
  )
}
