"use client"
import ParentTable from "./ParentTable"

const Content = () => {
  return (
    <div className={`my-20`}>
      <div className="content px-4 md:px-7 lg:px-16 2xl:px-80 mt-28">
        <div>
          <h2 className="text-gray-800 text-[33px] font-semibold leading-none">
            Accounts
          </h2>
          <h4 className="uppercase text-sm text-gray-500 font-medium tracking-widest mt-2">
            Accounts
          </h4>
        </div>
        <div className="w-full h-0.5 bg-gray-200 mt-5"></div>
        <ParentTable />
      </div>
    </div>
  )
}

export default Content
