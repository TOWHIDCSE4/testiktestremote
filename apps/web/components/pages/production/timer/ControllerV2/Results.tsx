import { cva, type VariantProps } from "class-variance-authority"
import { Lato } from "next/font/google"
import FancyButtonComponent from "./FancyButton"

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "block",
  subsets: ["latin", "latin-ext"],
})

export default function ResultsBoardComponent() {
  return (
    <div className={`flex flex-col justify-between pt-4 ${lato.className}`}>
      <div className="flex justify-center">
        {/* <button className="rounded-lg border-2 border-[#5D5D5D] bg-[#DA8D00] pr-4">
          <div className="rounded-md outline outline-2 outline-[#5d5d5d] px-10 py-0 leading-none flex items-center text-center bg-[#E8EBF0] text-[#0f2034] text-[3rem] font-bold">
            START
          </div>
        </button> */}
        <FancyButtonComponent
          padding={"md"}
          textSize={"lg"}
          className="font-bold"
        >
          START
        </FancyButtonComponent>
      </div>
      <div className="">
        <div className="grid grid-cols-12 gap-1 font-medium leading-tight text-normal">
          <div className="col-span-6 text-[#858585] text-right">35 : </div>
          <div className="col-span-6 text-[#0f2034] font-semibold">UNIT PH</div>
          <div className="col-span-6 text-[#858585] text-right">254.98 : </div>
          <div className="col-span-6 text-[#0f2034] font-semibold">
            TOTAL TONS
          </div>
          <div className="col-span-6 text-[#858585] text-right">67.678 : </div>
          <div className="col-span-6 text-[#0f2034] font-semibold">TONS PH</div>
        </div>
        <div className="grid w-full grid-cols-12">
          <div className="col-span-4"></div>
          <div className="col-span-8 text-xl text-[#0f2034] uppercase font-extrabold">
            TOTAL UNITS
          </div>
        </div>
        <div className="font-bold text-[12rem] leading-none -mt-4">
          <span className="text-[#bdbdbd] leading-none">0</span>
          <span className="text-[#0f2034] leading-none">12</span>
        </div>
      </div>
    </div>
  )
}
