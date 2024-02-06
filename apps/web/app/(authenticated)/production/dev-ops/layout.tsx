import React from "react"
import SpeedTest from "./_components/speed-test"

interface Props {
  children: React.ReactNode
}

const Layout: React.FC<Props> = async ({ children }) => {
  return (
    <div className="mt-24 mx-auto max-w-6xl space-y-2 mb-32">
      <div className="flex justify-between items-center py-2">
        <div className="flex flex-col space-y-2">
          <h2 className="text-gray-800 text-[33px] font-semibold leading-none">
            Timer and Analytics
          </h2>
          <h4 className="uppercase text-sm text-gray-500 font-medium tracking-widest mt-2">
            Production<span className="text-black mx-2">&gt;</span>DevOps
          </h4>
        </div>
        <SpeedTest />
      </div>

      {children}
    </div>
  )
}

export default Layout
