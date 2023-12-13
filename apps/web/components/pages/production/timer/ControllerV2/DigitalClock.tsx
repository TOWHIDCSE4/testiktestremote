import { cva, type VariantProps } from "class-variance-authority"
import { Lato } from "next/font/google"
import { useContext, useMemo } from "react"
import useColor from "./useColor"
import { ControllerContext } from "./ControllerContext"
import {
  hourMinuteSecond,
  hourMinuteSecondInNumber,
  hourMinuteSecondMilli,
} from "../../../../../helpers/timeConverter"

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
      digit: ["w-[2.5rem]"],
      divider: ["w-[1.5rem]", "mb-3"],
    },
    size: { primary: ["text-[5rem]"] },
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
  const {
    variant,
    controllerDetailData,
    controllerClockSeconds,
    cycleClockSeconds,
  } = useContext(ControllerContext)
  const color = useColor({ variant })

  const controllerClockArray = hourMinuteSecondInNumber(cycleClockSeconds)
  const cycleClockSecondsArray = hourMinuteSecondMilli(cycleClockSeconds)

  return (
    <div
      className={`border-4 border-${color} bg-${color} bg-opacity-10 rounded-lg px-6 ${lato.className}`}
    >
      <div className="flex items-center justify-center gap-3 h-[6rem]">
        <div
          className={clockDigitCV({
            intent: controllerClockArray[0] < 10 ? "zero" : "primary",
          })}
        >
          {Math.floor(controllerClockArray[0] / 10)}
        </div>
        <div
          className={clockDigitCV({
            intent: controllerClockArray[0] > 0 ? "primary" : "zero",
          })}
        >
          {controllerClockArray[0] % 10}
        </div>
        <div
          className={clockDigitCV({
            intent: controllerClockArray[0] > 0 ? "primary" : "zero",
            type: "divider",
          })}
        >
          :
        </div>
        <div
          className={clockDigitCV({
            intent: controllerClockArray[1] < 10 ? "zero" : "primary",
          })}
        >
          {Math.floor(controllerClockArray[1] / 10)}
        </div>
        <div
          className={clockDigitCV({
            intent: controllerClockArray[1] > 0 ? "primary" : "zero",
          })}
        >
          {controllerClockArray[1] % 10}
        </div>
        <div
          className={clockDigitCV({
            intent: controllerClockArray[1] > 0 ? "primary" : "zero",
            type: "divider",
          })}
        >
          :
        </div>
        <div
          className={clockDigitCV({
            intent: controllerClockArray[2] < 10 ? "zero" : "primary",
          })}
        >
          {Math.floor(controllerClockArray[2] / 10)}
        </div>
        <div
          className={clockDigitCV({
            intent: controllerClockArray[2] > 0 ? "primary" : "zero",
          })}
        >
          {controllerClockArray[2] % 10}
        </div>
        <div
          className={clockDigitCV({
            intent: controllerClockArray[2] > 0 ? "primary" : "zero",
            type: "divider",
          })}
        >
          :
        </div>
        <div
          className={clockDigitCV({
            intent: controllerClockArray[3] < 10 ? "zero" : "primary",
          })}
        >
          {Math.floor(controllerClockArray[3] / 10)}
        </div>
        <div
          className={clockDigitCV({
            intent: controllerClockArray[3] > 0 ? "primary" : "zero",
          })}
        >
          {controllerClockArray[3] % 10}
        </div>
      </div>
    </div>
  )
}
