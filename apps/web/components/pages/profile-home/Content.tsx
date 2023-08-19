"use client"
import useProfile from "../../../hooks/users/useProfile"

const Content = () => {
  const { data, isLoading: basicInfoLoading } = useProfile()
  return (
    <>
      <div className="mt-20">
        <div className="content px-4 md:px-7 lg:px-16 2xl:px-80 mt-28">
          <h1 className="text-gray-800 text-3xl font-bold">
            {!basicInfoLoading ? (
              <>
                {data?.item?.firstName} {data?.item?.lastName} Portal
              </>
            ) : (
              <div className="animate-pulse flex space-x-4">
                <div className="h-9 w-80 bg-slate-200 rounded"></div>
              </div>
            )}
          </h1>
          <h4 className="uppercase text-sm text-gray-500 font-medium tracking-widest mt-2">
            Profile Home
            <span className="text-black mx-2">&gt;</span>
            <span className="text-red-500">Conroe</span>
          </h4>
          <div className="w-full h-0.5 bg-gray-200 mt-6"></div>
        </div>
      </div>
    </>
  )
}

export default Content
