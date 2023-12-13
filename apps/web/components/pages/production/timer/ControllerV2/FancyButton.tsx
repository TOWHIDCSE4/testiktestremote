import { ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Lato } from "next/font/google"

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "block",
  subsets: ["latin", "latin-ext"],
})

const buttonCV = cva("transition-all", {
  variants: {
    intent: {
      idle: ["bg-[#DA8D00]", "active:scale-95", "active:bg-[#8d4c14]"],
      active: ["bg-green-500"],
      danger: ["bg-red-600"],
    },
    trigger: {
      off: "",
      on: "",
    },
    size: {
      sm: ["pr-4"],
      md: ["pr-10"],
      lg: ["pr-15"],
    },
    textSize: {
      none: [],
      sm: ["text-[1rem]"],
      md: ["text-[2rem]"],
      lg: ["text-[3rem]"],
    },
  },
  compoundVariants: [
    {
      size: "sm",
      trigger: "on",
      className: "active:pr-0 active:pl-4",
    },
    {
      size: "md",
      trigger: "on",
      className: "active:pr-5 active:pl-5",
    },
    {
      size: "lg",
      trigger: "on",
      className: "active:pr-7 active:pl-8",
    },
  ],
  defaultVariants: {
    textSize: "none",
    intent: "idle",
    size: "sm",
    trigger: "on",
  },
})

const internalCV = cva("div", {
  variants: {
    padding: {
      sm: ["px-3"],
      md: ["px-10"],
      lg: ["px-15"],
    },
  },
  defaultVariants: {
    padding: "sm",
  },
})

export default function FancyButtonComponent({
  onClick,
  children,
  className,
  size,
  intent,
  trigger,
  textSize,
  padding,
  ...buttonProps
}: { children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof internalCV> &
  VariantProps<typeof buttonCV>) {
  return (
    <button
      {...buttonProps}
      onClick={onClick}
      className={`rounded-lg overflow-hidden border-2 border-[#5D5D5D] ${buttonCV(
        {
          size,
          textSize,
          intent,
          trigger,
        }
      )}`}
    >
      <div
        className={`rounded-md outline outline-2 outline-[#5d5d5d] ${className} ${internalCV(
          { padding }
        )} shadow-lg py-1 leading-none flex items-center text-center bg-[#E8EBF0] text-[#0f2034]`}
      >
        {children}
      </div>
    </button>
  )
}