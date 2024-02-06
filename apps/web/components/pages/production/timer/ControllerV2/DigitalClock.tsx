import { cva, type VariantProps } from "class-variance-authority"
import { Lato } from "next/font/google"
import { useContext, useMemo } from "react"
import { ControllerContext } from "./ControllerContext"
import { hourMinuteSecondInNumber } from "../../../../../helpers/timeConverter"
import StartButtonComponent from "./StartButton"
import PauseButtonComponent from "./PauseButton"
import { bgCV, borderCV } from "./classVariants"

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  subsets: ["latin", "latin-ext"],
})

const clockDigitCV = cva("transition-colors", {
  variants: {
    intent: {
      zero: [
        "text-[#BEBEBE]",
        "dark:text-white",
        "dark:opacity-30",
        "text-center",
        "font-bold",
      ],
      primary: [
        "text-[#0F2034]",
        "dark:text-white",
        "dark:opacity-100",
        "text-center",
        "font-bold",
      ],
    },
    type: {
      digit: ["w-[1.5rem]", "sm:w-[2.5rem]"],
      divider: ["w-[1.3rem]", "sm:w-[1.5rem]", "mb-3"],
    },
    // eslint-disable-next-line
    size: { primary: ["text-[3.3rem]", , "sm:text-[5rem]"] },
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
  const { variant, cycleClockSeconds } = useContext(ControllerContext)
  const bgColors = bgCV
  const borderColors = borderCV

  const controllerClockArray = hourMinuteSecondInNumber(cycleClockSeconds)

  return (
    <div className="relative flex flex-col items-center mx-auto font-lato w-fit">
      <div
        className={`border-4 transition-colors ${bgColors[variant]} bg-opacity-10 rounded-lg px-3 sm:px-6 ${lato.className} ${borderColors[variant]}`}
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3 h-[4rem] sm:h-[6rem]">
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
      <div className="relative w-full mt-3 sm:mt-4 lg:hidden">
        <div className="flex justify-center lg:hidden">
          <StartButtonComponent />
        </div>
        <div className="hidden sm:block absolute top-0 right-0 translate-y-[30%]">
          <PauseButtonComponent />
        </div>
      </div>
    </div>
  )
}
