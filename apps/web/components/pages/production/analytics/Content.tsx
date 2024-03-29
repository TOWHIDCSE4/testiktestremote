"use client"

import isDev from "../../../../helpers/isDev"
import Analytics from "./Analytics"

const Content = () => {
  return (
    <>
      <div className={`my-20 pb-10`}>
        <div className="content px-4 md:px-7 lg:px-16 2xl:px-44 2xl:max-w-7xl mx-auto mt-28">
          <h1 className="text-gray-800 text-3xl font-bold">Analytics</h1>
          <h4 className="uppercase text-sm text-gray-500 font-medium tracking-widest mt-2">
            Production
            <span className="text-black mx-2">&gt;</span>
            <span className="text-red-500">Analytics</span>
          </h4>
          {isDev && (
            <div className="w-full h-0.5 bg-gray-200 mt-6">
              <Analytics />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Content
