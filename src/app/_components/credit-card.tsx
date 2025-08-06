"use client"

import { CreditCardProps } from "@/lib/types"
import { cn } from "@/lib/utils"

export function CreditCard({
  number,
  holder,
  validity,
  cvv,
  isFlipped = false,
  className,
}: CreditCardProps) {
  const formattedNumber = number
    .replace(/\s+/g, "")
    .replace(/\D/g, "")
    .padEnd(16, "*")

  const fourFirstDigits = formattedNumber.substring(0, 4)
  const fourSecondDigits = formattedNumber.substring(4, 8)
  const fourThirdDigits = formattedNumber.substring(8, 12)
  const fourLastDigits = formattedNumber.substring(12, 16)

  const [validityMonth, validityYear] = validity?.replace(/\s+/g, "").split("/") || ["**", "**"]

  const formattedValidityMonth = validityMonth?.replace(/\D/g, "").padEnd(2, "*") || "**"
  const formattedValidityYear = validityYear?.replace(/\D/g, "").padEnd(2, "*") || "**"

  const formattedCVV = cvv.replace(/\s+/g, "").replace(/\D/g, "").padEnd(3, "*")

  return (
    <div className={cn("group h-48 w-80 [perspective:60rem]", className)}>
      {/* Front of the card */}
      <div
        className={cn(
          "absolute left-0 top-0 z-50 flex h-full w-full flex-col justify-between rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 text-white shadow-2xl transition-all duration-700 [backface-visibility:hidden] [transform-style:preserve-3d]",
          isFlipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
        )}
      >
        {/* Card header */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold tracking-wider">CARD</div>
          <div className="flex space-x-1">
            <div className="h-8 w-12 rounded bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
            <div className="h-8 w-12 rounded bg-gradient-to-r from-red-500 to-red-600"></div>
          </div>
        </div>

        {/* Chip */}
        <div className="flex items-center">
          <div className="h-8 w-12 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-400 shadow-inner"></div>
        </div>

        {/* Card number */}
        <div className="space-y-4">
          <div className="flex justify-between text-xl font-mono tracking-[0.2em]">
            <span>{fourFirstDigits}</span>
            <span>{fourSecondDigits}</span>
            <span>{fourThirdDigits}</span>
            <span>{fourLastDigits}</span>
          </div>

          {/* Holder and validity */}
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wider text-gray-300">Card Holder</div>
              <div className="truncate font-semibold uppercase tracking-wide">
                {holder || "NOME DO TITULAR"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-gray-300">Valid Thru</div>
              <div className="font-mono text-lg tracking-wider">
                {formattedValidityMonth}/{formattedValidityYear}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back of the card */}
      <div
        className={cn(
          "absolute left-0 top-0 z-50 flex h-full w-full flex-col rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white shadow-2xl transition-all duration-700 [backface-visibility:hidden] [transform-style:preserve-3d]",
          isFlipped ? "[transform:rotateY(0deg)]" : "[transform:rotateY(-180deg)]"
        )}
      >
        {/* Magnetic stripe */}
        <div className="mt-6 h-12 w-full bg-black"></div>

        {/* CVV section */}
        <div className="flex-1 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="h-8 flex-1 rounded bg-white px-3 py-1 text-right">
              <span className="font-mono text-black">{formattedCVV}</span>
            </div>
            <span className="text-sm font-medium text-gray-300">CVV</span>
          </div>

          <div className="mt-6 text-xs text-gray-400">
            <p>Este cartão pertence ao portador cujo nome está impresso na frente.</p>
            <p className="mt-2">Comunique imediatamente qualquer uso não autorizado.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="text-xs text-gray-400">www.banco.com.br</div>
        </div>
      </div>
    </div>
  )
}