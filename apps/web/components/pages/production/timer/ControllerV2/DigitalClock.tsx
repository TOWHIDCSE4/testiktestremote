import { cva, type VariantProps } from "class-variance-authority"
import { Lato } from "next/font/google"
import { useContext, useMemo } from "react"
import useColor from "./useColor"
import { ControllerContext } from "./ControllerContext"

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "block",
  subsets: ["latin", "latin-ext"],
})

const clockDigitCV = cva("div", {
  variants: {
    intent: {
      zero: ["text-[#BEBEBE]", "text-center", "font-bold"],
      primary: ["text-[#0F2034]", "text-center", "font-bold"],
    },
    type: {
      digit: ["w-[3.5rem]"],
      divider: ["w-[2rem]", "mb-3"],
    },
    size: { primary: ["text-[6rem]"] },
    font: { lato: ["!font-lato"] },
  },
  compoundVariants: [{ intent: "primary", size: "primary", className: "" }],
  defaultVariants: {
    intent: "primary",
    size: "primary",
    font: "lato",
    type: "digit",
  },
})

export default function DigitalClockComponent() {
  const { variant } = useContext(ControllerContext)
  const color = useColor({ variant })
  return (
    <div
      className={`border-4 border-${color} bg-${color} bg-opacity-10 rounded-lg px-6 ${lato.className}`}
    >
      <div className="flex items-center justify-center gap-3 h-[6rem]">
        <div className={clockDigitCV({ intent: "zero" })}>0</div>
        <div className={clockDigitCV({ intent: "zero" })}>0</div>
        <div className={clockDigitCV({ intent: "zero", type: "divider" })}>
          :
        </div>
        <div className={clockDigitCV({ intent: "zero" })}>0</div>
        <div className={clockDigitCV({ intent: "primary" })}>4</div>
        <div className={clockDigitCV({ intent: "primary", type: "divider" })}>
          :
        </div>
        <div className={clockDigitCV({ intent: "primary" })}>8</div>
        <div className={clockDigitCV({ intent: "primary" })}>9</div>
      </div>
    </div>
  )
}
