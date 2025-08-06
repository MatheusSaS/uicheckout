import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Product } from '@/lib/types'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

export const mockProduct: Product = {
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
  bonuses: [
    "E-book: 50 Templates de Posts",
    "Planilha de ROI Automática", 
    "Acesso ao Grupo VIP no Telegram"
  ],
}

export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0))